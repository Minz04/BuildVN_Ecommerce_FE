import axiosClient from '../utils/axiosClient';

export const reviewApi = {
    // Gọi để kiểm tra xem khách đã đánh giá món này chưa (để cho phép sửa)
    checkReview: (computerId, orderId) => {
        return axiosClient.get(`/reviews/check?computerId=${computerId}&orderId=${orderId}`);
    },
    // Gửi đánh giá mới hoặc cập nhật đánh giá cũ
    submitReview: (data) => {
        return axiosClient.post('/reviews', data);
    },
    // Lấy danh sách đánh giá hiển thị ở trang Chi tiết sản phẩm
    getProductReviews: (computerId) => {
        return axiosClient.get(`/reviews/product/${computerId}`);
    }
};