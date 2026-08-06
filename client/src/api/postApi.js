import api from './axios';

export const postApi = {
  getPosts: (page = 1) => api.get(`/posts?page=${page}`),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  addComment: (postId, content, parentComment = null) => api.post(`/comments/posts/${postId}/comments`, { content, parentComment }),
  getComments: (postId) => api.get(`/comments/posts/${postId}/comments`),
  updateComment: (commentId, content) => api.put(`/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  reactComment: (commentId) => api.put(`/comments/${commentId}/like`),
  getPostsByUser: (userId, page = 1) => api.get(`/posts/user/${userId}?page=${page}`),
};
