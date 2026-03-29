import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/orderApi';
import { reviewApi } from '../services/reviewApi';
import { toast } from 'react-toastify';
import { 
  ChevronLeft, FileText, MapPin, Truck, CheckCircle, 
  XCircle, Loader2, Store, ShieldCheck, Star
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === STATE CHO CHỨC NĂNG ĐÁNH GIÁ ===
  const [reviewModal, setReviewModal] = useState({ isOpen: false, item: null, isChecking: false });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await orderApi.getOrderDetail(id);
        setOrder(res.data.order);
        setItems(res.data.orderItem);
      } catch (error) {
        toast.error('Không thể tải chi tiết đơn hàng!');
        navigate('/orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetail();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };

  // === CÁC HÀM XỬ LÝ ĐÁNH GIÁ ===
  const handleOpenReview = async (item) => {
    setReviewModal({ isOpen: true, item, isChecking: true });
    try {
      // Gọi API kiểm tra xem đã đánh giá chưa
      const res = await reviewApi.checkReview(item.computer._id, order._id);
      if (res.data.review) {
        // Nếu có rồi thì nạp dữ liệu cũ vào form để sửa
        setReviewForm({ rating: res.data.review.rating, comment: res.data.review.comment });
      } else {
        // Chưa có thì form mới tinh 5 sao
        setReviewForm({ rating: 5, comment: '' });
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin đánh giá");
    } finally {
      setReviewModal(prev => ({ ...prev, isChecking: false }));
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      return toast.warning("Vui lòng nhập nội dung đánh giá!");
    }
    setIsSubmitting(true);
    try {
      await reviewApi.submitReview({
        computerId: reviewModal.item.computer._id,
        orderId: order._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success("Đánh giá của bạn đã được lưu lại!");
      setReviewModal({ isOpen: false, item: null, isChecking: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể gửi đánh giá lúc này");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Loader2 size={40} className="animate-spin text-[#ee4d2d]" />
      </div>
    );
  }

  if (!order) return null;

  const steps = [
    { key: 'PENDING', label: 'Đơn Hàng Đã Đặt', icon: FileText },
    { key: 'CONFIRMED', label: 'Đã Xác Nhận', icon: CheckCircle },
    { key: 'SHIPPING', label: 'Đang Giao Hàng', icon: Truck },
    { key: 'DELIVERED', label: 'Đã Nhận Được Hàng', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    if (status === 'UNPAID' || status === 'PENDING') return 0;
    if (status === 'CONFIRMED') return 1;
    if (status === 'SHIPPING') return 2;
    if (status === 'DELIVERED') return 3;
    return -1; 
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6 relative">
      <div className="container mx-auto px-4 max-w-6xl space-y-4">
        
        {/* THANH TOP: TRỞ LẠI & MÃ ĐƠN HÀNG */}
        <div className="bg-white p-4 rounded-t-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link to="/orders" className="flex items-center gap-1 text-gray-500 hover:text-[#ee4d2d] transition-colors text-sm uppercase font-medium">
            <ChevronLeft size={18} /> Trở lại
          </Link>
          <div className="text-sm font-medium">
            MÃ ĐƠN HÀNG. <span className="font-bold">{order._id.toUpperCase()}</span> | <span className={`uppercase font-bold ${isCancelled ? 'text-red-500' : 'text-[#26aa99]'}`}>
              {isCancelled ? 'ĐƠN HÀNG ĐÃ HỦY' : (order.status === 'DELIVERED' ? 'ĐƠN HÀNG ĐÃ HOÀN THÀNH' : 'ĐƠN HÀNG ĐANG XỬ LÝ')}
            </span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white p-8 shadow-sm">
          {isCancelled ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-500">
              <XCircle size={60} className="mb-4" />
              <h2 className="text-xl font-bold uppercase">Đơn hàng đã bị hủy</h2>
              <p className="text-gray-500 mt-2 text-sm">Nếu có thắc mắc, vui lòng liên hệ bộ phận CSKH.</p>
            </div>
          ) : (
            <div className="relative flex justify-between max-w-4xl mx-auto">
              <div className="absolute top-[30px] left-[10%] right-[10%] h-[4px] bg-gray-200 -z-10"></div>
              <div 
                className="absolute top-[30px] left-[10%] h-[4px] bg-[#26aa99] -z-10 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 80}%` }}
              ></div>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= index;
                return (
                  <div key={step.key} className="flex flex-col items-center w-1/4 bg-white">
                    <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center border-[4px] transition-colors duration-300 ${isActive ? 'border-[#26aa99] text-[#26aa99] bg-white' : 'border-gray-300 text-gray-300 bg-white'}`}>
                      <Icon size={28} />
                    </div>
                    <p className={`mt-4 text-sm font-medium text-center ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {index === 0 ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ĐỊA CHỈ NHẬN HÀNG */}
        <div className="bg-white p-6 shadow-sm border-t-[3px] border-t-[#ee4d2d] flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-medium text-gray-800 mb-4 uppercase">Địa Chỉ Nhận Hàng</h2>
            <div className="text-gray-600 space-y-2 text-sm">
              <p className="font-bold text-black text-base">{order.user?.fullname || order.user?.name || 'Khách hàng'}</p>
              <p className="text-gray-500">{order.phone}</p>
              <p className="text-gray-500">{order.shippingAddress}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:border-l border-gray-100 md:pl-8 flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <Truck className="text-[#26aa99] mt-1" size={24} />
              <div>
                <p className="text-[#26aa99] font-medium text-lg">Thông tin vận chuyển</p>
                <p className="text-gray-600 mt-1 text-sm">
                  {order.status === 'PENDING' && 'Đơn hàng đang chờ người bán xác nhận.'}
                  {order.status === 'CONFIRMED' && 'Người bán đang chuẩn bị hàng và đóng gói.'}
                  {order.status === 'SHIPPING' && 'Đơn hàng đã được giao cho đơn vị vận chuyển.'}
                  {order.status === 'DELIVERED' && 'Giao hàng thành công. Bạn có thể đánh giá sản phẩm ngay bây giờ!'}
                  {isCancelled && 'Đơn hàng đã bị hủy. Hẹn gặp lại bạn ở các đơn hàng sau.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DANH SÁCH SẢN PHẨM & NÚT ĐÁNH GIÁ */}
        <div className="bg-white shadow-sm rounded-b-xl overflow-hidden pb-4">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <Store className="text-gray-600" size={18} />
            <span className="font-bold text-gray-800">BUILDVN MALL</span>
            <span className="bg-[#ee4d2d] text-white text-[10px] px-1.5 py-0.5 rounded ml-2 uppercase">Yêu thích</span>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {items.map(item => (
              <div key={item._id} className="flex gap-4 py-4 first:pt-0 items-center">
                <img 
                  src={getImageUrl(item.computer?.image || item.image)} 
                  alt={item.productName} 
                  className="w-20 h-20 object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm hover:text-cyan-600">
                    <Link to={`/product/${item.computer?.slug}`}>{item.productName || item.computer?.name}</Link>
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-[#ee4d2d] font-medium">{(item.price).toLocaleString('vi-VN')} đ</p>
                  
                  {/* === CHỈ HIỆN NÚT ĐÁNH GIÁ KHI ĐÃ GIAO HÀNG === */}
                  {order.status === 'DELIVERED' && (
                    <button 
                      onClick={() => handleOpenReview(item)}
                      className="mt-1 px-4 py-1.5 bg-white border border-[#ee4d2d] text-[#ee4d2d] hover:bg-red-50 text-sm rounded transition-colors font-medium shadow-sm"
                    >
                      Đánh Giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG TIỀN */}
          <div className="border-t border-gray-100 pt-4 flex flex-col items-end px-6 space-y-3 bg-[#fffdf8]">
            <div className="flex w-full md:w-1/2 justify-between text-sm text-gray-600">
              <span>Tổng tiền hàng</span>
              <span>{order.totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex w-full md:w-1/2 justify-between text-sm text-gray-600">
              <span>Phí vận chuyển</span>
              <span>0 đ</span>
            </div>
            <div className="flex w-full md:w-1/2 justify-between text-sm font-medium">
              <span className="text-gray-600">Thành tiền</span>
              <span className="text-2xl text-[#ee4d2d] font-bold">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* POPUP (MODAL) ĐÁNH GIÁ SẢN PHẨM 5 SAO                       */}
      {/* ========================================================= */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
            
            {/* Header Popup */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Đánh giá Sản phẩm</h3>
              <button onClick={() => setReviewModal({ isOpen: false, item: null, isChecking: false })} className="text-gray-400 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>

            {/* Khung tải dữ liệu khi đang call API Check */}
            {reviewModal.isChecking ? (
              <div className="p-10 flex justify-center items-center">
                <Loader2 size={32} className="animate-spin text-cyan-500" />
              </div>
            ) : (
              <div className="p-6">
                {/* Thông tin sản phẩm đang đánh giá */}
                <div className="flex gap-3 items-center mb-6 pb-4 border-b border-gray-100">
                  <img src={getImageUrl(reviewModal.item?.image || reviewModal.item?.computer?.image)} alt="Product" className="w-12 h-12 object-cover rounded border" />
                  <p className="font-medium text-sm text-gray-800 line-clamp-2">{reviewModal.item?.productName}</p>
                </div>

                {/* Chọn 5 Ngôi sao */}
                <div className="flex flex-col items-center mb-6 gap-2">
                  <p className="font-medium text-gray-600">Chất lượng sản phẩm</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={36} 
                          className={star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-orange-500 font-medium">
                    {reviewForm.rating === 5 ? "Tuyệt vời" : reviewForm.rating === 4 ? "Hài lòng" : reviewForm.rating === 3 ? "Bình thường" : reviewForm.rating === 2 ? "Tạm được" : "Rất tệ"}
                  </span>
                </div>

                {/* Ô nhập Comment */}
                <div className="mb-6">
                  <textarea 
                    rows="4"
                    placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này nhé (tối đa 30 ngày để sửa)..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none text-sm bg-gray-50"
                  ></textarea>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setReviewModal({ isOpen: false, item: null, isChecking: false })}
                    className="px-6 py-2.5 rounded text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                  >
                    Trở lại
                  </button>
                  <button 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded bg-[#ee4d2d] text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Gửi Đánh Giá"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetail;