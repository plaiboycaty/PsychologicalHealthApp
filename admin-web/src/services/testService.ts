import apiClient from '../api/client';

export const testService = {
  // --- TEST METADATA ---
  getAllTests: async () => {
    return apiClient.get('/admin/tests');
  },
  
  createTest: async (data: { name: string; description?: string }) => {
    return apiClient.post('/admin/tests', data);
  },
  
  updateTest: async (id: number | string, data: { name: string; description?: string }) => {
    return apiClient.put(`/admin/tests/${id}`, data);
  },
  
  deleteTest: async (id: number | string) => {
    return apiClient.delete(`/admin/tests/${id}`);
  },

  // --- QUESTION DETAILS ---
  getQuestionsByTest: async (testId: number | string) => {
    return apiClient.get(`/admin/tests/${testId}/questions`);
  },
  
  createQuestion: async (data: { test_id: number | string; content: string; question_order: number; options: { content: string; score: number }[] }) => {
    return apiClient.post('/admin/questions', data);
  },
  
  updateQuestion: async (id: number | string, data: { content: string; question_order: number; options: { content: string; score: number }[] }) => {
    return apiClient.put(`/admin/questions/${id}`, data);
  },
  
  deleteQuestion: async (id: number | string) => {
    return apiClient.delete(`/admin/questions/${id}`);
  }
};
