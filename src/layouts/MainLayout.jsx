import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Store_address from './Store_address'; 

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> 

      <main className="flex-grow bg-gray-50">
        <Outlet /> 
      </main>

      <Store_address />

      <Footer />
    </div>
  );
};

export default MainLayout;