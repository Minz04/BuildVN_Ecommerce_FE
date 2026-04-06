import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ShoppingCart, CheckCircle2, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const navigate = useNavigate();
  
  const { addToCart, user, wishlist = [], toggleWishlist } = useContext(AppContext);

  //  Đảm bảo tooltip được dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      setShowTooltip(false); 
    };
  }, []); 

  if (!product) return null;

  // Kiểm tra sản phẩm có trong danh sách yêu thích hay không
  const isFavorite = wishlist.some(item => item._id === product._id);

  // Hàm lấy URL ảnh
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/200?text=No+Image';
    if (img.startsWith('http')) return img;

    const BASE_URL = 'http://localhost:3000'; 
    if (img.startsWith('/images/')) {
       return `${BASE_URL}${img}`;
    }
    if (img.startsWith('/')) {
       return `${BASE_URL}/images${img}`;
    }
    return `${BASE_URL}/images/${img}`;
  };

  const salePrice = product.discountPrice || product.price; 
  const originalPrice = product.discountPrice ? product.price : product.oldPrice; 
  const discountPercent = (originalPrice && salePrice < originalPrice)
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  // Hàm xử lý di chuyển chuột cập nhật vị trí tooltip
  const handleMouseMove = (e) => {
    let x = e.clientX + 15;
    let y = e.clientY + 15;

    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 15; 
      if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 15;
    }
    setMousePos({ x, y });
  };

  // Hàm xử lý sự kiện click yêu thích
  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thêm vào Yêu thích!");
      navigate('/login');
      return; 
    }
    
    toggleWishlist(product);
  };

  const specKeysOrder = ['cpu', 'main', 'ram', 'vga', 'storage', 'psu', 'case', 'cooling', 'monitor'];

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-3 flex flex-col h-full hover:shadow-xl transition-all duration-300 group">
      
      {/* Khung ảnh sản phẩm */}
      <div 
        className="relative mb-4 overflow-hidden rounded-lg cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)} // Rê chuột vào hiện
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowTooltip(false)} // Rê chuột ra tắt (React lo phần này)
      >
        <Link to={`/product/${product.slug || product._id}`} className="block">
          <img
            src={getImageUrl(product.image)}
            alt={product.name || 'Sản phẩm'}
            className="w-full aspect-square object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Nút yêu thích */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
          title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart size={20} className={`transition-colors duration-300 ${isFavorite ? "fill-[#ff4d4f] text-[#ff4d4f]" : "hover:text-[#ff4d4f]"}`} />
        </button>
      </div>

      {/* Toolip hiển thị thông số */}
      {showTooltip && createPortal(
        <div 
          ref={tooltipRef}
          className="fixed w-[340px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded-lg pointer-events-none"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px`, zIndex: 99999 }}
        >
          <div className="bg-[#ff4d4f] text-white font-black p-3 rounded-t-lg text-[15px] leading-snug uppercase">
            {product.name}
          </div>
          
          <div className="p-4 text-[13px]">
            <div className="flex mb-4 items-center">
              <span className="font-extrabold w-20 text-gray-900">Giá bán:</span>
              <span className="text-[#ff4d4f] font-black text-[18px]">
                {salePrice ? `${salePrice.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
              </span>
            </div>
            
            <div className="inline-block bg-[#ff4d4f] text-white font-bold px-3 py-1 rounded text-xs mb-3 shadow-sm">
              Mô tả tóm tắt:
            </div>
            
            {product.specs ? (
              <ul className="text-gray-800 space-y-2 font-medium">
                {specKeysOrder.map(key => {
                  const specValue = product.specs[key];
                  if (!specValue) return null; 
                  return (
                    <li key={key} className="flex gap-2 items-start">
                      <CheckCircle2 size={16} className="text-teal-800 shrink-0 mt-0.5"/> 
                      <span className="line-clamp-2">{specValue}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-xs">Chưa có thông tin cấu hình chi tiết.</p>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Thông tin sản phẩm ở dưới ảnh */}
      <div className="flex flex-col flex-grow">
        
        <div className="text-[11px] text-cyan-600 font-bold mb-1.5 uppercase tracking-wider">
          {product.category?.name || "Sản phẩm công nghệ"}
        </div>

        <Link to={`/product/${product.slug || product._id}`} className="block mb-2">
          <h3 className="text-[16px] md:text-[17px] font-black text-gray-800 leading-snug uppercase line-clamp-2 min-h-[48px] hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Khối chứa Giá */}
        <div className="border-b border-gray-100 pb-3 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[#e30019] font-black text-[22px] leading-none mb-1">
                {salePrice ? salePrice.toLocaleString('vi-VN') : ''}
                {salePrice && <span className="underline ml-0.5 text-[18px]">đ</span>}
              </div>
              
              <div className="text-gray-400 line-through text-[15px] font-bold min-h-[22px]">
                {originalPrice ? originalPrice.toLocaleString('vi-VN') : ''}
                {originalPrice && <span className="underline ml-0.5 text-[13px]">đ</span>}
              </div>
            </div>

            {discountPercent > 0 && (
              <div className="bg-[#e30019] text-white text-[13px] font-bold px-2 py-1 rounded">
                -{discountPercent}%
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto gap-1 md:gap-2">
          <button 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation();

              if (!user) {
                toast.warning("Bạn cần đăng nhập để mua hàng!");
                navigate('/login');
                return; 
              }
              addToCart(product); 
            }}
            disabled={product.stockQuantity === 0} 
            className={`flex items-center gap-1.5 md:gap-2 font-black text-[12px] group/btn flex-1 overflow-hidden
              ${product.stockQuantity === 0 ? 'text-red-400 cursor-not-allowed opacity-70' : 'text-[#203481]'}`}
          >
            <div className={`text-white p-1.5 md:p-2 rounded-full transition-all duration-300 shrink-0 shadow-sm
              ${product.stockQuantity === 0 ? 'bg-red-400' : 'bg-[#203481] group-hover/btn:bg-blue-600 group-hover/btn:scale-110'}`}
            >
              <ShoppingCart size={16} />
            </div>
            
            <span className={`transition-colors uppercase whitespace-nowrap tracking-tight 
              ${product.stockQuantity === 0 ? '' : 'group-hover/btn:text-blue-600'}`}>
              {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </span>
          </button>
          
          {/* Trạng thái kho */}
          {product.stockQuantity === 0 ? (
            <span className="bg-red-100 text-red-600 border border-gray-100 px-2 py-1.5 rounded-md text-[10px] md:text-xs font-bold whitespace-nowrap shrink-0">
              Tạm hết
            </span>
          ) : (
            <span className="bg-[#dcfce7] text-[#15803d] px-2 py-1.5 rounded-md text-[10px] md:text-xs font-bold whitespace-nowrap shrink-0">
              Còn hàng
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;