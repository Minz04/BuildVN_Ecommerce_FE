import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { IMAGE_URL } from '../utils/axiosClient';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Hàm xử lý ảnh
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };

  // Tính tổng tiền
  const totalPrice = cart.reduce((total, item) => {
    const priceToUse = item.discountPrice || item.price;
    return total + (priceToUse * item.quantity);
  }, 0);

  // NẾU GIỎ HÀNG TRỐNG
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

  // NẾU CÓ HÀNG
  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-6 flex items-center gap-2">
          Giỏ hàng của bạn <span className="text-gray-500 text-lg font-normal">({cart.length} sản phẩm)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="w-full lg:w-8/12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header bảng */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-600 text-sm uppercase">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {/* List Item */}
            <div className="divide-y divide-gray-100">
              {cart.map(item => {
                const price = item.discountPrice || item.price;
                return (
                  <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    {/* Thông tin SP */}
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                      <div className="flex flex-col justify-center">
                        <Link to={`/product/${item.slug}`} className="font-bold text-gray-800 hover:text-cyan-600 line-clamp-2">
                          {item.name}
                        </Link>
                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm flex items-center gap-1 mt-2 hover:underline w-fit">
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    </div>

                    {/* Đơn giá */}
                    <div className="col-span-1 md:col-span-2 text-center font-bold text-gray-700 hidden md:block">
                      {price.toLocaleString('vi-VN')} đ
                    </div>

                    {/* Số lượng */}
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded h-9">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1, item.stockQuantity)} className="px-3 hover:bg-gray-100 font-bold">-</button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1, item.stockQuantity)} className="px-3 hover:bg-gray-100 font-bold">+</button>
                      </div>
                    </div>

                    {/* Thành tiền */}
                    <div className="col-span-1 md:col-span-2 text-right font-black text-[#e30019]">
                      {(price * item.quantity).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG TIỀN & ĐẶT HÀNG */}
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

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-3xl font-black text-[#e30019]">{totalPrice.toLocaleString('vi-VN')} <span className="text-xl underline">đ</span></span>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#e30019] hover:bg-red-700 text-white font-black py-3.5 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/30"
              >
                <ShieldCheck size={20} /> Tiến hành đặt hàng
              </button>

              <div className="mt-4 text-center">
                <Link to="/" className="text-cyan-600 hover:text-cyan-700 text-sm font-bold flex items-center justify-center gap-1">
                  <ArrowLeft size={16} /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;