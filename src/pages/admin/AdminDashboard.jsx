import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  DollarSign, ShoppingBag, Package, Layers, Users, 
  TrendingUp, Eye 
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu Admin
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/admin/stats/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu Admin:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Hàm render màu Badge trạng thái đơn hàng
  const renderStatus = (status) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Chờ xử lý</span>;
      case 'SHIPPING': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Đang giao</span>;
      case 'DELIVERED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Đã giao</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Đã hủy</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Thống kê hoạt động</h1>
        <p className="text-gray-500 font-medium mt-1">Dữ liệu được cập nhật theo thời gian thực</p>
      </div>

      {/* HÀNG 1: 4 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Tổng doanh thu</p>
            <h3 className="text-2xl font-black text-gray-800">{stats?.totalRevenue?.toLocaleString('vi-VN') || 0}<span className="text-sm ml-1 text-gray-500">đ</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Tổng đơn hàng</p>
            <h3 className="text-2xl font-black text-gray-800">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Tổng sản phẩm</p>
            <h3 className="text-2xl font-black text-gray-800">{stats?.totalProducts || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            <Layers size={28} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Tổng danh mục</p>
            <h3 className="text-2xl font-black text-gray-800">{stats?.totalCategories || 0}</h3>
          </div>
        </div>
      </div>

      {/* HÀNG 2: Đơn hàng & Quản lý user */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Bảng đơn hàng */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-800 uppercase">Đơn hàng gần đây</h2>
            <a href="/admin/orders" className="text-sm font-bold text-cyan-600 hover:text-cyan-800">Xem tất cả</a>
          </div>
          
          <div className="overflow-x-auto flex-1 p-2">
            {stats?.recentOrders?.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                    <th className="p-4">Mã ĐH</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Ngày đặt</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-cyan-600">#{order._id.substring(16).toUpperCase()}</td>
                      <td className="p-4">{order.user?.fullname || 'Khách vãng lai'}</td>
                      <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 font-bold text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')} đ</td>
                      <td className="p-4">{renderStatus(order.status)}</td>
                      <td className="p-4 text-center">
                        <button className="p-2 text-gray-400 hover:text-[#0071e3] hover:bg-blue-50 rounded-lg transition-all"><Eye size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <ShoppingBag size={48} className="mb-3 opacity-20" />
                <p className="font-medium text-gray-500">Chưa có đơn hàng nào trong hệ thống</p>
              </div>
            )}
          </div>
        </div>

        {/* Quản lý user */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <h2 className="text-lg font-black text-gray-800 uppercase mb-2 pl-1">Phân tích người dùng</h2>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase mb-1">Tổng người dùng</p>
              <h4 className="text-2xl font-black text-gray-800">{stats?.userStats?.totalUsers || 0}</h4>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center shrink-0">
              <Users size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase mb-1">Đăng ký mới (24h)</p>
              <h4 className="text-2xl font-black text-gray-800">{stats?.userStats?.newUsers24h || 0}</h4>
            </div>
            {stats?.userStats?.newUsers24h > 0 && (
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-md">
                <TrendingUp size={16}/> Tăng
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase mb-1">Khách mua hàng (24h)</p>
              <h4 className="text-2xl font-black text-gray-800">{stats?.userStats?.purchasingUsers24h || 0}</h4>
            </div>
            {stats?.userStats?.purchasingUsers24h > 0 && (
              <div className="flex items-center gap-1 text-rose-500 font-bold text-sm bg-rose-50 px-2 py-1 rounded-md">
                <TrendingUp size={16}/> Phát sinh
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;