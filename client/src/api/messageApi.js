import api from './axios';

export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  createConversation: (userId) => api.post('/messages/conversations', { participantId: userId }),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (data) => {
    if (data instanceof FormData) {
      return api.post('/messages', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/messages', data);
  }
};
