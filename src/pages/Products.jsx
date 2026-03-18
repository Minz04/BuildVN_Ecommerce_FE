import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../mock/homeMockData';
import { SearchX, Filter } from 'lucide-react';

const Products = () => {
  // 1. Lấy từ khóa tìm kiếm từ trên thanh URL xuống
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 2. Logic Lọc dữ liệu (Sẽ thay bằng gọi API sau này)
  useEffect(() => {
    // Nếu sau này dùng API thật, bạn sẽ gọi: 
    // axios.get(`/api/computers?search=${searchQuery}`)

    if (searchQuery) {
      // Tìm kiếm tuyệt đối (không phân biệt hoa thường)
      const results = mockProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.specs?.cpu && p.specs.cpu.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.specs?.vga && p.specs.vga.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(results);
    } else {
      // Nếu không gõ gì mà cứ vào trang Products, thì hiện tất cả
      setFilteredProducts(mockProducts);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-4">
        
        {/* Tiêu đề trang */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
          <h1 className="text-2xl font-black text-gray-800 uppercase">
            {searchQuery ? (
              <span>Kết quả tìm kiếm cho: <span className="text-cyan-600">"{searchQuery}"</span></span>
            ) : (
              "Tất cả sản phẩm"
            )}
          </h1>
          <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* BỘ LỌC TẠM THỜI (CỘT TRÁI) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-bold text-lg flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                <Filter size={20} className="text-cyan-500" /> Lọc sản phẩm
              </h3>
              <p className="text-sm text-gray-500 italic">Tính năng lọc theo mức giá, hãng sản xuất sẽ được cập nhật sau khi có API Backend.</p>
            </div>
          </div>

          {/* KẾT QUẢ TÌM KIẾM (CỘT PHẢI) */}
          <div className="lg:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  Chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa <strong className="text-gray-800">"{searchQuery}"</strong>. Vui lòng thử lại với từ khóa khác (VD: Laptop, PC Gaming, RTX...).
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;