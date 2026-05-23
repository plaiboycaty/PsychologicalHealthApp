import axiosClient from '../api/axiosClient';

export const authApi = {
  login: async (email: string, password: string) => {
    return axiosClient.post('/auth/login', { email, password });
  },

  register: async (data: {
    full_name: string;
    email: string;
    password: string;
    gender: string;
    dob: string;
  }) => {
    return axiosClient.post('/auth/register', data);
  },
};
