// 1. Khởi tạo Database ảo khi app chạy lần đầu
const initMockDB = () => {
    const users = localStorage.getItem('mockUsersDB');
    if (!users) {
        // Tạo sẵn 1 tài khoản mặc định để bạn test đăng nhập ngay lập tức
        const defaultUsers = [
            {
                id: '69b229645a3da422fcd5a15b',
                username: 'admin',
                fullname: 'Nguyễn Trần Bảo Minh',
                email: 'abc@gmail.com',
                phone: '1234567890',
                address: 'TP.HCM',
                password: '123456', // Pass thô để test
                role: 'user'
            }
        ];
        localStorage.setItem('mockUsersDB', JSON.stringify(defaultUsers));
    }
};

initMockDB();

// 2. Service giả lập Axios API
export const mockAuthAPI = {
    // GIẢ LẬP API ĐĂNG KÝ
    register: async (data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('mockUsersDB'));

                // Kiểm tra trùng Email hoặc Username
                const isExist = users.find(u => u.email === data.email || u.username === data.username);
                if (isExist) {
                    // Trả về lỗi giống cấu trúc của Axios
                    reject({ response: { data: { message: 'Tên đăng nhập hoặc email đã tồn tại' } } });
                } else {
                    // Lưu user mới vào DB ảo
                    const newUser = { ...data, id: 'mock_id_' + Date.now(), role: 'user' };
                    users.push(newUser);
                    localStorage.setItem('mockUsersDB', JSON.stringify(users));

                    resolve({ data: { message: 'Đăng ký thành công' } });
                }
            }, 1500); // Giả lập mạng load 1.5s
        });
    },

    // GIẢ LẬP API ĐĂNG NHẬP
    login: async ({ email, password, rememberMe }) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('mockUsersDB'));

                // Tìm user có email và pass khớp
                const user = users.find(u => u.email === email && u.password === password);

                if (!user) {
                    reject({ response: { data: { message: 'Email hoặc mật khẩu không chính xác' } } });
                } else {
                    // Tạo token giả và trả về thông tin giống Backend của bạn
                    const fakeToken = 'mock_jwt_token_123456';
                    resolve({
                        data: {
                            token: fakeToken,
                            user: {
                                id: user.id,
                                email: user.email,
                                fullname: user.fullname,
                                phone: user.phone,
                                address: user.address,
                                role: user.role
                            }
                        }
                    });
                }
            }, 1500);
        });
    }
};