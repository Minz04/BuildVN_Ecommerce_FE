import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store, Plus, Edit, Trash2, MapPin, Phone, Mail, Map, X, CheckCircle2, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal (Popup Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', email: '', mapLink: '', isActive: true
  });

  // Fetch dữ liệu
  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/stores/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách cửa hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  // Xử lý mở form thêm/sửa
  const handleOpenModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name, address: store.address, phone: store.phone, 
        email: store.email, mapLink: store.mapLink, isActive: store.isActive
      });
    } else {
      setEditingStore(null);
      setFormData({ name: '', address: '', phone: '', email: '', mapLink: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  // Xử lý Submit Form 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingStore) {
        await axios.put(`http://localhost:3000/api/stores/${editingStore._id}`, formData, config);
        toast.success('Cập nhật cửa hàng thành công!');
      } else {
        await axios.post('http://localhost:3000/api/stores', formData, config);
        toast.success('Thêm cửa hàng mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchStores(); // Load lại bảng
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id, name) => {
    if (!window.confirm(`⚠️ NGUY HIỂM: Bạn có chắc chắn muốn XÓA cửa hàng "${name}" không?`)) return;
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa cửa hàng thành công!');
      fetchStores();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa!');
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <Store className="text-cyan-600" size={28} /> Quản lý Hệ thống Cửa hàng
          </h1>
          <p className="text-gray-500 font-medium mt-1">Thêm, sửa, xóa và quản lý trạng thái các chi nhánh</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} /> Thêm Cửa Hàng
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="p-5 w-64">Tên Cửa hàng</th>
                <th className="p-5">Thông tin liên hệ & Bản đồ</th>
                <th className="p-5 text-center w-32">Trạng thái</th>
                <th className="p-5 text-center w-32">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400 font-medium">Chưa có cửa hàng nào. Hãy thêm mới!</td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-gray-900 text-base">{store.name}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-start gap-1"><MapPin size={14} className="mt-0.5 shrink-0"/> {store.address}</p>
                    </td>
                    <td className="p-5 text-gray-600 font-medium space-y-1.5 text-xs">
                      <p className="flex items-center gap-2"><Phone size={14} className="text-cyan-600"/> {store.phone}</p>
                      <p className="flex items-center gap-2"><Mail size={14} className="text-cyan-600"/> {store.email}</p>
                      <p className="flex items-center gap-2">
                        <Map size={14} className="text-cyan-600"/> 
                        <a href={store.mapLink} target="_blank" rel="noreferrer" className="text-cyan-600 hover:underline">Xem Google Maps</a>
                      </p>
                    </td>
                    <td className="p-5 text-center">
                      {store.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold"><CheckCircle2 size={14}/> Hoạt động</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-md text-xs font-bold"><XCircle size={14}/> Tạm nghỉ</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(store)} className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors border border-yellow-200" title="Sửa"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(store._id, store.name)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200" title="Xóa"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden scale-in-center flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="font-black text-xl text-gray-800 uppercase flex items-center gap-2">
                <Store className="text-cyan-600" size={24} /> 
                {editingStore ? 'Sửa thông tin cửa hàng' : 'Thêm cửa hàng mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tên chi nhánh / Cửa hàng <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" placeholder="VD: BUILDVN - Chi nhánh Quận 1" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" placeholder="VD: 0909.123.456" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email liên hệ <span className="text-red-500">*</span></label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" placeholder="VD: cskh@buildvn.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link Google Maps <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.mapLink} onChange={e => setFormData({...formData, mapLink: e.target.value})} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm" placeholder="Paste link rút gọn của Google Maps vào đây" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-cyan-600 cursor-pointer" />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer select-none">Cửa hàng đang hoạt động (Hiển thị cho khách hàng)</label>
              </div>
            </form>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">Hủy bỏ</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors shadow-sm">
                {editingStore ? 'Lưu thay đổi' : 'Thêm cửa hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;