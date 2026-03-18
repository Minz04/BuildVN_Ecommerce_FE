import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  // Lấy các state và hàm từ Kho lưu trữ
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useContext(AppContext);

  // Hàm định dạng tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // GIAO DIỆN KHI GIỎ HÀNG TRỐNG
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-32 h-32 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={64} className="text-cyan-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy chọn cho mình những sản phẩm công nghệ ưng ý nhé!</p>
        <Link to="/" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2">
          <ArrowLeft size={20} /> Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // GIAO DIỆN KHI CÓ SẢN PHẨM
  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-gray-900 uppercase mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></span>
          Giỏ hàng của bạn
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative group">
                
                {/* Ảnh sản phẩm */}
                <Link to={`/product/${item.slug || item._id}`} className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </Link>

                {/* Thông tin sản phẩm */}
                <div className="flex-grow text-center md:text-left">
                  <Link to={`/product/${item.slug || item._id}`}>
                    <h3 className="font-bold text-gray-800 hover:text-cyan-600 transition-colors line-clamp-2 mb-2 text-[15px]">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="text-[#ff4d4f] font-black text-lg">
                    {formatPrice(item.discountPrice || item.price)}
                  </div>
                </div>

                {/* Khu vực Tăng/Giảm số lượng */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-full border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item._id, 'decrease')}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-600 transition-colors rounded-l-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800 text-[15px]">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item._id, 'increase')}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cyan-600 transition-colors rounded-r-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Nút Xóa */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors md:absolute md:top-4 md:right-4"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: TỔNG TIỀN VÀ THANH TOÁN */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 mb-4 uppercase">
                Tóm tắt đơn hàng
              </h3>
              
              <div className="flex justify-between items-center mb-4 text-[15px] text-gray-600 font-medium">
                <span>Tổng số lượng:</span>
                <span>{cart.reduce((total, item) => total + item.quantity, 0)} sản phẩm</span>
              </div>

              <div className="flex justify-between items-center mb-6 text-[15px]">
                <span className="text-gray-600 font-medium">Tổng tạm tính:</span>
                <span className="text-[#ff4d4f] font-black text-2xl">
                  {formatPrice(getCartTotal())}
                </span>
              </div>

              <div className="bg-cyan-50 text-cyan-700 text-sm p-3 rounded-lg mb-6 border border-cyan-100">
                🚀 Bạn sẽ được miễn phí giao hàng cho đơn hàng này!
              </div>

              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 uppercase tracking-wide">
                Tiến hành thanh toán
              </button>
              
              <Link to="/" className="block text-center mt-4 text-cyan-600 font-bold hover:underline text-sm">
                &larr; Tiếp tục mua sắm
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;