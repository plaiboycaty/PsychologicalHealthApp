import axios from 'axios';


// Cấu hình URL mặc định của Backend XAMPP
// Lưu ý: Chạy trên máy ảo Android (Emulator), localhost của máy tính phải được gọi bằng IP: 10.0.2.2
// Test trên điện thoại thật chung mạng Wifi, thay bằng IP máy tính (VD: 192.168.1.x)
const BASE_URL = 'http://10.0.2.2:3000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Quá 10s không thấy Backend trả lời thì báo lỗi
});

// REQUEST INTERCEPTOR: Kiểm tra token trước khi gửi đi
axiosClient.interceptors.request.use(
  async (config) => {
    // Móc vào kho Zustand bằng require cục bộ để tránh Require cycle
    const { useAuthStore } = require('../store/auth.store');
    const token = useAuthStore.getState().token;

    // Nếu có token, tự động nhét vào Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Kiểm tra token trước khi nhận về
axiosClient.interceptors.response.use(
  (response) => {
    // Backend trả về thành công -> Cho qua luôn, chỉ lấy phần data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi trả về từ Backend
    const statusCode = error.response?.status;

    // Nếu Backend báo lỗi 401 (Unauthorized - Chưa đăng nhập hoặc Token hết hạn)
    if (statusCode === 401) {
      console.warn('[Axios] Lỗi 401: Token hết hạn hoặc không hợp lệ!');

      // Gọi lệnh logout trong kho Zustand bằng require cục bộ
      const { useAuthStore } = require('../store/auth.store');
      useAuthStore.getState().logout();
    }

    // Ném lỗi ra ngoài để các hàm gọi API ở Màn Hình có thể bắt (catch) và báo lỗi cho người dùng
    return Promise.reject(error);
  }
);

export default axiosClient;
