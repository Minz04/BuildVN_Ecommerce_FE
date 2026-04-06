import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Lấy ra đường dẫn hiện tại (ví dụ: '/login', '/products')
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Cuộn ngay lập tức or dùng 'smooth' để cuộn mượt mà
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;