import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { diaryApi } from '../services/diaryApi';

export const useHome = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [diaries, setDiaries] = useState<any[]>([]);

  // Đọc danh sách nhật ký từ API mỗi khi HomeScreen được focus
  const loadDiaries = useCallback(async () => {
    try {
      const response: any = await diaryApi.getMyDiaries();
      if (response && response.data) {
        setDiaries(response.data);
      }
    } catch (e) {
      console.warn('Failed to load diaries in HomeScreen', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDiaries();
    }, [loadDiaries])
  );

  const handleSelectEmotion = useCallback((emotion: any) => {
    setSelectedEmotion(emotion);
    setModalVisible(true);
  }, []);

  const handleSubmitDiary = useCallback(async (reason: string) => {
    if (!selectedEmotion) return;

    try {
      // Gọi API lưu nhật ký
      const response: any = await diaryApi.addDiary({
        emotion_id: selectedEmotion.id,
        title: 'Nhật ký nhanh',
        content: reason,
        image_url: null,
      });

      // Tạo entry tạm thời để update UI ngay lập tức mà không cần fetch lại
      const newEntry = {
        id: response.diary_id || Date.now(),
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
