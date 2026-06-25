import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.42:3000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

axiosClient.interceptors.request.use(
  async (config) => {
    const { useAuthStore } = require('../store/auth.store');
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      console.warn('[Axios] Lỗi 401: Token hết hạn hoặc không hợp lệ!');

      const { useAuthStore } = require('../store/auth.store');
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
