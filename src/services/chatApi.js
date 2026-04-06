import axiosClient from '../utils/axiosClient';

export const chatApi = {
    createChat: () => {
        return axiosClient.post('/chats/create');
    },

    getMessages: (chatId) => {
        return axiosClient.get(`/chats/messages/${chatId}`);
    },

    sendMessage: (chatId, data) => {
        return axiosClient.post(`/chats/send/${chatId}`, data);
    }
};