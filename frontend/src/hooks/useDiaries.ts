import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { diaryApi } from '../services/diaryApi';
import { DiaryEntry } from '../components/diary/DiaryCard';

export const useDiaries = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy toàn bộ danh sách nhật ký
  const loadDiaries = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await diaryApi.getMyDiaries();
      if (response && response.data) {
        setDiaries(response.data);
      }
    } catch (error) {
      console.warn('Failed to load diaries from API', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nhật ký lúc này.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Thêm mới nhật ký
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
      await loadDiaries(); // Tải lại danh sách sau khi thêm
    } catch (error) {
      console.warn('Failed to add diary', error);
      Alert.alert('Lỗi', 'Không thể thêm nhật ký lúc này.');
      throw error;
    }
  }, [loadDiaries]);

  // Cập nhật nhật ký
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
      await loadDiaries(); // Tải lại danh sách sau khi sửa
    } catch (error) {
      console.warn('Failed to edit diary', error);
      Alert.alert('Lỗi', 'Không thể cập nhật nhật ký lúc này.');
      throw error;
    }
  }, [loadDiaries]);

  // Xoá nhật ký
  const removeDiary = useCallback(async (id: number) => {
    try {
      await diaryApi.removeDiary(id);
      await loadDiaries(); // Tải lại danh sách sau khi xoá
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
