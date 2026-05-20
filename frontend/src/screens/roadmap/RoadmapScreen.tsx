import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WeekCard from '../../components/roadmap/WeekCard';
import TaskModal from '../../components/roadmap/TaskModal';
import { MOCK_ROADMAP_DATA, WeekData } from '../../constants/roadmap-mock';

const ACTIVE_BLUE = '#39BFFF';
const STORAGE_KEY = '@roadmap_completed_tasks';

export default function Roadmap52HzScreen() {
  const [roadmapData] = useState<WeekData[]>(MOCK_ROADMAP_DATA);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setCompletedTasks(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to load roadmap progress', e);
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
      } catch (e) {
        console.warn('Failed to save roadmap progress', e);
      }
    };
    saveProgress();
  }, [completedTasks]);

  const handleToggleTask = useCallback((weekId: number, taskId: string) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) return prev.filter(id => id !== taskId);
      return [...prev, taskId];
    });
  }, []);

  const completedWeeksCount = roadmapData.filter(week => {
    const doneTasks = week.tasks.filter(t => completedTasks.includes(t.taskId)).length;
    return doneTasks === week.tasks.length && week.tasks.length > 0;
  }).length;

  const handleOpenWeek = (week: WeekData) => {
    setSelectedWeek(week);
    setModalVisible(true);
  };

  return (
    // Sử dụng ImageBackground cho toàn màn hình
    <ImageBackground
      source={require('../../../assets/images/background/roadmap_background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ---- Header ---- */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lộ trình 52Hz</Text>
            <Text style={styles.headerSubtitle}>Hành trình 4 tuần hỗ trợ sức khỏe tâm lý</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeLabel}>Tiến độ: </Text>
              <Text style={styles.progressBadgeValue}>Tuần {completedWeeksCount}/{roadmapData.length}</Text>
            </View>
          </View>

          {/* ---- Roadmap Zig-zag ---- */}
          <View style={styles.roadmapContainer}>
            {roadmapData.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                completedTasks={completedTasks}
                onPress={handleOpenWeek}
              />
            ))}
          </View>

          {/* Khoảng trống an toàn dưới đáy */}
          <View style={{ height: 120 }} />
        </ScrollView>

        <TaskModal
          visible={modalVisible}
          week={selectedWeek}
          completedTasks={completedTasks}
          onClose={() => setModalVisible(false)}
          onToggleTask={handleToggleTask}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    color: '#000', // Chữ đen nổi bật trên nền trời
    fontFamily: 'Baloo2_700Bold', // Đảm bảo bạn đã load font này
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Baloo2_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // Đổi sang nền trắng cho nổi bật
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBadgeLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Baloo2_700Bold',
  },
  progressBadgeValue: {
    fontSize: 14,
    color: ACTIVE_BLUE,
    fontFamily: 'Baloo2_700Bold',
  },
  roadmapContainer: {
    paddingVertical: 10,
  },
});