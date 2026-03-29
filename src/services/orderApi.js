import axiosClient from '../utils/axiosClient';

export const orderApi = {
    // 1. Tạo đơn hàng (COD)
    createOrder: (data) => {
        return axiosClient.post('/orders/create', data);
    },

    // 2. Lấy danh sách đơn hàng đã mua
    getMyOrders: (status = '') => {
        return axiosClient.get(`/orders/my-orders${status ? `?status=${status}` : ''}`);
    },

    // 3. Gọi VNPAY (Đã fix chuẩn link với Backend của bạn)
    createPaymentUrl: (orderId) => {
        return axiosClient.post(`http://localhost:3000/payment/create/${orderId}`);
    },

    // 4.Hủy đặt hàng
    cancelOrder: (orderId) => {
        return axiosClient.put(`/orders/${orderId}/cancel`);
    },

    // 5. Lấy chi tiết đơn hàng
    getOrderDetail: (orderId) => {
        return axiosClient.get(`/orders/${orderId}/detail`);
    }
};