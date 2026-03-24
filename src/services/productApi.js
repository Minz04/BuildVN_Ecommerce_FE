import axiosClient from '../utils/axiosClient';

export const productApi = {
  getAllProducts: () => {
    return axiosClient.get('/computers');
  },
  getCategories: () => {
    return axiosClient.get('/categories');
  },
  getBanners: () => {
    return axiosClient.get('/banners');
  },
  getProductBySlug: (slug) => {
    return axiosClient.get(`/computers/${slug}`);
  },

  // DÙNG HÀM NÀY: Tìm thẳng bằng cái ID gốc
  getByCategoryId: (categoryId) => {
    return axiosClient.get(`/computers/category/${categoryId}`);
  }
};