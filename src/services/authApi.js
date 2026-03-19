import axiosClient from '../utils/axiosClient';

export const authApi = {
  login: (data) => {
    return axiosClient.post('api/auth/login', data); // Gửi email, password lên BE
  },
  register: (data) => {
    return axiosClient.post('api/auth/register', data);
  }
};  