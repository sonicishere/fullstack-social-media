import axios from 'axios';
import { API_URL } from '../utils/constants';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await instance.post('/auth/refresh', { token: refreshToken });
        const newToken = res.data.accessToken || res.data.token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        }
        throw new Error('No new access token');
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
