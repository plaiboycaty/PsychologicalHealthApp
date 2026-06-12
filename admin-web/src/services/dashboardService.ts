import apiClient from '../api/client';

export const dashboardService = {
  getStats: async () => {
    return apiClient.get('/admin/dashboard/stats');
  }
};
