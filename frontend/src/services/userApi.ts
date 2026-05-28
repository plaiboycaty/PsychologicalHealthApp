import axiosClient from '../api/axiosClient';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  gender: string | null;
  dob: string | null;
  avatar_url: string | null;
  treatment_status?: string;
}

export const userApi = {
  // Lấy thông tin cá nhân
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response: any = await axiosClient.get('/users/me');
      // axiosClient đã trả về response.data, và bên trong nó có cấu trúc { message, data }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (data: { full_name?: string; gender?: string; dob?: string; avatar_url?: string }) => {
    try {
      const response: any = await axiosClient.put('/users/me', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (data: { old_password: string; new_password: string }) => {
    try {
      const response: any = await axiosClient.put('/users/change-password', data);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
