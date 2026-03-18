import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Hàm Thêm vào giỏ
  const addToCart = (product) => {
    // ĐƯA TOAST RA NGOÀI: Kiểm tra trước xem sản phẩm đã có chưa để gọi Toast 1 lần duy nhất
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      toast.info(`Đã tăng số lượng ${product.name} trong giỏ!`);
    } else {
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    }

    // SAU ĐÓ MỚI CẬP NHẬT STATE
    setCart((prevCart) => {
      const itemExists = prevCart.find(item => item._id === product._id);
      if (itemExists) {
        return prevCart.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 2. Hàm Tăng/Giảm số lượng
  const updateQuantity = (id, action) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item._id === id) {
        let newQuantity = item.quantity;
        if (action === 'increase') newQuantity += 1;
        if (action === 'decrease' && newQuantity > 1) newQuantity -= 1; // Không cho giảm dưới 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // 3. Hàm Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    setCart((prevCart) => prevCart.filter(item => item._id !== id));
  };

  // 4. Tính tổng tiền giỏ hàng
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price; // Ưu tiên giá đã giảm
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, getCartTotal }}>
      {children}
    </AppContext.Provider>
  );
};