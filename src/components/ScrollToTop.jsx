import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Lấy ra đường dẫn hiện tại (ví dụ: '/login', '/products')
  const { pathname } = useLocation();

  useEffect(() => {
    // Trình duyệt sẽ tự động cuộn lên toạ độ x: 0, y: 0 mỗi khi đường dẫn thay đổi
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Dùng "instant" để chuyển ngay lập tức, hoặc "smooth" nếu muốn cuộn từ từ
    });
  }, [pathname]);

  // Component này chỉ chạy logic ngầm, không render ra giao diện gì cả
  return null;
};

export default ScrollToTop;