import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {  
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Hàm Thêm vào giỏ hàng
  const addToCart = (product, quantityToAdd = 1) => { 
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        
        if (newQuantity > product.stockQuantity) {
          toast.warning(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho!`);
          return prevCart;
        }
        
        toast.success(`Đã cập nhật thêm ${quantityToAdd} sản phẩm vào giỏ`);
        return prevCart.map(item => 
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        toast.success(`Đã thêm vào giỏ: ${product.name}`);
        return [...prevCart, { ...product, quantity: quantityToAdd }];
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
    <AppContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, getCartTotal, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};