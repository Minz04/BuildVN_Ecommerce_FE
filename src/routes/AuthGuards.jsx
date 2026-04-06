import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// Chỉ những user đã đăng nhập mới được vào
export const ProtectedRoute = () => {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Chỉ những user chưa đăng nhập mới được vào
export const GuestRoute = () => {
  const { user } = useContext(AppContext);
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};

// Chỉ admin mới được vào
export const AdminRoute = () => {
  const { user } = useContext(AppContext);
  
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }
  
  return <Outlet />;
};