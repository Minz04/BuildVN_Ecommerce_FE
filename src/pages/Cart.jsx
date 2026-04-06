import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

import { AppContext } from '../context/AppContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, user } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Yêu cầu đăng nhập mới được xem giỏ
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc]">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
        <Link to="/login" className="bg-[#203481] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition">
          ĐĂNG NHẬP NGAY
        </Link>
      </div>
    );
  }

  
  // Tính tổng tiền dựa trên cấu trúc DB mới (item.computer.price)
  const totalPrice = cart.reduce((total, item) => {
    if (!item.computer) return total;
    const priceToUse = item.computer.price;
    return total + (priceToUse * item.quantity);
  }, 0);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const finalPrice = appliedCoupon ? totalPrice - appliedCoupon.discountAmount : totalPrice;
  const isCartValid = cart.length > 0 && cart.every(item => item.computer && item.quantity <= item.computer.stockQuantity && item.computer.stockQuantity > 0);

  const handleApplyCoupon = async () => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        const config = { 
            headers: { Authorization: `Bearer ${token}` } 
        };

        const res = await axios.post('http://localhost:3000/api/coupons/apply', 
            { code: couponInput, orderValue: totalPrice },
            config 
        );
        
        if (!token) {
            toast.error("Vui lòng đăng nhập để sử dụng mã giảm giá!");
            return;
        }
        
        setAppliedCoupon(res.data);
        toast.success("Áp dụng mã thành công!");
    } catch (error) {
        toast.error(error.response?.data?.message || "Mã không hợp lệ");
        setAppliedCoupon(null);
    }
  };

  
  // Hàm hỗ trợ lấy URL ảnh từ backend, có xử lý trường hợp đường dẫn khác nhau
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };
  

  // 1. Hàm Thêm vào giỏ (đã được chuyển sang AppContext)
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png" alt="Empty Cart" className="w-32 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-gray-600 mb-4">Giỏ hàng của bạn còn trống</h2>
        <Link to="/" className="bg-[#203481] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          MUA SẮM NGAY
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-6 flex items-center gap-2">
          Giỏ hàng của bạn <span className="text-gray-500 text-lg font-normal">({cart.length} sản phẩm)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-8/12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-600 text-sm uppercase">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map(item => {
                if (!item.computer) return null; // Bảo vệ lỗi vặt
                const comp = item.computer; // Lôi object máy tính ra
                const price = comp.price; // Backend hiện tại chỉ lấy mỗi thuộc tính price

                return (
                  <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <img src={getImageUrl(comp.image)} alt={comp.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                      <div className="flex flex-col justify-center">
                        <Link to={`/product/${comp.slug}`} className="font-bold text-gray-800 hover:text-cyan-600 line-clamp-2">{comp.name}</Link>
                        
                        {comp.stockQuantity === 0 ? (
                            <p className="text-red-500 text-xs font-bold mt-1">Sản phẩm này đã hết hàng</p>
                        ) : item.quantity > comp.stockQuantity ? (
                            <p className="text-orange-500 text-xs font-bold mt-1">
                              Sản phẩm không đủ số lượng yêu cầu. Vui lòng liên hệ với admin để được hỗ trợ hoặc giảm số lượng xuống.
                            </p>
                        ) : null}

                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm flex items-center gap-1 mt-2 hover:underline w-fit">
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-center font-bold text-gray-700 hidden md:block">
                      {price?.toLocaleString('vi-VN')} đ
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded h-9">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 hover:bg-gray-100 font-bold">-</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                          disabled={item.quantity >= comp.stockQuantity} 
                          className="px-3 hover:bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed">+
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-center font-bold text-gray-700 hidden md:block">
                      {price?.toLocaleString('vi-VN')} đ
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded h-9">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 hover:bg-gray-100 font-bold">-</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 hover:bg-gray-100 font-bold">+</button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-right font-black text-[#e30019]">
                      {(price * item.quantity).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-4/12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-black text-lg uppercase mb-4 border-b pb-4">Tóm tắt đơn hàng</h2>
              
              <div className="flex justify-between mb-4 text-gray-600 font-medium">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              
              <div className="flex justify-between mb-6 pb-6 border-b border-dashed border-gray-300">
                <span className="text-gray-600 font-medium">Phí vận chuyển:</span>
                <span className="text-green-600 font-bold">Miễn phí</span>
              </div>

              <div className="mt-4 p-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá..." 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm outline-none focus:border-cyan-500"
                  />
                  <button onClick={handleApplyCoupon} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded cursor-pointer text-sm font-bold">
                    ÁP DỤNG
                  </button> 
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between mb-4 text-green-600 font-medium">
                    <span>Giảm giá:</span>
                    <span>- {appliedCoupon.discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-3xl font-black text-[#e30019]">{finalPrice.toLocaleString('vi-VN')} <span className="text-xl underline">đ</span></span>
              </div>

              <button onClick={() => navigate('/checkout')} disabled={!isCartValid}
                className="w-full bg-[#e30019] hover:bg-red-700 disabled:bg-gray-400 text-white font-black py-3.5 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/30"
              >
                <ShieldCheck size={20} /> {isCartValid ? 'Tiến hành đặt hàng' : 'Cập nhật lại giỏ hàng'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;