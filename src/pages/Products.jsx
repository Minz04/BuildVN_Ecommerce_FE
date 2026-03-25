import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productApi } from '../services/productApi'; // Import API thật
import { SearchX, Filter, SortDesc } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [allProducts, setAllProducts] = useState([]); // Chứa toàn bộ data từ BE
  const [filteredProducts, setFilteredProducts] = useState([]); // Chứa data sau khi lọc
  const [loading, setLoading] = useState(true);

  // STATE BỘ LỌC VÀ SẮP XẾP
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // 1. LẤY TOÀN BỘ SẢN PHẨM TỪ BACKEND (Chỉ gọi 1 lần khi vào trang)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAllProducts();
        setAllProducts(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. LOGIC XỬ LÝ SEARCH & FILTER KẾT HỢP (Chạy mỗi khi data, keyword, hoặc bộ lọc thay đổi)
  useEffect(() => {
    if (allProducts.length === 0) return;

    // Bước A: Lọc theo từ khóa Tìm kiếm (Tìm trong Tên, CPU, VGA)
    let results = allProducts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => {
        // Parse specs nếu nó đang là chuỗi
        let specs = p.specs;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
        }

        return p.name.toLowerCase().includes(query) ||
          (specs?.cpu && specs.cpu.toLowerCase().includes(query)) ||
          (specs?.vga && specs.vga.toLowerCase().includes(query));
      });
    }

    // Bước B: Lọc theo Khoảng giá
    if (priceFilter === 'under10') {
      results = results.filter(p => (p.discountPrice || p.price) < 10000000);
    } else if (priceFilter === '10to20') {
      results = results.filter(p => {
        const pPrice = p.discountPrice || p.price;
        return pPrice >= 10000000 && pPrice <= 20000000;
      });
    } else if (priceFilter === 'over20') {
      results = results.filter(p => (p.discountPrice || p.price) > 20000000);
    }

    // Bước C: Sắp xếp
    if (sortBy === 'priceAsc') {
      results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'priceDesc') {
      results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'newest') {
      // Sắp xếp theo ngày tạo mới nhất
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts([...results]); // Cập nhật lại list hiển thị
  }, [allProducts, searchQuery, priceFilter, sortBy]);


  // HÀM CẬP NHẬT URL (Để khi copy link gửi bạn bè, bộ lọc vẫn được giữ nguyên)
  const handleFilterChange = (type, value) => {
    if (type === 'price') setPriceFilter(value);
    if (type === 'sort') setSortBy(value);
    // Lưu ý: Không cần đổi URL cho các bộ lọc phụ, chỉ giữ URL cho Search là đủ đẹp
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Tiêu đề trang */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-gray-800 uppercase">
              {searchQuery ? (
                <span>Kết quả tìm kiếm: <span className="text-cyan-600">"{searchQuery}"</span></span>
              ) : (
                "Tất cả sản phẩm"
              )}
            </h1>
            <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* Sắp xếp nhanh (Mobile & Desktop) */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <SortDesc size={18} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="outline-none bg-transparent text-sm font-bold text-gray-700 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá: Thấp đến Cao</option>
              <option value="priceDesc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ========================================================= */}
          {/* BỘ LỌC (CỘT TRÁI) */}
          {/* ========================================================= */}
          <div className="lg:w-1/4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-black text-lg flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 uppercase text-gray-800">
                <Filter size={20} className="text-cyan-500" /> Bộ lọc sản phẩm
              </h3>

              {/* Lọc theo giá */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Mức giá</h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={priceFilter === 'all'} onChange={() => handleFilterChange('price', 'all')} className="w-4 h-4 text-cyan-600 accent-cyan-600 cursor-pointer" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-cyan-600 transition-colors">Tất cả mức giá</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={priceFilter === 'under10'} onChange={() => handleFilterChange('price', 'under10')} className="w-4 h-4 text-cyan-600 accent-cyan-600 cursor-pointer" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-cyan-600 transition-colors">Dưới 10 triệu</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={priceFilter === '10to20'} onChange={() => handleFilterChange('price', '10to20')} className="w-4 h-4 text-cyan-600 accent-cyan-600 cursor-pointer" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-cyan-600 transition-colors">Từ 10 - 20 triệu</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={priceFilter === 'over20'} onChange={() => handleFilterChange('price', 'over20')} className="w-4 h-4 text-cyan-600 accent-cyan-600 cursor-pointer" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-cyan-600 transition-colors">Trên 20 triệu</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* KẾT QUẢ TÌM KIẾM (CỘT PHẢI) */}
          {/* ========================================================= */}
          <div className="lg:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              // NẾU KHÔNG TÌM THẤY SẢN PHẨM NÀO
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={48} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">Rất tiếc, không tìm thấy sản phẩm nào!</h2>
                <p className="text-gray-500 text-center max-w-md">
                  Chúng tôi không tìm thấy kết quả nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với từ khóa khác hoặc xóa bỏ các bộ lọc (VD: Laptop, PC Gaming, RTX...).
                </p>
                <button
                  onClick={() => { setSearchParams({}); setPriceFilter('all'); }}
                  className="mt-6 bg-cyan-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;