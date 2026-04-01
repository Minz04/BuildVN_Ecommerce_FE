import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-14 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        
        {/* Grid chia 4 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Cột 1 */}
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6 tracking-wide">Về TTGSHOP</h3>
            <ul className="flex flex-col space-y-3">
              <li>
                <Link to="/about" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/tuyen-dung" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: CHÍNH SÁCH */}
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6 tracking-wide">Chính sách</h3>
            <ul className="flex flex-col space-y-3">
              <li>
                <Link to="/chinh-sach-bao-hanh" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-giao-hang" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-bao-mat" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: THÔNG TIN */}
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6 tracking-wide">Thông tin</h3>
            <ul className="flex flex-col space-y-3">
              <li>
                <Link to="/he-thong-cua-hang" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/huong-dan-mua-hang" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="/huong-dan-thanh-toan" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link to="/huong-dan-tra-gop" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Hướng dẫn trả góp
                </Link>
              </li>
              <li>
                <Link to="/tra-cuu-bao-hanh" className="text-[15px] font-medium text-gray-500 hover:text-cyan-600 transition-all duration-300 hover:translate-x-1 inline-block">
                  Tra cứu địa chỉ bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: TỔNG ĐÀI HỖ TRỢ */}
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6 tracking-wide">
              Tổng đài hỗ trợ <span className="text-[13px] font-medium text-gray-400 lowercase ml-1">(9:00 - 21:30)</span>
            </h3>
            <ul className="flex flex-col space-y-4 text-[15px] text-gray-600 font-medium">
              <li className="flex items-center">
                <span className="w-24 text-gray-500">Mua hàng:</span>
                <a href="tel:0986552233" className="text-cyan-600 font-black hover:text-cyan-700 transition-colors">098.655.2233</a>
              </li>
              <li className="flex items-center">
                <span className="w-24 text-gray-500">Bảo hành:</span>
                <a href="tel:0879979997" className="text-cyan-600 font-black hover:text-cyan-700 transition-colors">087.997.9997</a>
              </li>
              <li className="flex items-center">
                <span className="w-24 text-gray-500">Khiếu nại:</span>
                <a href="tel:18006173" className="text-cyan-600 font-black hover:text-cyan-700 transition-colors">1508.6677</a>
              </li>
              <li className="flex items-start">
                <span className="w-24 text-gray-500 shrink-0">Email:</span>
                <a href="mailto:ttgshoponline@gmail.com" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors break-all">ntbm102004@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Dòng bản quyền cuối trang */}
        <div className="mt-14 pt-6 border-t border-gray-100 text-center text-[14px] font-medium text-gray-400">
          <p>© 2026 TTGSHOP & BUILDVN. All rights reserved. Đồ án - NNPTUDM.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;