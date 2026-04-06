import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { orderApi } from '../services/orderApi';

// Danh sách các Tab 
const TABS = [
  { id: '', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ thanh toán' },
  { id: 'CONFIRMED', label: 'Chờ giao hàng' },
  { id: 'SHIPPING', label: 'Vận chuyển' },
  { id: 'DELIVERED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' }
];

const Orders = () => {
  const { user, addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Hàm mua lại đơn hàng 
  const handleBuyAgain = async (order) => {
    const itemsToBuy = order.items || order.orderItems || []; 
    
    if(itemsToBuy.length === 0) return; // Nếu không có sản phẩm nào trong đơn thì thôi

    // Thêm từng sản phẩm vào giỏ hàng 
    try {
      for (const item of itemsToBuy) {
        await addToCart(item.computer, item.quantity);
      }
      navigate('/cart');
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // Nếu chưa đăng nhập thì chuyển về trang Login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderApi.getMyOrders(activeTab);
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng!');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  // Hàm Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    setCancelingId(orderId);
    try {
      await orderApi.cancelOrder(orderId);
      toast.success('Hủy đơn hàng thành công!');
      fetchOrders(); // Tải lại danh sách sau khi hủy
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng lúc này');
    } finally {
      setCancelingId(null);
    }
  };

  // Xử lý link ảnh
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };

  // Dịch trạng thái sang Tiếng Việt cho đẹp
  const getStatusText = (status) => {
    const statusMap = {
      'UNPAID': 'Chưa thanh toán',
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đang chuẩn bị hàng',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Giao hàng thành công',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    if (status === 'DELIVERED') return 'text-green-600';
    if (status === 'CANCELLED') return 'text-red-500';
    return 'text-[#e30019]';
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-12 pt-6">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row gap-6">
        
        {/* MENU TRÁI (Tùy chọn hiển thị) */}
        <div className="w-full md:w-[250px] shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
              <img 
                src={
                  !user?.avatar ? 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg' 
                  : user.avatar.startsWith('http') ? user.avatar 
                  : `http://localhost:3000${user.avatar}`
                } 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-gray-800 line-clamp-1">{user?.fullname || user?.username}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"> Sửa hồ sơ</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            <Link to="/profile" className="flex items-center gap-2 hover:text-[#ee4d2d]">
               Tài khoản của tôi
            </Link>
            {/* Chữ Đơn mua được in đậm và đổi màu đỏ để biết đang ở trang này */}
            <Link to="/orders" className="flex items-center gap-2 text-[#ee4d2d]">
               Đơn Mua
            </Link>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-t-xl flex overflow-x-auto shadow-sm no-scrollbar border-b">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 text-sm font-medium transition-colors whitespace-nowrap text-center ${
                  activeTab === tab.id 
                    ? 'text-[#e30019] border-b-2 border-[#e30019]' 
                    : 'text-gray-600 hover:text-[#e30019]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Danh sách đơn hàng */}
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <div className="bg-white p-10 flex flex-col items-center justify-center rounded-xl shadow-sm text-gray-500">
                <Loader2 size={40} className="animate-spin text-[#e30019] mb-4" />
                <p>Đang tải đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-20 flex flex-col items-center justify-center rounded-xl shadow-sm">
                <Package size={80} className="text-gray-200 mb-4" />
                <p className="text-lg font-bold text-gray-600">Chưa có đơn hàng</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  
                  {/* Header Đơn hàng */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="text-xs font-bold text-gray-800 bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                      Mã đơn: <span className="text-[#0071e3] uppercase">#{order._id.substring(16).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase">
                      <span className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn */}
                  <div className="p-5 divide-y divide-gray-100">
                    {order.orderItems?.map(item => (
                      <div key={item._id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                        <img 
                          src={getImageUrl(item.computer?.image || item.image)} 
                          alt={item.productName} 
                          className="w-20 h-20 object-cover border border-gray-200 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 line-clamp-2 text-sm hover:text-cyan-600 transition-colors">
                            <Link to={`/product/${item.computer?.slug}`}>{item.productName || item.computer?.name}</Link>
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#e30019] text-sm">{(item.price).toLocaleString('vi-VN')} đ</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Đơn hàng */}
                  <div className="p-5 border-t border-gray-100 bg-orange-50/30 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">Thành tiền:</span>
                        <span className="text-xl font-black text-[#e30019]">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        
                        {order.status === 'CANCELLED' && (
                          <p className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-md border border-red-100">
                            Lý do hủy: {order.cancelReason || 'Không có lý do cụ thể'}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancelingId === order._id}
                              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-2"
                            >
                              {cancelingId === order._id ? <Loader2 size={16} className="animate-spin"/> : 'Hủy đơn hàng'}
                            </button>
                          )}
                          {order.status === 'CANCELLED' && (
                            <button 
                              onClick={() => handleBuyAgain(order)} 
                              className="px-5 py-2 border border-[#ee4d2d] text-[#ee4d2d] bg-white hover:bg-red-50 text-sm font-bold rounded transition-colors"
                            >
                              Mua lại
                            </button>
                          )}
                          <Link 
                            to={`/orders/${order._id}`} 
                            className="px-6 py-2 bg-[#e30019] hover:bg-red-700 text-white rounded font-medium text-sm transition-colors shadow-sm"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Orders;