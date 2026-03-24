import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, LayoutGrid, AlertCircle, ChevronLeft } from 'lucide-react';
import { productApi } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Category = () => {
  const { slug } = useParams(); 
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE DÀNH CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15; // 15 sản phẩm 1 trang

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          productApi.getCategories(),
          productApi.getAllProducts()
        ]);

        const currentCategory = catRes.data.find(c => c.slug === slug);

        if (currentCategory) {
          setCategory(currentCategory);
          const filteredProducts = prodRes.data.filter(p => {
            const pCatId = typeof p.category === 'object' ? p.category._id : p.category;
            return pCatId === currentCategory._id;
          });
          setProducts(filteredProducts);
          setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
        } else {
          setCategory(null); 
        }
      } catch (error) {
        console.error("Lỗi khi tải trang danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
    window.scrollTo(0, 0); 
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc]">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-black text-gray-700 uppercase mb-2">Không tìm thấy danh mục</h2>
        <p className="text-gray-500 mb-6">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
          Quay về Trang chủ
        </Link>
      </div>
    );
  }

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Hàm chuyển trang & cuộn lên đầu danh sách
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Đường dẫn */}
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 font-medium bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <Link to="/" className="hover:text-cyan-600 cursor-pointer transition-colors flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-cyan-500"/> Trang chủ
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-bold uppercase">{category.name}</span>
        </div>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 p-2.5 rounded-xl text-cyan-600">
            <LayoutGrid size={28} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 uppercase">
            {category.name} <span className="text-gray-400 text-xl font-medium tracking-normal lowercase">({products.length} sản phẩm)</span>
          </h1>
        </div>

        {/* LƯỚI SẢN PHẨM (Dùng currentProducts thay vì products) */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* GIAO DIỆN NÚT CHUYỂN TRANG */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                {/* Nút Trang trước */}
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Các số trang */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === index + 1 
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-600' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Nút Trang sau */}
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center mt-4">
            <img src="https://cdn-icons-png.flaticon.com/512/1368/1368686.png" alt="Empty" className="w-32 opacity-20 mb-6 grayscale" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500">Chúng tôi đang cập nhật thêm sản phẩm cho danh mục này. Bạn vui lòng quay lại sau nhé!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Category;