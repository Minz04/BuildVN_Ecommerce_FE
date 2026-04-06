import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Layers, Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Lấy dữ liệu
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categories');
      setCategories(res.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh mục!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý Form
  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setFormData({ name: category.name || '', description: category.description || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.warning("Vui lòng nhập tên danh mục!");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/categories/${editingId}`, formData, config);
        toast.success("Cập nhật thành công!");
      } else {
        await axios.post('http://localhost:3000/api/categories', formData, config);
        toast.success("Thêm danh mục thành công!");
      }
      
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    // Xác nhận trước khi xóa
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng!`)) return;

    try {
      // Lấy token để xác thực
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa danh mục!");
      fetchCategories();
    } catch (error) {
      toast.error("Không thể xóa danh mục này!");
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  {/* CONTAINER CHÍNH */}
  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý Danh mục</h1>
          <p className="text-gray-500 font-medium mt-1">Phân loại sản phẩm để khách hàng dễ tìm kiếm</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#0071e3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all">
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="p-5">Tên danh mục</th>
                <th className="p-5">Mô tả</th>
                <th className="p-5 text-center w-32">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {categories.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-10 text-gray-400 font-medium">Chưa có danh mục nào.</td></tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-bold text-gray-900">{category.name}</td>
                    <td className="p-5 text-gray-500 line-clamp-1 mt-1">{category.description || 'Không có mô tả'}</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleOpenModal(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(category._id, category.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thêm/sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-xl text-gray-800 uppercase flex items-center gap-2">
                <Layers className="text-[#0071e3]" size={24} /> 
                {editingId ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 bg-gray-50">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tên danh mục *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" 
                    placeholder="VD: Laptop Gaming, Bàn phím cơ..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả (Không bắt buộc)</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none" 
                    placeholder="Mô tả ngắn gọn về danh mục này..." 
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="p-5 border-t bg-white flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
              <button type="submit" form="categoryForm" disabled={isSubmitting} className="px-8 py-2.5 bg-[#0071e3] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu Danh Mục'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;