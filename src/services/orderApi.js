import axiosClient from '../utils/axiosClient';

export const orderApi = {
    // 1. Tạo đơn hàng (Chỉ cần gửi Địa chỉ và SĐT)
    createOrder: (data) => {
        return axiosClient.post('/orders/create', data);
    },
    // 2. Lấy danh sách đơn hàng đã mua
    getMyOrders: (status = '') => {
        return axiosClient.get(`/orders/my-orders${status ? `?status=${status}` : ''}`);
    },
    // 3. Gọi VNPAY (truyền orderId vào params)
    createPaymentUrl: (orderId) => {
        return axiosClient.post(`/payments/create_payment_url/${orderId}`);
    }
};