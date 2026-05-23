import axiosClient from '../api/axiosClient';

export const userApi = {
  getProfile: async () => {
    return axiosClient.get('/users/me');
  },
  
  updateProfile: async (data: any) => {
    return axiosClient.put('/users/me', data);
  },

  changePassword: async (data: any) => {
    return axiosClient.put('/users/change-password', data);
  }
};
