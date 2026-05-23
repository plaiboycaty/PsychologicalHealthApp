import axiosClient from '../api/axiosClient';

export const diaryApi = {
  getEmotions: async () => {
    return axiosClient.get('/emotions');
  },

  getMyDiaries: async () => {
    return axiosClient.get('/diaries');
  },

  addDiary: async (data: { emotion_id: number; title: string; content: string; image_url?: string | null }) => {
    return axiosClient.post('/diaries', data);
  },

  editDiary: async (id: number, data: { emotion_id: number; title: string; content: string; image_url?: string | null }) => {
    return axiosClient.put(`/diaries/${id}`, data);
  },

  removeDiary: async (id: number) => {
    return axiosClient.delete(`/diaries/${id}`);
  }
};
