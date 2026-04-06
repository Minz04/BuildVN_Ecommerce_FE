import axiosClient from '../utils/axiosClient';

export const orderApi = {
    //  Tạo đơn hàng (COD)
    createOrder: (data) => {
        return axiosClient.post('/orders/create', data);
    },

    // Lấy danh sách đơn hàng đã mua
    getMyOrders: (status = '') => {
        return axiosClient.get(`/orders/my-orders${status ? `?status=${status}` : ''}`);
    },

    // Gọi VNPAY 
    createPaymentUrl: (orderId) => {
        return axiosClient.post(`http://localhost:3000/payment/create/${orderId}`);
    },

    // Hủy đặt hàng
    cancelOrder: (orderId) => {
        return axiosClient.put(`/orders/${orderId}/cancel`);
    },

    // Lấy chi tiết đơn hàng
    getOrderDetail: (orderId) => {
        return axiosClient.get(`/orders/${orderId}/detail`);
    }
};