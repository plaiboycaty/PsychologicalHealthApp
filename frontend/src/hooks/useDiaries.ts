import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { diaryApi } from '../services/diaryApi';
import { DiaryEntry } from '../components/diary/DiaryCard';
import { useAuthStore } from '../store/auth.store';

export const useDiaries = () => {
  const { user } = useAuthStore();
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDiaries = useCallback(async () => {
    if (!user || user.id === 0) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await diaryApi.getMyDiaries();
      if (response && response.data) {
        setDiaries(response.data);
      }
    } catch (error) {
      console.warn('Failed to load diaries from API', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nhật ký lúc này.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addDiary = useCallback(async (entryData: {
    title: string;
    content: string;
    emotion_id: number;
    emotion_name: string;
    image_url: string | null;
  }) => {
    try {
      await diaryApi.addDiary({
        emotion_id: entryData.emotion_id,
        title: entryData.title,
        content: entryData.content,
        image_url: entryData.image_url,
      });
      await loadDiaries();
    } catch (error) {
      console.warn('Failed to add diary', error);
      Alert.alert('Lỗi', 'Không thể thêm nhật ký lúc này.');
      throw error;
    }
  }, [loadDiaries]);

  const editDiary = useCallback(async (id: number, entryData: {
    title: string;
    content: string;
    emotion_id: number;
    emotion_name: string;
    image_url: string | null;
  }) => {
    try {
      await diaryApi.editDiary(id, {
        emotion_id: entryData.emotion_id,
        title: entryData.title,
        content: entryData.content,
        image_url: entryData.image_url,
      });
      await loadDiaries();
    } catch (error) {
      console.warn('Failed to edit diary', error);
      Alert.alert('Lỗi', 'Không thể cập nhật nhật ký lúc này.');
      throw error;
    }
  }, [loadDiaries]);

  const removeDiary = useCallback(async (id: number) => {
    try {
      await diaryApi.removeDiary(id);
      await loadDiaries();
    } catch (error) {
      console.warn('Failed to delete diary', error);
      Alert.alert('Lỗi', 'Không thể xoá nhật ký lúc này.');
      throw error;
    }
  }, [loadDiaries]);

  return {
    diaries,
    loading,
    loadDiaries,
    addDiary,
    editDiary,
    removeDiary,
  };
};
