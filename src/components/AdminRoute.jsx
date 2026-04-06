import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AdminRoute = () => {
    const { user } = useContext(AppContext);

    // Nếu chưa đăng nhập -> Chuyển trang login
    if (!user) {
        toast.warning("Vui lòng đăng nhập để tiếp tục!");
        return <Navigate to="/login" replace />;
    }

    // Đã đăng nhập (Không phải admin)-> Chuyển về trang chủ
    if (user.role !== 'admin') {
        toast.error("Bạn không có quyền truy cập khu vực Quản trị!");
        return <Navigate to="/" replace />;
    }

    // Nếu là Admin -> Cho phép đi tiếp
    return <Outlet />;
};

export default AdminRoute;