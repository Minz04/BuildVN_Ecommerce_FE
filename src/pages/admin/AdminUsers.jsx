import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Users, Lock, Unlock, Gift, X, Loader2, ShieldAlert, CheckCircle2, Edit, Trash2, Plus, UserPlus } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Chứa danh sách vai trò
  const [loading, setLoading] = useState(true);

  // States cho Modal Thêm/Sửa Người Dùng
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserSubmitting, setIsUserSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const initialUserForm = { username: '', fullname: '', email: '', password: '', phone: '', role: '' };
  const [userFormData, setUserFormData] = useState(initialUserForm);

  // States cho Modal Tặng Quà
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isGifting, setIsGifting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');

  // 1. Fetch dữ liệu Người dùng & Vai trò
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, rolesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/users', config),
        axios.get('http://localhost:3000/api/roles', config) // API lấy roles đã có sẵn trong app.js
      ]);

      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===================== LOGIC CRUD NGƯỜI DÙNG =====================

  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUserId(user._id);
      setUserFormData({
        username: user.username || '',
        fullname: user.fullname || '',
        email: user.email || '',
        password: '', // Không hiện password cũ
        phone: user.phone || '',
        role: user.role?._id || user.role || '' // Lấy ID của role để map vào thẻ select
      });
    } else {
      setEditingUserId(null);
      setUserFormData(initialUserForm);
    }
    setIsUserModalOpen(true);
  };

  const handleUserFormChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userFormData.email || !userFormData.role) return toast.warning("Email và Vai trò là bắt buộc!");

    setIsUserSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = { ...userFormData };
      // Nếu đang sửa mà bỏ trống pass -> Không cập nhật pass
      if (editingUserId && !payload.password) delete payload.password;

      if (editingUserId) {
        await axios.put(`http://localhost:3000/api/users/${editingUserId}`, payload, config);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        if (!payload.password) {
            setIsUserSubmitting(false);
            return toast.warning("Vui lòng nhập mật khẩu cho tài khoản mới!");
        }
        await axios.post('http://localhost:3000/api/users', payload, config);
        toast.success("Thêm người dùng thành công!");
      }
      
      fetchData();
      setIsUserModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu người dùng!");
    } finally {
      setIsUserSubmitting(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`XÓA TÀI KHOẢN: Bạn có chắc muốn xóa vĩnh viễn "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Đã xóa người dùng!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa tài khoản này!");
    }
  };

  const handleToggleLock = async (userId, userName, currentStatus) => {
    const actionName = currentStatus ? 'MỞ KHÓA' : 'KHÓA';
    if (!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản của "${userName}"?`)) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.put(`http://localhost:3000/api/users/${userId}/toggle-lock`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi khi ${actionName} tài khoản`);
    }
  };


  // ===================== LOGIC TẶNG QUÀ (CSKH) =====================

  const handleOpenGiftModal = async (user) => {
    setSelectedUser(user);
    setIsGiftModalOpen(true);
    setSelectedCouponCode(''); 
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/coupons/all', { headers: { Authorization: `Bearer ${token}` } });
      
      let activeCoupons = [];
      for(let i = 0; i < res.data.length; i++) {
         if (res.data[i].isActive === true) activeCoupons.push(res.data[i]);
      }
      setAvailableCoupons(activeCoupons);
    } catch (error) { toast.error("Không tải được danh sách mã giảm giá!"); }
  };

  const handleGiftCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCouponCode) return toast.warning("Vui lòng chọn mã giảm giá!");
    setIsGifting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post('http://localhost:3000/api/coupons/gift', { userId: selectedUser._id, couponCode: selectedCouponCode }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Đã tặng mã thành công!`);
      setIsGiftModalOpen(false);
    } catch (error) { toast.error(error.response?.data?.message || "Lỗi khi tặng mã!"); } 
    finally { setIsGifting(false); }
  };


  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý Người dùng</h1>
          <p className="text-gray-500 font-medium mt-1">Thêm sửa, phân quyền và chăm sóc khách hàng</p>
        </div>
        <button onClick={() => handleOpenUserModal()} className="flex items-center gap-2 bg-[#0071e3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all">
          <UserPlus size={18} /> Thêm tài khoản
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="p-5">Khách hàng</th>
                <th className="p-5">Thông tin liên hệ</th>
                <th className="p-5 text-center">Vai trò</th>
                <th className="p-5 text-center">Trạng thái</th>
                <th className="p-5 text-center w-48">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {users.map((user) => {
                // FIX LỖI HIỂN THỊ ID VAI TRÒ Ở ĐÂY
                const roleName = user.role?.name || user.role || 'Khách hàng';

                return (
                  <tr key={user._id} className={`hover:bg-gray-50/50 transition-colors ${user.isLocked ? 'bg-red-50/20' : ''}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm shrink-0">
                          {(user.fullname || user.username || 'U')[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.fullname || user.username || 'Chưa cập nhật'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-medium text-gray-800">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.phone || 'Chưa có SĐT'}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded text-[11px] font-black tracking-wider uppercase border ${roleName === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {roleName}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      {user.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100"><Lock size={12}/> Đã khóa</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100"><CheckCircle2 size={12}/> Hoạt động</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-1">
                        {roleName !== 'admin' && (
                          <button onClick={() => handleOpenGiftModal(user)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-transparent hover:border-cyan-200" title="Tặng mã giảm giá"><Gift size={16} /></button>
                        )}
                        <button onClick={() => handleToggleLock(user._id, user.fullname || user.username, user.isLocked)} className={`p-2 rounded-lg transition-colors border border-transparent ${user.isLocked ? 'text-green-600 hover:bg-green-50 hover:border-green-200' : 'text-orange-500 hover:bg-orange-50 hover:border-orange-200'}`} title={user.isLocked ? "Mở khóa" : "Khóa tài khoản"}>
                          {user.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button onClick={() => handleOpenUserModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Sửa thông tin"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteUser(user._id, user.fullname || user.username)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Xóa tài khoản"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODAL THÊM / SỬA NGƯỜI DÙNG ===================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-2xl">
              <h3 className="font-black text-xl text-gray-800 uppercase flex items-center gap-2">
                <Users className="text-[#0071e3]" size={24} /> 
                {editingUserId ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
              <form id="userForm" onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                    <input type="text" name="fullname" value={userFormData.fullname} onChange={handleUserFormChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" placeholder="VD: Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập (Username)</label>
                    <input type="text" name="username" value={userFormData.username} onChange={handleUserFormChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={userFormData.email} onChange={handleUserFormChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                    <input type="tel" name="phone" value={userFormData.phone} onChange={handleUserFormChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Vai trò (Role) *</label>
                    <select name="role" value={userFormData.role} onChange={handleUserFormChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500 font-bold text-cyan-700">
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu {editingUserId && '(Bỏ trống nếu không đổi)'}</label>
                    <input type="password" name="password" value={userFormData.password} onChange={handleUserFormChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" placeholder="Nhập mật khẩu..." />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100">Hủy</button>
              <button type="submit" form="userForm" disabled={isUserSubmitting} className="px-8 py-2.5 bg-[#0071e3] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                {isUserSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL TẶNG MÃ GIẢM GIÁ (Giữ nguyên như cũ) ===================== */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-cyan-50/50 rounded-t-2xl">
              <h3 className="font-black text-xl text-cyan-800 uppercase flex items-center gap-2">
                <Gift className="text-cyan-600" size={24} /> Tặng Voucher CSKH
              </h3>
              <button onClick={() => setIsGiftModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>

            <div className="p-6 bg-white">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-gray-500 mb-1">Đang tặng cho khách hàng:</p>
                <p className="font-black text-gray-800 text-lg">{selectedUser?.fullname || selectedUser?.username}</p>
                <p className="text-sm font-medium text-gray-600">{selectedUser?.email}</p>
              </div>

              <form id="giftForm" onSubmit={handleGiftCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Chọn Mã giảm giá từ Kho *</label>
                  {availableCoupons.length === 0 ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                      <ShieldAlert className="text-red-500 shrink-0" size={20}/>
                      <p className="text-sm text-red-700 font-medium">Bạn chưa có mã giảm giá đang hoạt động.</p>
                    </div>
                  ) : (
                    <select value={selectedCouponCode} onChange={(e) => setSelectedCouponCode(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer font-bold text-gray-700">
                      <option value="">-- Bấm để chọn mã giảm giá --</option>
                      {availableCoupons.map(coupon => (
                        <option key={coupon._id} value={coupon.code}>
                          {coupon.code} - Giảm {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString('vi-VN')}đ`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsGiftModalOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100">Hủy</button>
              <button type="submit" form="giftForm" disabled={isGifting || availableCoupons.length === 0} className="px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg flex items-center gap-2 hover:opacity-90">
                {isGifting ? <Loader2 className="animate-spin" /> : 'Gửi Tặng Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;