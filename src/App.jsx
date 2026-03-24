import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ProtectedRoute, GuestRoute } from './routes/AuthGuards';
import MainLayout from "./layouts/MainLayout";
import { AppProvider } from './context/AppContext';
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from './pages/ProductDetail';
import WishList from "./pages/WishList";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
            <Route path='/wishlist' element={<WishList />} />  
            <Route path="/category/:slug" element={<Category />} /> 

            {/* CHỈ KHÁCH CHƯA ĐĂNG NHẬP */}
            <Route element={<GuestRoute />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Route>

            {/* CHỈ NGƯỜI ĐÃ ĐĂNG NHẬP */}
            <Route element={<ProtectedRoute />}>
              <Route path='/cart' element={<Cart />} />
            </Route>
          </Route>
        </Routes> 
      </Router>
    </AppProvider>
  )
}

export default App;