import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, Phone, Monitor, ShoppingCart, Menu, ChevronDown, ChevronRight, Cpu, Gamepad2, Laptop, MonitorPlay, User, LogOut } from 'lucide-react'; // Thêm icon LogOut
import { useNavigate, Link } from 'react-router-dom';
import { mockCategories, mockVerticalMenu, mockMainMenu } from '../mock/categoryData';
import { AppContext } from '../context/AppContext';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Gamepad2': return <Gamepad2 size={18} />;
    case 'MonitorPlay': return <MonitorPlay size={18} />;
    case 'Cpu': return <Cpu size={18} />;
    case 'Laptop': return <Laptop size={18} />;
    case 'Monitor': return <Monitor size={18} />;
    default: return <Monitor size={18} />;
  }
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState(mockCategories);

  // STATE CHO "TẤT CẢ DANH MỤC"
  const [openCategory, setOpenCategory] = useState(false);
  const categoryRef = useRef(null);

  const [verticalMenu, setVerticalMenu] = useState(mockVerticalMenu);
  const [mainMenu, setMainMenu] = useState(mockMainMenu);

  // Context và Navigation
  const navigate = useNavigate();
  const { cart, user, setUser, wishlist } = useContext(AppContext); 
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Xóa token để an toàn
    navigate('/login'); // Đá văng về trang đăng nhập
  };

  // Hiệu ứng cuộn để ẩn hiện menu dưới
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true); 
      } else if (window.scrollY < 50) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hiệu ứng click ra ngoài để đóng menu "Tất cả danh mục"
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300">
      
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 group">
          <h1 className="text-3xl font-black italic tracking-tighter">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">BUILD</span>
            <span className="text-gray-900">VN</span>
          </h1>
        </Link>

        {/* Khung tìm kiếm */}
        <div className="flex-grow max-w-3xl flex items-center border-2 border-gray-200 focus-within:border-cyan-500 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)] rounded-lg bg-white transition-all duration-300 relative">

          <div ref={categoryRef} className="relative h-full">
            <div
              onClick={() => setOpenCategory(prev => !prev)}
              className={`px-4 py-2.5 flex items-center gap-1.5 cursor-pointer text-[14px] font-bold whitespace-nowrap h-full transition-all rounded-l-md
              ${openCategory ? "bg-gray-50 text-cyan-600" : "bg-white hover:bg-gray-50 text-gray-700"}`}
            >
              Tất cả danh mục
              <ChevronDown size={14} className={`transition-transform duration-300 ${openCategory ? "rotate-180 text-cyan-500" : "text-gray-400"}`} />
            </div>

            {openCategory && (
              <div className="absolute top-full left-0 w-64 pt-2 z-[100]">
                <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 py-2 rounded-xl">
                  {verticalMenu.map((item, index) => (
                    <Link
                      key={index}
                      to="#"
                      onClick={() => setOpenCategory(false)}
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-cyan-50 hover:text-cyan-600 transition-colors text-[14px] font-bold text-gray-700 group"
                    >
                      <Monitor size={16} className="text-gray-400 group-hover:text-cyan-500 transition-colors" />
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-[1px] bg-gray-200"></div>
          </div>

          {/* Input tìm kiếm */}
          <div className="relative flex-grow h-full flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, linh kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2.5 outline-none text-[15px] text-gray-800 placeholder-gray-400 font-medium bg-transparent"
            />
          </div>

          <button 
            onClick={handleSearch} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 cursor-pointer px-7 py-2.5 text-white flex items-center justify-center transition-all rounded-r-md h-full"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Công cụ */}
        <div className="flex items-center gap-5">
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2.5 bg-gray-100 group-hover:bg-cyan-50 text-gray-500 group-hover:text-cyan-600 rounded-full transition-colors duration-300">
              <Phone size={20} />
            </div>
            <div className="text-[14px] hidden lg:block">
              <p className="text-gray-500 font-medium leading-tight">Hotline</p>
              <p className="font-black text-gray-800 group-hover:text-cyan-600 transition-colors">098.655.2233</p>
            </div>
          </div>

          <Link to="/wishlist" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gray-100 group-hover:bg-cyan-50 text-gray-500 group-hover:text-cyan-600 rounded-full relative transition-colors duration-300">
              <Monitor size={24} />
              <span className="absolute -top-1 -right-1 bg-[#ff4d4f] text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                {wishlist?.length || 0}
              </span>
            </div>
            <span className="text-[14px] font-black text-gray-800 group-hover:text-cyan-600 transition-colors hidden lg:block">Yêu thích</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gray-100 group-hover:bg-cyan-50 text-gray-500 group-hover:text-cyan-600 rounded-full relative transition-colors duration-300">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-[#ff4d4f] text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                {cart.length}
              </span>
            </div>
            <div className="text-[14px] font-black text-gray-800 group-hover:text-cyan-600 transition-colors hidden lg:block">Giỏ hàng</div>
          </Link>

          {/* BƯỚC 3: KIỂM TRA ĐĂNG NHẬP */}
          {user ? (
            // NẾU ĐÃ ĐĂNG NHẬP -> Hiện Avatar + Tên + Menu Đăng xuất
            <div className="relative group cursor-pointer flex items-center gap-3">
              
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                <img 
                  src={
                    !user?.avatar ? 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg' 
                    : user.avatar.startsWith('http') ? user.avatar 
                    : `http://localhost:3000${user.avatar}`
                  } 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[14px] hidden lg:block">
                <p className="text-gray-500 font-medium leading-tight">Xin chào,</p>
                <p className="font-black text-gray-800 line-clamp-1 max-w-[100px] group-hover:text-cyan-600 transition-colors">{user.fullname || user.email}</p>
              </div>

              {/* Dropdown Đăng xuất */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-600 font-semibold">Tài khoản của tôi</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-600 font-semibold">Đơn hàng của tôi</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            // NẾU CHƯA ĐĂNG NHẬP -> Hiện nút Login (GIỮ NGUYÊN)
            <Link to="/login" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gray-100 group-hover:bg-cyan-50 text-gray-500 group-hover:text-cyan-600 rounded-full transition-colors duration-300">
                <User size={20} />
              </div>
              <div className="text-[14px] hidden lg:block">
                <p className="text-gray-500 font-medium leading-tight">Tài khoản</p>
                <p className="font-black text-gray-800 group-hover:text-cyan-600 transition-colors">Đăng nhập</p>
              </div>
            </Link>
          )}

        </div>
      </div>

      {/* HÀNG 2 - Menu */}
      <div className={`bg-white border-t border-gray-100 transition-all duration-300 ease-in-out grid ${isScrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
        <div className={isScrolled ? "overflow-hidden" : "overflow-visible"}>
          <div className="container mx-auto px-4 flex items-center pt-2 pb-1">

            <div className="relative group">
              <div className="bg-slate-900 text-white flex items-center gap-2 px-6 py-3 cursor-pointer font-bold text-[15px] uppercase min-w-[260px] rounded-t-lg shadow-sm">
                <Menu size={20} />
                DANH MỤC SẢN PHẨM
              </div>

              <div className="absolute top-[100%] left-0 w-full pt-0 hidden group-hover:block z-[100]">
                <ul className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col rounded-b-lg overflow-hidden">
                  {mainMenu.map((item, idx) => (
                    <li key={idx} className="border-b border-gray-50 last:border-0 group/item">
                      <Link
                        to="#"
                        className="flex justify-between items-center px-5 py-3.5 hover:bg-cyan-50 hover:text-cyan-600 transition-colors text-[14px] font-bold text-gray-700"
                      >
                        {item.name}
                        {item.hasSub && (
                          <ChevronRight size={16} className="text-gray-400 group-hover/item:text-cyan-500 transition-colors" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <nav className="flex items-center justify-between flex-grow pl-8">
              {categories.map((cat) => (
                <div key={cat.id} className="relative group py-3">

                  <Link
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-1.5 text-[14px] font-black text-gray-700 hover:text-cyan-600 transition-colors uppercase whitespace-nowrap"
                  >
                    <span className="text-gray-400 group-hover:text-cyan-500 transition-colors">{getIcon(cat.iconName)}</span>
                    {cat.name}

                    {cat.subMenu && cat.subMenu.length > 0 && (
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-cyan-500 transition-colors ml-0.5" />
                    )}
                  </Link>

                  {cat.subMenu && cat.subMenu.length > 0 && (
                    <div className="absolute top-[100%] left-0 pt-2 hidden group-hover:block z-[100]">
                      <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-7 flex gap-8 w-max cursor-default rounded-xl">

                        {cat.subMenu.map((col, idx) => (
                          <div key={idx} className="min-w-[160px]">
                            <h3 className="font-black text-[14px] mb-4 uppercase text-gray-900 border-b border-gray-100 pb-2">
                              {col.title}
                            </h3>
                            <ul className="space-y-3">
                              {col.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    to="#"
                                    className="text-[14px] font-medium text-gray-600 hover:text-cyan-600 transition-colors block whitespace-nowrap hover:translate-x-1 transform duration-200"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                      </div>
                    </div>
                  )}

                </div>
              ))}
            </nav>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;