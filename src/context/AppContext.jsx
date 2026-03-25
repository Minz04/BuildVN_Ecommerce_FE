import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cartApi } from '../services/cartApi';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    const fetchCart = async () => {
      // BƯỚC CHỐNG LỖI: Kiểm tra xem token đã được lưu vào máy chưa
      const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // CHỈ GỌI API KHI: Có User VÀ Có Token
      if (user && currentToken) {
        try {
          const res = await cartApi.getCart();
          setCart(res.data.cartItem || []); 
        } catch (error) {
          console.error("Lỗi lấy giỏ hàng:", error);
          // Nếu lỗi lấy giỏ hàng, tạm thời set giỏ rỗng chứ đừng làm gì khác
          setCart([]);
        }
      } else {
        setCart([]); // Nếu chưa đăng nhập thì xóa giỏ hàng
      }
    };
    
    fetchCart();
  }, [user]);

  // 1. Hàm Thêm vào giỏ hàng
  const addToCart = async (product, quantityToAdd = 1) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    try {
      // Gọi API thêm vào DB
      await cartApi.addToCart(product._id, quantityToAdd);
      toast.success(`Đã thêm ${product.name} vào giỏ`);
      
      // Load lại giỏ hàng mới nhất từ DB
      const res = await cartApi.getCart();
      setCart(res.data.cartItem || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // 2. Hàm Tăng/Giảm số lượng
  const updateQuantity = async (cartitemId, newQuantity, stockQuantity) => {
    if (newQuantity <= 0) return;
    try {
      await cartApi.updateQuantity(cartitemId, newQuantity);
      
      // Cập nhật lại state giỏ hàng trên UI cho nhanh (Không cần gọi lại API getCart)
      setCart(prevCart => prevCart.map(item => 
        item._id === cartitemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật số lượng");
    }
  };

  // 3. Hàm Xóa sản phẩm khỏi giỏ
  const removeFromCart = async (cartitemId) => {
    try {
      await cartApi.removeFromCart(cartitemId);
      toast.info("Đã xóa sản phẩm khỏi giỏ");
      // Cập nhật state UI
      setCart(prevCart => prevCart.filter(item => item._id !== cartitemId));
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  // 4. Tính tổng tiền giỏ hàng
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price; // Ưu tiên giá đã giảm
      return total + (price * item.quantity);
    }, 0);
  };

  const toggleWishlist = (product) => {
    // Kiểm tra trực tiếp trên state 'wishlist' hiện tại
    const isExist = wishlist.find(item => item._id === product._id);
    
    if (isExist) {
      // Bắn thông báo TRƯỚC
      toast.info("Đã gỡ sản phẩm khỏi danh sách Yêu thích");
      // Cập nhật state SAU
      setWishlist(prev => prev.filter(item => item._id !== product._id));
    } else {
      // Bắn thông báo TRƯỚC
      toast.success("Đã thêm sản phẩm vào danh sách Yêu thích");
      // Cập nhật state SAU
      setWishlist(prev => [...prev, product]);
    }
  };

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, updateQuantity, removeFromCart, getCartTotal, user, setUser, 
      wishlist, toggleWishlist, 
      setCart 
    }}>
      {children}
    </AppContext.Provider>
  );
};