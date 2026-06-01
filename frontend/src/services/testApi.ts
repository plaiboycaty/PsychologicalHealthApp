import axiosClient from '../api/axiosClient';

export const testApi = {
  getAllTests: async () => {
    return axiosClient.get('/tests');
  },

  getTestDetail: async (id: number) => {
    return axiosClient.get(`/tests/${id}`);
  },

  submitTest: async (data: { test_id: number; option_ids: number[] }) => {
    return axiosClient.post('/tests/submit', data);
  },

  getLatestTest: async () => {
    return axiosClient.get('/tests/latest');
  },

  getHistory: async () => {
    return axiosClient.get('/tests/history');
  },

  sendEmergencyEmail: async (data: { category: string; score: number }) => {
    return axiosClient.post('/tests/emergency-email', data);
  }
};
