import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Zap, Frown } from 'lucide-react';
import { productApi } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FlashSale = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      setLoading(true);
      try {
        // Lấy toàn bộ sản phẩm từ Backend
        const res = await productApi.getAllProducts();
        const allProducts = res.data || [];

        // Lọc sản phẩm đang giảm giá
        let discountedProducts = allProducts.filter(product => {
          // Tính toán giá giống hệt trong ProductCard
          const salePrice = product.discountPrice || product.price;
          const originalPrice = product.discountPrice ? product.price : product.oldPrice;
          
          // Điều kiện: Có giá gốc và giá bán phải rẻ hơn giá gốc
          return originalPrice && salePrice < originalPrice;
        });

        // SẮP XẾP: Ưu tiên những sản phẩm giảm % sâu nhất lên đầu
        discountedProducts.sort((a, b) => {
            const salePriceA = a.discountPrice || a.price;
            const originalPriceA = a.discountPrice ? a.price : a.oldPrice;
            const percentA = Math.round(((originalPriceA - salePriceA) / originalPriceA) * 100);

            const salePriceB = b.discountPrice || b.price;
            const originalPriceB = b.discountPrice ? b.price : b.oldPrice;
            const percentB = Math.round(((originalPriceB - salePriceB) / originalPriceB) * 100);

            return percentB - percentA; // Xếp từ cao xuống thấp
        });

        setFlashSaleProducts(discountedProducts);
      } catch (error) {
        console.error("Lỗi khi tải Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
    window.scrollTo(0, 0); 
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Đường dẫn */}
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 font-medium bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <Link to="/" className="hover:text-cyan-600 cursor-pointer transition-colors flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-cyan-500"/> Trang chủ
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-bold uppercase">Flash Sale Mới Nhất</span>
        </div>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-[#e30019] to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-red-500/20">
          <div className="bg-white/20 p-3 rounded-full animate-pulse">
            <Zap size={36} className="text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-wider shadow-sm">
              Flash Sale Giá Sốc
            </h1>
            <p className="font-medium text-white/90 mt-1">Nhanh tay sở hữu các sản phẩm công nghệ với mức giá tốt nhất!</p>
          </div>
        </div>

        {/* Lưới sản phẩm */}
        {flashSaleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {flashSaleProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          // Hiển thị khi không có món nào đang giảm giá
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center mt-4">
            <Frown size={80} className="text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-700 mb-3">Chưa có chương trình Flash Sale nào</h3>
            <p className="text-gray-500 mb-8 max-w-md">Hiện tại các ưu đãi giá sốc đã kết thúc. Bạn vui lòng quay lại sau hoặc khám phá các sản phẩm khác nhé!</p>
            <Link to="/" className="bg-[#e30019] hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md">
              Xem sản phẩm khác
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlashSale;