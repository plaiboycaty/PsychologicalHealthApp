import apiClient from '../api/client';

export const reportService = {
  generateReport: async (startDate: string, endDate: string) => {
    return apiClient.get(`/admin/reports/generate?startDate=${startDate}&endDate=${endDate}`);
  }
};
