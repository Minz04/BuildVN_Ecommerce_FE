import axios from 'axios';

// 1. Khởi tạo một instance của Axios với Base URL chung
const instance = axios.create({
    // Thay đổi 5000 thành cổng mà Backend Node.js của bạn đang chạy
    baseURL: 'http://localhost:5000/api',
    timeout: 10000, // Tối đa 10s nếu BE không phản hồi thì báo lỗi mạng
});

// 2. Cấu hình Interceptor 
// Tự động nhét Token vào Header của mọi API mà không cần tự viết thủ công ở từng file
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Cấu hình Interceptor 
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Nếu BE trả về lỗi 401 (Hết hạn token hoặc Token sai) -> Tự động đá văng ra log in
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;