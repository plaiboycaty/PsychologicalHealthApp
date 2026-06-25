import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { diaryApi } from '../services/diaryApi';
import { Emotion } from '../types/models';

import { useAuthStore } from '../store/auth.store';

export const useHome = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [diaries, setDiaries] = useState<any[]>([]);
  const { user } = useAuthStore();

  const loadDiaries = useCallback(async () => {
    if (!user || user.id === 0) return;
    try {
      const response = await diaryApi.getMyDiaries();
      if (response && response.data) {
        setDiaries(response.data);
      }
    } catch (e) {
      console.warn('Failed to load diaries in HomeScreen', e);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadDiaries();
    }, [loadDiaries])
  );

  const handleSelectEmotion = useCallback((emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setModalVisible(true);
  }, []);

  const handleSubmitDiary = useCallback(async (reason: string) => {
    if (!selectedEmotion) return;

    try {
      const response = await diaryApi.addDiary({
        emotion_id: selectedEmotion.id,
        title: 'Nhật ký nhanh',
        content: reason,
        image_url: null,
      });

      const newEntry = {
        id: response.data?.id || Date.now(),
        title: 'Nhật ký nhanh',
        content: reason,
        emotion_id: selectedEmotion.id,
        emotion_name: selectedEmotion.name,
        image_url: null,
        created_at: new Date().toISOString(),
      };

      setDiaries((prevDiaries) => [newEntry, ...prevDiaries]);

      Alert.alert('Thành công', 'Nhật ký của cậu đã được lưu lại nhé 🤍');
    } catch (e) {
      console.warn('Failed to save quick diary', e);
      Alert.alert('Lỗi', 'Không thể lưu nhật ký, cậu vui lòng thử lại.');
    }

    setModalVisible(false);
    setTimeout(() => {
      setSelectedEmotion(null);
    }, 500);
  }, [selectedEmotion]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedEmotion(null);
    }, 500);
  }, []);

  return {
    diaries,
    selectedEmotion,
    isModalVisible,
    handleSelectEmotion,
    handleSubmitDiary,
    closeModal,
  };
};
