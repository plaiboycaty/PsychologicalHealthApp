import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WeekCard from '../../components/roadmap/WeekCard';
import TaskModal from '../../components/roadmap/TaskModal';
import { MOCK_ROADMAP_DATA, WeekData } from '../../constants/roadmap-mock';

const MINT_COLOR = '#4ABEB2';
const STORAGE_KEY = '@roadmap_completed_tasks';

export default function Roadmap52HzScreen() {
  const [roadmapData] = useState<WeekData[]>(MOCK_ROADMAP_DATA);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ---- Đọc tiến độ từ AsyncStorage khi màn hình mở ----
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCompletedTasks(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load roadmap progress', e);
      }
    };
    loadProgress();
  }, []);

  // ---- Lưu tiến độ xuống AsyncStorage mỗi khi completedTasks thay đổi ----
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

  // ---- Toggle tick/untick nhiệm vụ ----
  const handleToggleTask = useCallback((weekId: number, taskId: string) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  }, []);

  // ---- Tính số tuần đã hoàn thành (progress) ----
  const completedWeeksCount = roadmapData.filter(week => {
    const doneTasks = week.tasks.filter(t => completedTasks.includes(t.taskId)).length;
    return doneTasks === week.tasks.length && week.tasks.length > 0;
  }).length;

  const handleOpenWeek = (week: WeekData) => {
    setSelectedWeek(week);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
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
          {roadmapData.map((week, index) => (
            <React.Fragment key={week.id}>
              <WeekCard
                week={week}
                completedTasks={completedTasks}
                onPress={handleOpenWeek}
              />

              {/* Đường kết nối giữa các thẻ */}
              {index < roadmapData.length - 1 && (
                <View style={[
                  styles.connector,
                  week.week_number % 2 !== 0
                    ? styles.connectorRight  // Tuần lẻ → đường gạch chuyển sang phải
                    : styles.connectorLeft,  // Tuần chẵn → đường gạch chuyển về trái
                ]}>
                  <View style={styles.connectorDot} />
                  <View style={styles.connectorLine} />
                  <View style={styles.connectorDot} />
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Khoảng trống an toàn dưới đáy */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ---- Modal Nhiệm vụ ---- */}
      <TaskModal
        visible={modalVisible}
        week={selectedWeek}
        completedTasks={completedTasks}
        onClose={() => setModalVisible(false)}
        onToggleTask={handleToggleTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingTop: 10,
  },

  // ----- Header -----
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    color: '#1A1A2E',
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Baloo2_400Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBadge: {
    flexDirection: 'row',
    backgroundColor: '#EEF8F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  progressBadgeLabel: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
  },
  progressBadgeValue: {
    fontSize: 14,
    color: MINT_COLOR,
    fontFamily: 'Baloo2_700Bold',
  },

  // ----- Roadmap -----
  roadmapContainer: {
    paddingVertical: 8,
  },

  // ----- Connector -----
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -4,
    marginBottom: 10,
  },
  connectorRight: {
    justifyContent: 'flex-end',
    paddingRight: 52,
  },
  connectorLeft: {
    justifyContent: 'flex-start',
    paddingLeft: 52,
  },
  connectorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MINT_COLOR,
    opacity: 0.5,
  },
  connectorLine: {
    width: 30,
    height: 2,
    backgroundColor: MINT_COLOR,
    opacity: 0.3,
    marginHorizontal: 3,
  },
});
