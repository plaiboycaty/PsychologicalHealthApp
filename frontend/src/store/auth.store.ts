import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { userApi } from '../services/userApi';

const TOKEN_KEY = 'auth_token';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  gender: string;
  dob: string;
  avatar_url?: string;
  treatment_status?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  updateUser: (user: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (token, user) => {
    // Lưu token vào nơi bảo mật nhất của điện thoại
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    // Xóa token khỏi máy
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  restoreToken: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        // Tạm thời set token vào store để axiosClient có thể lấy ra gắn vào Header Authorization
        set({ token });

        try {
          // Lấy thông tin user bằng token hiện tại
          const response: any = await userApi.getProfile();
          // Nếu thành công, set user profile và đổi trạng thái
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (apiError) {
          // Token có thể đã hết hạn hoặc không hợp lệ, xóa token và đưa về trạng thái chưa đăng nhập
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        // Không có token -> Chưa đăng nhập
        set({ token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },
}));
