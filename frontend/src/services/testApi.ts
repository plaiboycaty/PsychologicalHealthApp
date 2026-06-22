import axiosClient from '../api/axiosClient';
import { Test, TestQuestion, TestResult } from '../types/models';

export const testApi = {
  getAllTests: async (): Promise<{ tests: Test[] }> => {
    return axiosClient.get('/tests');
  },

  getTestDetail: async (id: number): Promise<{ test: { id: number; name: string; description: string; questions: TestQuestion[] } }> => {
    return axiosClient.get(`/tests/${id}`);
  },

  submitTest: async (data: { test_id: number; option_ids: number[] }): Promise<{ message: string; treatment_status: string; result: any }> => {
    return axiosClient.post('/tests/submit', data);
  },

  getLatestTest: async (): Promise<{ data: TestResult | null }> => {
    return axiosClient.get('/tests/latest');
  },

  getHistory: async (): Promise<{ data: TestResult[] }> => {
    return axiosClient.get('/tests/history');
  },

  sendEmergencyEmail: async (data: { category: string; score: number }): Promise<{ message: string }> => {
    return axiosClient.post('/tests/emergency-email', data);
  }
};
