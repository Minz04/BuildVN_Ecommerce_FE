import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// 1. BẢO VỆ TRANG RIÊNG TƯ (Chỉ user đã đăng nhập mới được vào)
export const ProtectedRoute = () => {
  const { user } = useContext(AppContext);
  
  // Nếu chưa đăng nhập -> Đá văng về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập -> Cho phép đi tiếp (Render các Component con)
  return <Outlet />;
};

// 2. BẢO VỆ TRANG ĐĂNG NHẬP/ĐĂNG KÝ (Đã đăng nhập rồi thì không cho vào nữa)
export const GuestRoute = () => {
  const { user } = useContext(AppContext);
  
  // Nếu đã đăng nhập -> Đá thẳng về Trang chủ
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Nếu chưa đăng nhập -> Cho phép vào trang Login/Register
  return <Outlet />;
};