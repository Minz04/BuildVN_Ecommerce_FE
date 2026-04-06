import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  ShoppingBag, Package, Layers, Users, 
  LayoutDashboard, Ticket, MessageSquare, Star, Store, LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Quản lý Đơn hàng' },
    { path: '/admin/products', icon: Package, label: 'Quản lý Sản phẩm' },
    { path: '/admin/categories', icon: Layers, label: 'Danh mục' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
    { path: '/admin/coupons', icon: Ticket, label: 'Mã giảm giá' },
    { path: '/admin/chats', icon: MessageSquare, label: 'Tin nhắn' },
    { path: '/admin/reviews', icon: Star, label: 'Đánh giá' },
    { path: '/admin/stores', icon: Store, label: 'Hệ thống Cửa hàng' },
  ];

  // Kết nối Socket để nghe báo có tin nhắn mới
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("admin_new_chat_alert", () => {
         setUnreadChatCount(prev => prev + 1);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">BUILDVN ADMIN</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // Kiểm tra có phải menu "Tin nhắn" không 
            const isChatMenu = item.path === '/admin/chats';

            return (
              <Link 
                key={item.path} 
                to={item.path} 
                // Nếu bấm vào "Tin nhắn" thì reset chấm đỏ về 0
                onClick={() => {
                    if (isChatMenu) setUnreadChatCount(0);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/30 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-cyan-600'
                }`}
              >
                <Icon size={20} /> 
                
                {/* Khu vực chứa tên menu và chấm đỏ */}
                <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    
                    {/* Hiển thị tin nhắn nếu chưa đọc */}
                    {isChatMenu && unreadChatCount > 0 && (
                        <span className="bg-[#e30019] text-white px-2 py-0.5 rounded-full text-[11px] font-black shadow-sm animate-bounce">
                            {unreadChatCount > 9 ? '9+' : unreadChatCount}
                        </span>
                    )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
            <LogOut size={20} /> Thoát Admin
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen relative">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;