import apiClient from '../api/client';

export const userService = {
  getAllUsers: async () => {
    return apiClient.get('/admin/users');
  },

  updateUserStatus: async (userId: string | number, status: string) => {
    return apiClient.put(`/admin/users/${userId}/status`, { status });
  }
};
