import api from './axios';

export const notificationApi = {
  getNotifications: (page = 1) => api.get(`/notifications?page=${page}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};
