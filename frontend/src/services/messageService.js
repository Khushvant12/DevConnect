import api from './api.js';

export const messageService = {
  getConversations: () => api.get('/messages/conversations'),

  getMessages: (userId, params) => api.get(`/messages/${userId}`, { params }),

  sendMessage: (receiverId, content) =>
    api.post('/messages/send', { receiverId, content }),
};
