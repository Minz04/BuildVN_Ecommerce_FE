import axiosClient from '../utils/axiosClient';

export const productApi = {
  // 1. Lấy Máy tính
  getAllProducts: () => {
    return axiosClient.get('/computers');
  },

  // 2. Lấy Danh mục
  getCategories: () => {
    return axiosClient.get('/categories');
  },

  // 3. Lấy Banner 
  getBanners: () => {
    return axiosClient.get('/banners');
  },

  // 4. Lấy 1 Sản phẩm 
  getProductBySlug: (slug) => {
    return axiosClient.get(`/computers/${slug}`);
  }
};