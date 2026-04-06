import axiosClient from '../utils/axiosClient';

export const userApi = {
    getProfile: () => {
        return axiosClient.get('/auth/profile');
    },

    updateProfile: (data) => {
        return axiosClient.put('/auth/profile', data);
    },

    changePassword: (data) => {
        return axiosClient.put('/auth/change-password', data);
    },

    uploadAvatar: (formData) => {
        return axiosClient.post('/auth/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};