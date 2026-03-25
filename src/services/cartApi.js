import axiosClient from '../utils/axiosClient';

export const cartApi = {
    // Lấy toàn bộ giỏ hàng
    getCart: () => {
        return axiosClient.get('/cart');
    },
    // Thêm vào giỏ hàng (Cần ID máy tính và số lượng)
    addToCart: (computerId, quantity = 1) => {
        return axiosClient.post('/cart', { computerId, quantity });
    },
    // Sửa số lượng (Cần ID của cục CartItem)
    updateQuantity: (cartitemId, quantity) => {
        return axiosClient.put(`/cart/${cartitemId}`, { quantity });
    },
    // Xóa 1 sản phẩm khỏi giỏ
    removeFromCart: (cartitemId) => {
        return axiosClient.delete(`/cart/${cartitemId}`);
    },
    // Xóa sạch giỏ hàng (Dùng khi thanh toán xong)
    clearCart: () => {
        return axiosClient.delete('/cart');
    }
};