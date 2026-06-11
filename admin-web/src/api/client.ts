import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tự động đính kèm token xác thực quản trị viên
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: xử lý tập trung mã lỗi HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Có thể xử lý tự động xoá token và chuyển hướng đăng nhập ở đây
      console.warn('🚨 Yêu cầu bị từ chối do chưa xác thực hoặc token hết hạn!');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
