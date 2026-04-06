import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ProtectedRoute, GuestRoute, AdminRoute } from './routes/AuthGuards';
import MainLayout from "./layouts/MainLayout";
import { AppProvider } from './context/AppContext';
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminStores from './pages/admin/AdminStores';
import AdminChat from './pages/admin/AdminChat';

import Products from "./pages/Products";
import ProductDetail from './pages/ProductDetail';
import WishList from "./pages/WishList";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlashSale from './pages/FlashSale';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import ChatWidget from './components/ChatWidget';

const App = () => {
  return (      
    <AppProvider> 
      <Router>
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} /> 
            <Route path='/product/:slug' element={<ProductDetail />} />
            <Route path="/category/:slug" element={<Category />} /> 
            <Route path="/flash-sale" element={<FlashSale />} />

            {/* Khách chưa đăng nhập*/}
            <Route element={<GuestRoute />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Route>

            {/* User đăng nhập*/}
            <Route element={<ProtectedRoute />}>
              <Route path='/cart' element={<Cart />} />
              <Route path='/wishlist' element={<WishList />} />  
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>  

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} /> 
              <Route path='orders' element={<AdminOrders />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='categories' element={<AdminCategories />} />
              <Route path='coupons' element={<AdminCoupons />} />
              <Route path='users' element={<AdminUsers />} />
              <Route path='reviews' element={<AdminReviews />} />
              <Route path='stores' element={<AdminStores />} />
              <Route path='chats' element={<AdminChat />} />
            </Route>
          </Route>

        </Routes>
        <ChatWidget /> 
      </Router>
    </AppProvider>
  )
}

export default App;