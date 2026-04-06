import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight, Gift, Clock3, TrendingUp, ChevronLeft, MessageCircle, MessageSquare, Star } from 'lucide-react'; 
import { toast } from 'react-toastify';
import Slider from 'react-slick'; 
import { AppContext } from '../context/AppContext';
import { productApi } from '../services/productApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { reviewApi } from '../services/reviewApi';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, user, setIsChatOpen, setChatProduct } = useContext(AppContext);
  const sliderRef = useRef(null); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0); 
  const [filterStar, setFilterStar] = useState(0);
  
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleBuyNow = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng!");
      navigate('/login');
      return;
    }
    await addToCart(product, quantity);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchMainAndRelated = async () => {
      setLoading(true);
      setLoadingRelated(true); 

      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.data) {
          const fetchedProduct = res.data;
          setProduct(fetchedProduct);
          setQuantity(1); 
          setActiveImg(0);  

          const categoryId = fetchedProduct.category?._id || fetchedProduct.category;

          if (categoryId) {
            try {
                const allProductsRes = await productApi.getAllProducts();
                const filtered = allProductsRes.data.filter(p => {
                    const pCatId = p.category?._id || p.category;
                    return pCatId === categoryId && p._id !== fetchedProduct._id;
                });
                
                setRelatedProducts(filtered);
            } catch (relErr) {
                console.error("Lỗi lấy sản phẩm liên quan:", relErr);
            }
          }
        } else {
          toast.error("Không tìm thấy sản phẩm!");
          navigate('/');
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    fetchMainAndRelated();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  useEffect(() => {
    if (product?._id) {
      const fetchReviews = async () => {
        try {
          const res = await reviewApi.getProductReviews(product._id);
          setReviews(res.data.reviews || []);
        } catch (error) {
          console.error("Lỗi lấy danh sách đánh giá:", error);
        }
      };
      fetchReviews();
    }
  }, [product?._id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/600?text=No+Image';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    const cleanImg = img.replace(/^\/+/, '');
    if (cleanImg.startsWith('images/')) {
        return `${BASE_URL}/${cleanImg}`;
    }
    return `${BASE_URL}/images/${cleanImg}`;
  };

  const productImages = [
    getImageUrl(product.image),
    getImageUrl(product.image), 
    getImageUrl(product.image) 
  ];

  const currentPrice = product.price; 
  const oldPrice = product.oldPrice; 
  const isFlashSale = oldPrice && oldPrice > currentPrice;
  const discountAmount = isFlashSale ? (oldPrice - currentPrice) : 0;

  const handleQuantityChange = (type) => {
    if (type === 'minus' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
    if (type === 'plus' && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng!");
      navigate('/login');
      return;
    }
    addToCart(product, quantity); 
  };

  let displaySpecs = {};
  if (product.specs) {
      if (typeof product.specs === 'string') {
          try { displaySpecs = JSON.parse(product.specs); } catch (e) { }
      } else { displaySpecs = product.specs; }
  }

  const specsForTable = [
    { key: 'cpu', label: 'Vi xử lý (CPU)', warranty: '36 Tháng' },
    { key: 'main', label: 'Bo mạch chủ (Mainboard)', warranty: '36 Tháng' },
    { key: 'ram', label: 'Bộ nhớ (RAM)', warranty: '36 Tháng' },
    { key: 'vga', label: 'Card đồ họa (VGA)', warranty: '36 Tháng' },
    { key: 'storage', label: 'Ổ cứng (SSD)', warranty: '36 Tháng' },
    { key: 'psu', label: 'Nguồn máy tính (PSU)', warranty: '36 Tháng' },
    { key: 'case', label: 'Vỏ máy (Case)', warranty: '12 Tháng' },
    { key: 'cooling', label: 'Tản nhiệt', warranty: '12 Tháng' },
    { key: 'monitor', label: 'Màn hình', warranty: '24 Tháng' }
  ];

  const relatedSettings = {
    dots: false,
    infinite: true, 
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1,
    arrows: false, 
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex items-center text-sm text-gray-500 mb-6 gap-2 font-medium bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <Link to="/" className="hover:text-cyan-600 cursor-pointer transition-colors flex items-center gap-1.5"><ShieldCheck size={16} className="text-cyan-500"/> Trang chủ</Link>
          <ChevronRight size={16} />
          <Link to={`/category/${product.category?.slug}`} className="hover:text-cyan-600 cursor-pointer transition-colors uppercase">
            {product.category?.name || "Danh mục"}
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-800 font-bold truncate max-w-[400px]">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-5/12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <div className="border border-gray-100 rounded-xl overflow-hidden p-2 mb-4 group aspect-[1/1] flex items-center justify-center">
                  <img src={productImages[activeImg]} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"/>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {productImages.map((img, index) => (
                    <div key={index} onClick={() => setActiveImg(index)} className={`border-2 rounded-lg p-1 aspect-[1/1] flex items-center justify-center cursor-pointer transition-all ${index === activeImg ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'}`}>
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-7/12 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-7">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase leading-snug mb-5">{product.name}</h1>
                <div className="flex items-end gap-5 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-[#e30019] text-5xl font-black leading-none">{currentPrice?.toLocaleString('vi-VN')} <span className="text-2xl underline">đ</span></span>
                  {isFlashSale && (
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-gray-400 line-through text-lg font-bold">{oldPrice.toLocaleString('vi-VN')} đ</span>
                        <div className="bg-cyan-100 text-cyan-700 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1"><Clock3 size={14}/> Tiết kiệm {discountAmount.toLocaleString('vi-VN')} đ</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                        Tình trạng: {product.stockQuantity > 0 ? (
                            <span className="font-bold text-[#15803d] flex items-center gap-1.5 bg-[#dcfce7] px-2.5 py-1 rounded-lg">
                                <CheckCircle2 size={16}/> Còn hàng
                            </span>
                        ) : (
                            <span className="font-bold text-red-500 bg-red-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                <AlertTriangle size={16}/> Hết hàng
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        Đã bán: <span className="font-bold text-gray-800">{product.soldCount}</span>
                    </div>

                    <button 
                        onClick={() => {
                          if (!user) {
                            toast.warning("Vui lòng đăng nhập để chat với Shop!");
                            navigate('/login');
                            return;
                          }
                          setChatProduct(product); 
                          setIsChatOpen(true);    
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 text-base rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                        title="Nhắn tin cho shop"
                    >
                        <MessageCircle size={20} /> Tư vấn ngay
                    </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-[#e30019] rounded-2xl p-6 bg-red-50/50">
                <h3 className="font-black text-xl text-[#e30019] mb-5 uppercase flex items-center gap-3"><Gift size={24}/> Khuyến mãi đặc biệt</h3>
                <ul className="space-y-3 text-sm font-medium text-gray-800 list-inside list-disc marker:text-[#e30019]">
                    <li>Hỗ trợ nâng cấp linh kiện PC lên đến 1 triệu.</li>
                    {isFlashSale ? (<li className="text-[#15803d]">Bộ PC này đã áp dụng chương trình khuyến mãi Shock, không áp dụng kèm CTKM khác.</li>) : (<li>Giảm ngay 500.000đ khi mua PC kèm màn hình và ngược lại.</li>)}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <div className="flex flex-col gap-1.5 items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Số lượng:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-12 w-32 bg-white">
                        <button onClick={() => handleQuantityChange('minus')} className="w-10 h-full flex items-center justify-center bg-gray-50 text-gray-600 font-bold">-</button>
                        <div className="flex-1 h-full flex items-center justify-center font-black text-gray-900 border-x-2 border-gray-200 text-lg">{quantity}</div>
                        <button onClick={() => handleQuantityChange('plus')} disabled={quantity >= product.stockQuantity} className="w-10 h-full flex items-center justify-center bg-gray-50 text-gray-600 font-bold disabled:opacity-50">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full pt-6 sm:pt-0">
                    <button 
                      onClick={handleBuyNow} 
                      disabled={product.stockQuantity === 0} 
                      className="flex-1 h-16 bg-[#e30019] hover:bg-red-700 disabled:bg-gray-400 text-white font-black rounded-xl uppercase text-lg w-full shadow-md shadow-red-500/20"
                    >
                      {product.stockQuantity === 0 ? 'Tạm hết hàng' : 'Đặt hàng ngay'}
                    </button>
                    <button 
                      onClick={handleAddToCart} 
                      disabled={product.stockQuantity === 0} 
                      className="h-16 w-full sm:w-[120px] bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-bold rounded-xl flex flex-col items-center justify-center uppercase shadow-md shadow-cyan-500/20"
                    >
                        <ShoppingCart size={22} className="mb-0.5" /><span className="text-xs">Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="font-black text-xl text-gray-800 mb-6 uppercase flex items-center gap-3 border-b pb-4 border-gray-100">
            <CheckCircle2 className="text-cyan-500" /> Bảng Thông số kỹ thuật chi tiết
          </h3>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-600 font-bold">
                        <th className="py-3.5 px-5 w-16 text-center">STT</th>
                        <th className="py-3.5 px-5 w-48 border-r border-gray-200">Linh kiện</th>
                        <th className="py-3.5 px-5">Chi tiết thông số</th>
                        <th className="py-3.5 px-5 w-24 text-center border-l border-gray-200">SL</th>
                        <th className="py-3.5 px-5 w-32 text-center">BH</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {specsForTable.map((specItem, index) => {
                        let value = displaySpecs[specItem.key];
                        if (!value || value.trim() === '' || value.trim().toLowerCase() === 'null') { value = "Không có"; }
                        return (
                            <tr key={specItem.key} className="hover:bg-gray-50/50">
                                <td className="py-4 px-5 font-bold text-gray-900 text-center">{index + 1}</td>
                                <td className="py-4 px-5 font-bold text-gray-800 border-r border-gray-100 bg-gray-50/30">{specItem.label}</td>
                                <td className="py-4 px-5 text-gray-700 font-medium">{value}</td>
                                <td className="py-4 px-5 text-gray-700 text-center font-bold border-l border-gray-100">1</td>
                                <td className="py-4 px-5 text-cyan-700 text-center font-bold">{specItem.warranty}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="font-black text-xl text-gray-800 mb-6 uppercase flex items-center gap-3 border-b pb-4 border-gray-100">
            <Star className="text-yellow-400 fill-yellow-400" size={24} /> Khách hàng đánh giá
          </h3>

          {reviews.length > 0 ? (
            <>
              <div className="flex items-center gap-8 p-6 bg-[#fffbf8] border border-orange-100 rounded-xl mb-8">
                <div className="flex flex-col items-center justify-center text-[#ee4d2d]">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{product.averageRating?.toFixed(1) || 5.0}</span>
                    <span className="text-xl font-bold text-orange-400 mb-1">/ 5</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={20} className={s <= Math.round(product.averageRating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-2 font-medium">{product.totalReviews || reviews.length} đánh giá</p>
                </div>

                <div className="hidden sm:flex flex-wrap gap-3">
                  <button 
                    onClick={() => setFilterStar(0)} 
                    className={`px-5 py-2 border rounded-sm text-sm font-medium ${filterStar === 0 ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
                  >
                    Tất cả ({reviews.length})
                  </button>
                  
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    return (
                      <button 
                        key={star} 
                        onClick={() => setFilterStar(star)} 
                        className={`px-5 py-2 border rounded-sm text-sm font-medium flex items-center gap-1 ${filterStar === star ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
                      >
                        {star} Sao ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6 divide-y divide-gray-100">
                {reviews
                  .filter(review => filterStar === 0 || review.rating === filterStar) // Logic lọc ở đây
                  .map(review => (
                  <div key={review._id} className="pt-6 first:pt-0 flex gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                      <img 
                        src={getImageUrl(review.user?.avatar)} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg' }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm mb-1">{review.user?.fullname || review.user?.username || 'Khách hàng ẩn danh'}</p>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={14} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        {new Date(review.updatedAt).toLocaleString('vi-VN')} | Đã mua: {product.name}
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MessageSquare size={60} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-sm mt-1">Hãy mua hàng và trở thành người đầu tiên đánh giá nhé!</p>
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
            <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
                 <div className="flex justify-between items-center mb-8 border-b pb-5 border-gray-100 gap-4">
                    <h3 className="font-black text-2xl text-gray-800 uppercase flex items-center gap-3">
                        <TrendingUp className="text-cyan-500" /> Sản phẩm tương tự
                    </h3>
                    
                    {relatedProducts.length > relatedSettings.slidesToShow && (
                        <div className="flex items-center gap-2 relative z-50"> 
                            <button 
                                onClick={() => sliderRef.current.slickPrev()}
                                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all shadow-sm active:scale-95"
                                title="Bấm sang trái"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button 
                                onClick={() => sliderRef.current.slickNext()}
                                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all shadow-sm active:scale-95"
                                title="Bấm sang phải"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    )}
                </div>
                
                {loadingRelated ? (
                    <div className="flex justify-center p-10"><LoadingSpinner /></div>
                ) : (
                    <div className="relative related-product-slider px-1 z-10">
                        <Slider ref={sliderRef} {...relatedSettings}>
                            {relatedProducts.map(relProd => (
                                <div key={relProd._id} className="p-2">
                                    <ProductCard product={relProd} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;