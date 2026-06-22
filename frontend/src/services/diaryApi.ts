import axiosClient from '../api/axiosClient';
import { Diary, Emotion } from '../types/models';

export const diaryApi = {
  getEmotions: async (): Promise<{ data: Emotion[] }> => {
    return axiosClient.get('/emotions');
  },

  getMyDiaries: async (): Promise<{ data: Diary[] }> => {
    return axiosClient.get('/diaries');
  },

  addDiary: async (data: { emotion_id: number; title: string; content: string; image_url?: string | null }): Promise<{ message: string; data: Diary }> => {
    return axiosClient.post('/diaries', data);
  },

  editDiary: async (id: number, data: { emotion_id: number; title: string; content: string; image_url?: string | null }): Promise<{ message: string; data: Diary }> => {
    return axiosClient.put(`/diaries/${id}`, data);
  },

  removeDiary: async (id: number): Promise<{ message: string }> => {
    return axiosClient.delete(`/diaries/${id}`);
  }
};
