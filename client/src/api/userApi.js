import api from './axios';

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePassword: (data) => api.put('/users/password', data),
  followUser: (id) => api.put(`/users/${id}/follow`),
  unfollowUser: (id) => api.put(`/users/${id}/unfollow`),
  getFollowers: (id) => api.get(`/users/${id}/followers`),
  getFollowing: (id) => api.get(`/users/${id}/following`),
  getSuggestedUsers: () => api.get('/users/suggested'),
};
