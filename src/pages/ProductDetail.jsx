import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { productApi } from '../services/productApi';
import { IMAGE_URL } from '../utils/axiosClient';

const ProductDetail = () => {
  const { slug } = useParams(); // Lấy slug từ thanh địa chỉ URL
  const navigate = useNavigate();
  const { addToCart, user } = useContext(AppContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Mặc định mua 1 cái

  // GỌI API LẤY DỮ LIỆU SẢN PHẨM
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
        } else {
          toast.error("Không tìm thấy sản phẩm!");
          navigate('/');
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  if (!product) return null;

  // XỬ LÝ ẢNH
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/600?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${IMAGE_URL}${img}`;
  };

  // XỬ LÝ GIÁ
  const salePrice = product.discountPrice || product.price; 
  const originalPrice = product.discountPrice ? product.price : product.oldPrice; 

  // Hàm xử lý Tăng/Giảm số lượng
  const handleQuantityChange = (type) => {
    if (type === 'minus' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
    if (type === 'plus' && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  // Hàm xử lý Thêm vào giỏ
  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng!");
      navigate('/login');
      return;
    }
    // Gọi hàm addToCart trong Context, truyền thêm số lượng khách chọn
    addToCart(product, quantity); 
  };

  // Thứ tự in thông số
  const specKeysOrder = [
    { key: 'cpu', label: 'CPU' },
    { key: 'main', label: 'Mainboard' },
    { key: 'ram', label: 'RAM' },
    { key: 'vga', label: 'Card đồ họa' },
    { key: 'storage', label: 'Ổ cứng' },
    { key: 'psu', label: 'Nguồn' },
    { key: 'case', label: 'Vỏ Case' },
    { key: 'cooling', label: 'Tản nhiệt' },
    { key: 'monitor', label: 'Màn hình' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Đường dẫn (Breadcrumb) */}
        <div className="flex items-center text-sm text-gray-500 mb-6 gap-2 font-medium">
          <span onClick={() => navigate('/')} className="hover:text-cyan-600 cursor-pointer transition-colors">Trang chủ</span>
          <ChevronRight size={16} />
          <span onClick={() => navigate(`/category/${product.category?.slug}`)} className="hover:text-cyan-600 cursor-pointer transition-colors uppercase">
            {product.category?.name || "Danh mục"}
          </span>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-bold truncate max-w-[300px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
            <div className="w-full md:w-5/12">
              <div className="border border-gray-100 rounded-xl overflow-hidden p-4 sticky top-24">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name}
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN VÀ ĐẶT HÀNG */}
            <div className="w-full md:w-7/12 flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 uppercase leading-snug mb-4">
                {product.name}
              </h1>

              {/* Tình trạng & Thương hiệu */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Tình trạng:</span>
                  {product.stockQuantity > 0 ? (
                    <span className="font-bold text-[#15803d] flex items-center gap-1 bg-[#dcfce7] px-2 py-1 rounded">
                      <CheckCircle2 size={16} /> Còn hàng ({product.stockQuantity})
                    </span>
                  ) : (
                    <span className="font-bold text-red-500 bg-red-100 px-2 py-1 rounded">Hết hàng</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Đã bán:</span>
                  <span className="font-bold text-gray-800">{product.soldCount}</span>
                </div>
              </div>

              {/* Khu vực Giá */}
              <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-[#e30019] text-4xl font-black leading-none">
                    {salePrice?.toLocaleString('vi-VN')} <span className="text-2xl underline">đ</span>
                  </span>
                  {originalPrice && originalPrice > salePrice && (
                    <span className="text-gray-400 line-through text-lg font-bold mb-1">
                      {originalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>
              </div>

              {/* Khu vực Chọn số lượng & Nút Mua */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">Số lượng:</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  
                  {/* Bộ đếm */}
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-12 w-32">
                    <button 
                      onClick={() => handleQuantityChange('minus')}
                      className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                    >-</button>
                    <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-800 border-x-2 border-gray-200">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => handleQuantityChange('plus')}
                      disabled={quantity >= product.stockQuantity}
                      className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >+</button>
                  </div>

                  {/* Nút Thêm giỏ hàng */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 h-12 bg-[#203481] hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide w-full"
                  >
                    <ShoppingCart size={20} />
                    {product.stockQuantity === 0 ? 'Tạm hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>
                </div>
              </div>

              {/* Bảng Thông số Kỹ thuật */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-4">
                  <h3 className="font-black text-xl text-gray-800 mb-4 uppercase flex items-center gap-2">
                    <ShieldCheck className="text-cyan-500" /> Thông số kỹ thuật
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody>
                        {specKeysOrder.map((item, index) => {
                          const value = product.specs[item.key];
                          if (!value) return null;
                          return (
                            <tr key={item.key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="py-3 px-4 border-b border-gray-100 font-bold text-gray-700 w-1/3">{item.label}</td>
                              <td className="py-3 px-4 border-b border-gray-100 text-gray-700">{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;