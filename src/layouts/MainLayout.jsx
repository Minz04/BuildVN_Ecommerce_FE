import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Store_address from './Store_address'; 

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar luôn ở trên cùng */}
      <Navbar /> 
      
      {/* 2. Phần nội dung trang thay đổi (Pages) */}
      <main className="flex-grow bg-gray-50">
        <Outlet /> 
      </main>

      {/* 3. Địa chỉ cửa hàng */}
      <Store_address />

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;