import { create } from 'zustand';
import type { AdminUser } from '../types';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // Hàm đăng nhập: Lưu vào state & ghi vào localStorage
  login: (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    set({ token, user });
  },

  // Hàm đăng xuất: Xóa state & dọn dẹp localStorage
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null });
  },

  // Tự động đồng bộ lại State từ localStorage khi tải lại trang
  initialize: () => {
    const token = localStorage.getItem('admin_token');
    const userJson = localStorage.getItem('admin_user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as AdminUser;
        if (user && user.role === 'admin') {
          set({ token, user });
        } else {
          // Nếu không phải admin thì xoá luôn token cũ tránh lỗ hổng
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      } catch (e) {
        console.error('Lỗi phân tích cú pháp dữ liệu admin từ localStorage:', e);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  },
}));
