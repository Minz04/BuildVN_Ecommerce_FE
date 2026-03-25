import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShieldCheck, ChevronRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useContext(AppContext);

  // Cuộn lên đầu khi mở trang
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Đường dẫn */}
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 font-medium bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <Link to="/" className="hover:text-cyan-600 transition-colors flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-cyan-500"/> Trang chủ
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-bold">Danh sách Yêu thích</span>
        </div>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#ff4d4f]/10 p-2.5 rounded-xl text-[#ff4d4f]">
            <Heart size={28} className="fill-[#ff4d4f]" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 uppercase">
            Sản phẩm Yêu thích <span className="text-gray-400 text-xl font-medium tracking-normal lowercase">({wishlist.length} sản phẩm)</span>
          </h1>
        </div>

        {/* Danh sách hiển thị */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center mt-4">
            <Heart size={80} className="text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-700 mb-3">Bạn chưa có sản phẩm yêu thích nào</h3>
            <p className="text-gray-500 mb-8 max-w-md">Hãy lướt xem các sản phẩm công nghệ và nhấn biểu tượng trái tim để lưu lại những món đồ bạn ưng ý nhé!</p>
            <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
              Khám phá sản phẩm ngay
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;