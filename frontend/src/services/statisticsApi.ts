import axiosClient from '../api/axiosClient';

export const statisticsApi = {
  getTestHistory: (period: string) => {
    return axiosClient.get(`/statistics/tests/history`, {
      params: { period }
    });
  },
  getEmotionStats: (period: string) => {
    return axiosClient.get(`/statistics/diaries/emotions`, {
      params: { period }
    });
  }
};
