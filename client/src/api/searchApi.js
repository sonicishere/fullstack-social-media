import api from './axios';

export const searchApi = {
  searchUsers: (query) => api.get(`/search/users?q=${query}`),
  searchPosts: (query) => api.get(`/search/posts?q=${query}`),
};
