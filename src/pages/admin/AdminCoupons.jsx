import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Ticket, Plus, Edit, Trash2, X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form mặc định
  const initialForm = {
    code: '',
    discountType: 'PERCENTAGE', 
    discountValue: '',
    minOrderValue: 0,
    maxDiscountAmount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '', // Số lượng mã (bỏ trống là không giới hạn)
    userUsageLimit: 1, // Mỗi người được dùng 1 lần
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  // Lấy danh sách mã giảm giá
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // Nhớ gọi đường dẫn /all mà chúng ta đã làm cho Admin ở Backend
      const res = await axios.get('http://localhost:3000/api/coupons/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách mã giảm giá!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Hàm hỗ trợ: Chuyển ngày từ DB sang chuẩn của ô input datetime-local HTML
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Bù trừ múi giờ để hiển thị đúng giờ Việt Nam
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16); 
  };

  // Xử lý khi mở Modal (Thêm mới hoặc Sửa)
  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon._id);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue || 0,
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        validFrom: formatDateTimeForInput(coupon.validFrom),
        validUntil: formatDateTimeForInput(coupon.validUntil),
        usageLimit: coupon.usageLimit || '',
        userUsageLimit: coupon.userUsageLimit || 1,
        isActive: coupon.isActive
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setEditingId(null);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Submit Form (Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.validFrom || !formData.validUntil) {
      return toast.warning("Vui lòng nhập đủ các thông tin bắt buộc!");
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Chuyển chữ hoa mã code cho đẹp
      const submitData = { ...formData, code: formData.code.toUpperCase() };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/coupons/${editingId}`, submitData, config);
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        await axios.post('http://localhost:3000/api/coupons', submitData, config);
        toast.success("Thêm mã giảm giá thành công!");
      }
      
      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu mã!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa mã
  const handleDelete = async (id, code) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mã "${code}"?`)) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa mã giảm giá!");
      fetchCoupons();
    } catch (error) {
      toast.error("Không thể xóa mã giảm giá này!");
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý Mã giảm giá</h1>
          <p className="text-gray-500 font-medium mt-1">Tạo các chương trình khuyến mãi để kích thích mua sắm</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#0071e3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all">
          <Plus size={18} /> Thêm mã mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="p-5">Mã (Code)</th>
                <th className="p-5 text-right">Mức giảm</th>
                <th className="p-5">Thời gian áp dụng</th>
                <th className="p-5 text-center">Đã dùng / Giới hạn</th>
                <th className="p-5 text-center">Trạng thái</th>
                <th className="p-5 text-center w-28">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {coupons.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-medium">Chưa có mã giảm giá nào.</td></tr>
              ) : (
                coupons.map((coupon) => {
                  const now = new Date().getTime();
                  const isExpired = now > new Date(coupon.validUntil).getTime();

                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5">
                        <span className="font-black text-lg text-[#0071e3] bg-blue-50 px-3 py-1 rounded border border-blue-100 uppercase">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <p className="font-bold text-[#e30019] text-base">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString('vi-VN')} đ`}
                        </p>
                        <p className="text-xs text-gray-500">Đơn tối thiểu: {coupon.minOrderValue?.toLocaleString('vi-VN')} đ</p>
                      </td>
                      <td className="p-5">
                        <p className="text-xs font-medium text-gray-600">Từ: {new Date(coupon.validFrom).toLocaleString('vi-VN')}</p>
                        <p className="text-xs font-medium text-gray-600 mt-1">Đến: {new Date(coupon.validUntil).toLocaleString('vi-VN')}</p>
                      </td>
                      <td className="p-5 text-center font-bold">
                        <span className="text-blue-600">{coupon.usedCount}</span> / {coupon.usageLimit || '∞'}
                      </td>
                      <td className="p-5 text-center">
                        {isExpired ? (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-24 mx-auto"><XCircle size={14}/> Hết hạn</span>
                        ) : coupon.isActive ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-24 mx-auto"><CheckCircle2 size={14}/> Đang chạy</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-24 mx-auto"><XCircle size={14}/> Đã khóa</span>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenModal(coupon)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(coupon._id, coupon.code)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*Modal thêm/sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-2xl">
              <h3 className="font-black text-xl text-gray-800 uppercase flex items-center gap-2">
                <Ticket className="text-[#0071e3]" size={24} /> 
                {editingId ? 'Cập nhật Mã giảm giá' : 'Thêm Mã giảm giá'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
              <form id="couponForm" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Mã và Trạng thái */}
                <div className="grid grid-cols-3 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mã (Code) *</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none uppercase font-bold text-[#0071e3]" placeholder="VD: TET2026, SALELON..." />
                  </div>
                  <div className="flex flex-col justify-center pt-5 pl-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
                      <span className="font-bold text-gray-700">Đang hoạt động</span>
                    </label>
                  </div>
                </div>

                {/* Loại giảm và Mức giảm */}
                <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Loại giảm giá *</label>
                    <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                      <option value="PERCENTAGE">Giảm theo Phần trăm (%)</option>
                      <option value="FIXED">Giảm số tiền cố định (VNĐ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#e30019] mb-1">Mức giảm *</label>
                    <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-[#e30019] font-bold" placeholder={formData.discountType === 'PERCENTAGE' ? 'VD: 10 (%)' : 'VD: 50000 (đ)'} />
                  </div>
                </div>

                {/* Điều kiện */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Đơn tối thiểu (VNĐ)</label>
                    <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="VD: 100000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Giảm tối đa (Nếu chọn %)</label>
                    <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} min="0" disabled={formData.discountType === 'FIXED'} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100" placeholder="VD: 500000" />
                  </div>
                </div>

                {/* Thời gian */}
                <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Từ ngày *</label>
                    <input type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Đến ngày *</label>
                    <input type="datetime-local" name="validUntil" value={formData.validUntil} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>

                {/* Giới hạn sử dụng */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tổng lượt dùng hệ thống</label>
                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Bỏ trống = Không giới hạn" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Số lượt dùng / 1 Người *</label>
                    <input type="number" name="userUsageLimit" value={formData.userUsageLimit} onChange={handleChange} min="1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-5 border-t bg-white flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
              <button type="submit" form="couponForm" disabled={isSubmitting} className="px-8 py-2.5 bg-[#0071e3] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu Mã Giảm Giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;