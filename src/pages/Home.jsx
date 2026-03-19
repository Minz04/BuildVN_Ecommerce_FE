import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Timer, ChevronRight, Zap, TrendingUp, Newspaper, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
// import { mockBanners, mockProducts, mockNews } from '../mock/homeMockData';
import { productApi } from '../services/productApi';

// COMPONENT DANH MỤC 
const CategorySection = ({ title, slug, products }) => {
  const filteredProducts = products.filter(p => p.categorySlug === slug);
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 5);

  return (
    <section className="py-10 border-b border-gray-100 relative bg-white hover:bg-gray-50/50 transition-colors duration-500">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Danh mục - Hiệu ứng Gradient Text & Line */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500">
              {title}
            </span>
          </h2>
          <Link to={`/category/${slug}`} className="group flex items-center gap-1 text-cyan-600 font-bold hover:text-cyan-700 text-sm transition-all">
            <span className="group-hover:underline decoration-2 underline-offset-4">Xem tất cả</span> 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-4 gap-2">
          {displayProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// TRANG CHỦ MAIN 
const Home = () => {
  // Chứa dữ liệu thật 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOGIC ĐẾM NGƯỢC THEO KHUNG 3 TIẾNG 
  const calculateTimeLeft = () => {
    const now = new Date();
    const nextSlot = new Date(now);
    
    // Lấy giờ hiện tại và tìm mốc 3 tiếng tiếp theo
    const currentHour = now.getHours();
    const hoursToAdd = 3 - (currentHour % 3); 
    
    nextSlot.setHours(currentHour + hoursToAdd, 0, 0, 0); 
    const difference = nextSlot - now;

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const productRes = await productApi.getAllProducts();
        setProducts(productRes.data); // Đổ data BE vào State
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chủ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  const bannerSettings = {
    dots: true, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, arrows: false, fade: true
  };

  const flashSaleSettings = {
    dots: false, infinite: true, speed: 500, slidesToShow: 5, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } }
    ]
  };

  const newsSettings = {
    dots: true, infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      
      {/* BANNERS */}
      <section className="pb-8 pt-6">
        <div className="container mx-auto px-4">
          {/* Banner chính với hiệu ứng Shadow xịn xò */}
          <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] mb-6 leading-none border border-gray-100">
            <Slider {...bannerSettings}>
              {mockBanners.main.map((imgUrl, index) => (
                <div key={index} className="outline-none relative group">
                  <Link to="/products" className="block w-full">
                    <img src={imgUrl} alt={`Banner ${index + 1}`} className="w-full block m-0 aspect-[2400/866] object-cover transition-transform duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/products" className="overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block border border-gray-100">
              <img src={mockBanners.sub1} alt="Sub Banner 1" className="w-full block aspect-[1200/675] object-cover" />
            </Link>
            <Link to="/products" className="overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block border border-gray-100">
              <img src={mockBanners.sub2} alt="Sub Banner 2" className="w-full block aspect-[1200/675] object-cover" />
            </Link>
            <Link to="/products" className="overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block border border-gray-100">
              <img src={mockBanners.sub3 || mockBanners.sub1} alt="Sub Banner 3" className="w-full block aspect-[1200/675] object-cover" />
            </Link>
          </div>
        </div>
      </section>

      {/* FLASH SALE   */}
      <section className="py-14 relative overflow-hidden bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#bd00ff]">
        
        {/* HIỆU ỨNG TRANG TRÍ MỜ BÊN DƯỚI NỀN (Css Blur cực nhẹ) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute -top-20 -left-20 w-80 h-80 bg-white opacity-20 rounded-full blur-[80px]"></div>
           <div className="absolute top-20 -right-20 w-96 h-96 bg-cyan-300 opacity-20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="flex items-center gap-4">
              {/* Icon sét phát sáng */}
              <div className="relative">
                <Zap size={38} className="text-yellow-300 fill-yellow-300 animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50"></div>
              </div>
              
              <h2 className="text-4xl font-extrabold italic uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] tracking-wider">
                Flash Sale
              </h2>
              
              {/* BỘ ĐẾM GIỜ */}
              <div className="flex items-center gap-3 text-xl font-black ml-4">
                {/* Giờ */}
                <div className="flex flex-col items-center">
                  <span className="bg-white text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-b-4 border-gray-300 w-12 h-12 flex items-center justify-center rounded-lg text-2xl">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold mt-1 text-white/80 tracking-wider">Giờ</span>
                </div>
                
                <span className="text-white text-2xl pb-4 animate-pulse">:</span>

                {/* Phút */}
                <div className="flex flex-col items-center">
                  <span className="bg-white text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-b-4 border-gray-300 w-12 h-12 flex items-center justify-center rounded-lg text-2xl">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold mt-1 text-white/80 tracking-wider">Phút</span>
                </div>

                <span className="text-white text-2xl pb-4 animate-pulse">:</span>

                {/* Giây */}
                <div className="flex flex-col items-center">
                  <span className={`${timeLeft.hours === 0 ? 'bg-[#ff4d4f] text-white border-[#cf1322]' : 'bg-white text-gray-900 border-gray-300'} shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-b-4 w-12 h-12 flex items-center justify-center rounded-lg text-2xl transition-colors duration-300`}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold mt-1 text-white/80 tracking-wider">Giây</span>
                </div>
                
              </div>

            </div>
          </div>

          <div className="flash-sale-slider px-2">
            <Slider {...flashSaleSettings}>
              {mockProducts.filter(p => p.discountPrice).map((product) => (
                <div key={product._id} className="p-2 h-full">
                  <ProductCard product={product} />
                </div>
              ))}
              {mockProducts.map((product) => (
                <div key={product._id + '_dup'} className="p-2 h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center mt-12">
            <Link to="/flash-sale" className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#0072ff] font-bold px-10 py-3 rounded-full uppercase transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Sparkles size={18} className="group-hover:animate-spin-slow" /> 
              Xem toàn bộ khuyến mãi
            </Link>
          </div>
        </div>
      </section>

      {/* SẢN PHẨM BÁN CHẠY */}
      <section className="py-14 bg-white border-b border-gray-100 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-10 relative">
            {/* Hiệu ứng nền chìm đằng sau Title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-red-100 blur-2xl opacity-60 rounded-full"></div>
            
            <TrendingUp size={32} className="text-[#e30019] relative z-10" />
            <h2 className="text-3xl font-black text-gray-900 uppercase relative z-10">Sản phẩm bán chạy</h2>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {products.slice(0, 5).map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* DANH MỤC SẢN PHẨM */}
      <CategorySection title="Laptop Cao Cấp" slug="laptop" products={mockProducts} />
      <CategorySection title="PC Gaming" slug="pc-gaming" products={mockProducts} />
      <CategorySection title="PC Đồ họa" slug="pc-do-hoa" products={mockProducts} />
      <CategorySection title="PC Văn phòng" slug="pc-van-phong" products={mockProducts} />
      <CategorySection title="PC AI - Trí tuệ nhân tạo" slug="pc-ai" products={mockProducts} />
      <CategorySection title="Màn hình máy tính" slug="man-hinh" products={mockProducts} />

      {/* TIN TỨC */}
      <section className="py-16 bg-[#f8fafc] border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
              <Newspaper size={28} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 uppercase">Tin tức công nghệ</h2>
          </div>

          <div className="px-2">
            <Slider {...newsSettings}>
              {mockNews.map((news) => (
                <div key={news.id} className="p-3">
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-[0_10px_20px_rgba(6,182,212,0.1)] transition-all duration-300 group cursor-pointer border border-gray-100 overflow-hidden h-full flex flex-col">
                    <div className="overflow-hidden h-52 relative">
                      <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-cyan-600 font-semibold text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                        <Timer size={14}/> {news.date}
                      </p>
                      <h3 className="font-extrabold text-[17px] text-gray-800 line-clamp-2 group-hover:text-cyan-600 transition-colors leading-snug">
                        {news.title}
                      </h3>
                      <Link to={`/news/${news.slug}`} className="mt-auto pt-4 text-gray-500 font-bold text-sm inline-flex items-center gap-1 group-hover:text-cyan-600 transition-colors">
                        Đọc tiếp <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;