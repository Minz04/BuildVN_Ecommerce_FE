import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AdminRoute = () => {
    const { user } = useContext(AppContext);

    // Nếu chưa đăng nhập -> Đá về trang Login
    if (!user) {
        toast.warning("Vui lòng đăng nhập để tiếp tục!");
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Đá về Trang chủ
    if (user.role !== 'admin') {
        toast.error("Bạn không có quyền truy cập khu vực Quản trị!");
        return <Navigate to="/" replace />;
    }

    // Nếu là Admin -> Cho phép đi tiếp vào các route con bên trong
    return <Outlet />;
};

export default AdminRoute;