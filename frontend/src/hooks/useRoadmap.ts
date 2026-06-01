import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { treatmentApi, RoadmapResponse } from '../services/treatmentApi';
import { useAuthStore } from '../store/auth.store';

export const useRoadmap = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [status, setStatus] = useState<RoadmapResponse['status'] | 'loading'>('loading');
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [daysElapsed, setDaysElapsed] = useState<number>(0);
  const [category, setCategory] = useState<string>('');

  const [selectedWeek, setSelectedWeek] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadData = useCallback(async () => {
    if (!user || user.id === 0) return;
    try {
      setStatus('loading');
      const res = await treatmentApi.getMyRoadmap();
      setStatus(res.status);
      setCategory(res.category || '');
      if (res.data) setRoadmapData(res.data);
      if (res.completed_tasks) setCompletedTasks(res.completed_tasks);
      if (res.days_elapsed !== undefined) setDaysElapsed(res.days_elapsed);
    } catch (e) {
      console.warn('Failed to load roadmap:', e);
      setStatus('missing_data');
    }
  }, [user]);

  // Tải lại dữ liệu mỗi khi Tab Lộ trình được focus (để cập nhật kết quả sau khi Test xong)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleToggleTask = useCallback(async (weekId: number, taskId: string) => {
    // 1. Optimistic UI update (Cập nhật giao diện trước cho nhanh)
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) return prev.filter(id => id !== taskId);
      return [...prev, taskId];
    });

    // 2. Gọi API ngầm
    try {
      const res = await treatmentApi.toggleTask(taskId);
      if (res.is_finished_all) {
        Alert.alert('Chúc mừng!', 'Bạn đã hoàn thành xuất sắc toàn bộ Lộ trình 4 tuần. Hãy làm bài đánh giá lại để xem sự tiến bộ nhé!');
        loadData(); // Tải lại để chuyển trạng thái sang roadmap_completed_need_test
        setModalVisible(false);
      }
    } catch (e: any) {
      // 3. Rollback nếu lỗi
      Alert.alert('Lỗi', e.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại!');
      loadData(); // Lấy lại trạng thái chuẩn từ server
    }
  }, [loadData]);

  const handleOpenWeek = useCallback((week: any) => {
    setSelectedWeek(week);
    setModalVisible(true);
  }, []);

  const handleGoToTest = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Tests' });
  }, [navigation]);

  const handleEmergencyEmail = useCallback(async () => {
    setIsSending(true);
    try {
      await treatmentApi.sendEmergencyEmail();
      Alert.alert('Thành công', 'Đã gửi yêu cầu hỗ trợ khẩn cấp tới Bác sĩ!');
    } catch (e: any) {
      Alert.alert('Lỗi', e.response?.data?.message || 'Không thể gửi email lúc này.');
    } finally {
      setIsSending(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    status,
    roadmapData,
    completedTasks,
    daysElapsed,
    category,
    selectedWeek,
    modalVisible,
    isSending,
    handleToggleTask,
    handleOpenWeek,
    handleGoToTest,
    handleEmergencyEmail,
    closeModal,
  };
};
