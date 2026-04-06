import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShoppingBag, Loader2, Eye, Filter, X, MapPin, Ticket, CreditCard, Box, CheckCircle2, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('ALL');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]); 
  const [loadingDetails, setLoadingDetails] = useState(false); 

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // BỔ SUNG TRẠNG THÁI 'PAID' VÀO MÁY TRẠNG THÁI
  const getAvailableOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING': return ['PENDING', 'CONFIRMED', 'CANCELLED']; 
      case 'PAID': return ['PAID', 'CONFIRMED', 'SHIPPING', 'CANCELLED']; // Đã thanh toán thì có thể chuẩn bị hàng
      case 'CONFIRMED': return ['CONFIRMED', 'SHIPPING', 'CANCELLED']; 
      case 'SHIPPING': return ['SHIPPING', 'DELIVERED']; 
      case 'DELIVERED': 
      case 'CANCELLED': return [currentStatus]; 
      default: return [currentStatus];
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    let finalReason = null;
    if (newStatus === 'CANCELLED') {
      const reason = window.prompt("BẠN ĐANG HỦY ĐƠN HÀNG!\nVui lòng nhập lý do hủy để thông báo cho khách hàng!");
  
      if (reason === null) {
        return; 
      }
      
      if (reason.trim() === '') {
        toast.error('Bắt buộc phải nhập lý do khi hủy đơn!');
        return;
      }
      finalReason = reason; 
    }

    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, 
        { 
          status: newStatus, 
          cancelReason: finalReason 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders(); 
      
      if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({...selectedOrder, status: newStatus, cancelReason: finalReason});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = async (order) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    setSelectedOrderItems([]);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/orders/${order._id}/admin-detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.orderItem) {
        setSelectedOrderItems(res.data.orderItem);
      }
    } catch (error) {
      toast.error("Lỗi khi tải sản phẩm của đơn hàng!");
    } finally {
      setLoadingDetails(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };

  // BỔ SUNG MÀU SẮC CHO TRẠNG THÁI 'PAID'
  const getStatusStyle = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200'; // Màu xanh ngọc sang trọng cho VNPay
      case 'CONFIRMED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'SHIPPING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 font-medium mt-1">Theo dõi và cập nhật trạng thái vận chuyển</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm">
          <Filter size={18} className="text-gray-400 ml-2" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none pr-4 py-1 cursor-pointer"
          >
            <option value="ALL">Tất cả đơn hàng</option>
            <option value="PENDING">Chờ xác nhận (COD)</option>
            <option value="PAID">Đã thanh toán (VNPAY)</option>
            <option value="CONFIRMED">Đang chuẩn bị</option>
            <option value="SHIPPING">Đang giao hàng</option>
            <option value="DELIVERED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ShoppingBag size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-bold text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <th className="p-5">Mã Đơn</th>
                  <th className="p-5">Khách hàng / SĐT</th>
                  <th className="p-5">Ngày đặt</th>
                  <th className="p-5 text-right">Tổng tiền</th>
                  <th className="p-5 text-center">Trạng thái hiện tại</th>
                  <th className="p-5 text-center">Cập nhật trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const availableOptions = getAvailableOptions(order.status);
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-5 font-black text-cyan-600">
                        #{order._id.substring(16).toUpperCase()}
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-gray-900">{order.user?.fullname || order.user?.username || 'Khách vãng lai'}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </td>
                      <td className="p-5 text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-5 text-right font-black text-[#e30019]">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </td>
                      
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1.5 rounded-md text-[11px] font-black border tracking-wider ${getStatusStyle(order.status)}`}>
                          {order.status === 'PENDING' && 'Chờ xác nhận'}
                          {order.status === 'PAID' && 'Đã thanh toán'}
                          {order.status === 'CONFIRMED' && 'Đang chuẩn bị'}
                          {order.status === 'SHIPPING' && 'Đang giao'}
                          {order.status === 'DELIVERED' && 'Hoàn thành'}
                          {order.status === 'CANCELLED' && 'Đã hủy'}
                        </span>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleOpenDetail(order)}
                            className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all border border-cyan-100 shadow-sm"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye size={18}/>
                          </button>

                          {updatingId === order._id ? (
                            <div className="w-[140px] flex justify-center"><Loader2 size={20} className="animate-spin text-cyan-600" /></div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              disabled={order.status === 'CANCELLED' || order.status === 'DELIVERED'}
                              className="w-[140px] bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg px-2 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:bg-gray-100 disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                              {availableOptions.includes('PENDING') && <option value="PENDING">Chờ xác nhận</option>}
                              {availableOptions.includes('PAID') && <option value="PAID">Đã thanh toán</option>}
                              {availableOptions.includes('CONFIRMED') && <option value="CONFIRMED">Đang chuẩn bị</option>}
                              {availableOptions.includes('SHIPPING') && <option value="SHIPPING">Giao cho Vận chuyển</option>}
                              {availableOptions.includes('DELIVERED') && <option value="DELIVERED">Đã giao thành công</option>}
                              {availableOptions.includes('CANCELLED') && <option value="CANCELLED">Hủy đơn hàng</option>}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Chi tiết đơn hàng*/}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden scale-in-center">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="font-black text-xl text-gray-800 uppercase flex items-center gap-2">
                  <Box className="text-cyan-600" size={24} /> Chi tiết đơn hàng
                  {/* Badge trạng thái đơn hàng */}
                  <span className={`ml-3 px-3 py-1 rounded-md text-[11px] font-black tracking-wider border ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status === 'PENDING' && 'Chờ xác nhận'}
                    {selectedOrder.status === 'PAID' && 'Đã thanh toán'}
                    {selectedOrder.status === 'CONFIRMED' && 'Đang chuẩn bị'}
                    {selectedOrder.status === 'SHIPPING' && 'Đang giao'}
                    {selectedOrder.status === 'DELIVERED' && 'Hoàn thành'}
                    {selectedOrder.status === 'CANCELLED' && 'Đã hủy'}
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Mã đơn: <span className="text-cyan-600 font-bold">#{selectedOrder._id.substring(16).toUpperCase()}</span> | Đặt lúc: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[#f8fafc]">
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><MapPin size={16}/> Thông tin giao hàng</h4>
                  <p className="font-bold text-gray-800 text-lg mb-1">{selectedOrder.user?.fullname || selectedOrder.user?.username || 'Khách vãng lai'}</p>
                  <p className="text-gray-600 font-medium mb-1">Số điện thoại: <span className="text-gray-900">{selectedOrder.phone}</span></p>
                  <p className="text-gray-600 font-medium">Địa chỉ: <span className="text-gray-900">{selectedOrder.shippingAddress || 'Không cung cấp'}</span></p>
                </div>
                
                <div className="flex-1 md:border-l md:border-gray-100 md:pl-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><CreditCard size={16}/> Trạng thái thanh toán</h4>
                  
                  {selectedOrder.status === 'CANCELLED' ? (
                    <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-2">
                      <XCircle size={18} /> Giao dịch thất bại / Đã hủy
                    </div>
                  ) : selectedOrder.paymentMethod === 'VNPAY' || selectedOrder.status === 'PAID' ? (
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-2">
                      <CheckCircle2 size={18} /> Đã thanh toán (VNPAY)
                    </div>
                  ) : (
                    <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Thanh toán khi nhận hàng (COD)
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 ml-1">Sản phẩm trong đơn</h4>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        
                {loadingDetails ? (
                   <div className="p-8 flex justify-center"><Loader2 size={24} className="animate-spin text-cyan-600" /></div>
                ) : selectedOrderItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {selectedOrderItems.map(item => (
                      <div key={item._id} className="p-4 flex gap-4 items-center hover:bg-gray-50/50 transition-colors">
                        <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
                          <img src={getImageUrl(item.computer?.image || item.image)} alt="Product" className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800 line-clamp-2">{item.productName || item.computer?.name}</h5>
                        </div>
                        
                        <div className="text-right flex flex-col justify-center min-w-[120px]">
                          <p className="text-sm font-bold text-gray-500 mb-1">
                            {(item.price).toLocaleString('vi-VN')} đ <span className="text-gray-400 mx-1">x</span> {item.quantity}
                          </p>
                          <p className="font-black text-cyan-700 text-lg">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 font-medium">Không có dữ liệu sản phẩm.</div>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-end space-y-3">
                
                {(selectedOrder.discountAmount > 0) && (
                  <>
                    <div className="flex justify-between w-full md:w-1/2 text-gray-600 font-medium">
                      <span>Tổng tiền hàng:</span>
                      <span>
                        {((selectedOrder.totalAmount || 0) + (selectedOrder.discountAmount || 0)).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    
                    <div className="flex justify-between w-full md:w-1/2 text-emerald-600 font-medium">
                      <span className="flex items-center gap-1"><Ticket size={16}/> Giảm giá {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}:</span>
                      <span>- {selectedOrder.discountAmount?.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </>
                )}
                
                <div className={`flex justify-between w-full md:w-1/2 font-black text-lg ${selectedOrder.discountAmount > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
                  <span className="text-gray-800">Thành tiền:</span>
                  <span className="text-[#e30019] text-2xl">{selectedOrder.totalAmount?.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;