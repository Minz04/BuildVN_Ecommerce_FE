import axiosClient from '../utils/axiosClient';

export const productApi = {
  // Lấy tất cả sản phẩm (Có thể truyền thêm query như ?search=RTX)
  getAllProducts: (params) => {
    return axiosClient.get('api/computers', { params }); 
  },
  // Lấy chi tiết 1 sản phẩm
  getProductById: (id) => {
    return axiosClient.get(`/slug/${id}`);
  },
  // Lấy danh mục
  getCategories: () => {
    return axiosClient.get('api/categories');
  }
};