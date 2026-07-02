import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TaskRow from './TaskRow';
import { WeekData } from '../../constants/roadmap-mock';

const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.88;
const BLUE_COLOR = '#39BFFF';

interface TaskModalProps {
  visible: boolean;
  week: WeekData | null;
  completedTasks: string[];
  onClose: () => void;
  onToggleTask: (weekId: number, taskId: string) => void;
}

export default function TaskModal({
  visible,
  week,
  completedTasks,
  onClose,
  onToggleTask,
}: TaskModalProps) {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.88);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!week) return null;

  const totalTasks = week.tasks.length;
  const doneTasks = week.tasks.filter(t => completedTasks.includes(t.taskId)).length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleTaskPress = (taskId: string, title: string) => {
    const isDone = completedTasks.includes(taskId);
    if (!isDone) {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('thở') || lowerTitle.includes('âm thanh') || lowerTitle.includes('4-7-8') || lowerTitle.includes('nhạc') || lowerTitle.includes('432hz') || lowerTitle.includes('tần số')) {
        Alert.alert(
          'Thực hành Nhiệm vụ',
          'Bạn có muốn đi đến Góc Thư Giãn để nghe nhạc và tập thở không?',
          [
            { text: 'Bỏ qua', onPress: () => onToggleTask(week.id, taskId), style: 'cancel' },
            { 
              text: 'Đi tới Thư giãn', 
              onPress: () => {
                onToggleTask(week.id, taskId);
                onClose();
                navigation.navigate('MainTabs', { screen: 'Profile' }); 
                setTimeout(() => navigation.navigate('Relax'), 100);
              }
            }
          ]
        );
        return;
      }

      if (lowerTitle.includes('nhật ký') || lowerTitle.includes('biết ơn') || lowerTitle.includes('ghi ra')) {
        Alert.alert(
          'Thực hành Nhiệm vụ',
          'Bạn có muốn đi tới chức năng Nhật ký để viết ngay bây giờ không?',
          [
            { text: 'Bỏ qua', onPress: () => onToggleTask(week.id, taskId), style: 'cancel' },
            { 
              text: 'Viết nhật ký', 
              onPress: () => {
                onToggleTask(week.id, taskId);
                onClose();
                navigation.navigate('MainTabs', { screen: 'Diaries' });
              }
            }
          ]
        );
        return;
      }

      if (lowerTitle.includes('zung') || lowerTitle.includes('đánh giá')) {
        Alert.alert(
          'Thực hành Nhiệm vụ',
          'Bạn có muốn làm bài đánh giá ngay bây giờ không?',
          [
            { text: 'Bỏ qua', onPress: () => onToggleTask(week.id, taskId), style: 'cancel' },
            { 
              text: 'Làm bài Test', 
              onPress: () => {
                onToggleTask(week.id, taskId);
                onClose();
                navigation.navigate('MainTabs', { screen: 'Tests' });
              }
            }
          ]
        );
        return;
      }
    }
    
    // Tích bình thường
    onToggleTask(week.id, taskId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay tối */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal nằm giữa màn hình */}
      <View style={styles.centered} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={{ backgroundColor: BLUE_COLOR, paddingBottom: 10 }}>
            {/* ---- Header Xanh ---- */}
            <View style={styles.header}>
              <View style={styles.headerTextBlock}>
                <Text style={styles.headerWeekLabel}>Tuần {week.week_number}</Text>
                <Text style={styles.headerTitle} numberOfLines={1}>{week.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            {/* ---- Progress Row ---- */}
            <View style={styles.progressSection}>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Tiến độ hoàn thành</Text>
                <Text style={styles.progressValue}>{progress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
            </View>
          </View>

          {/* ---- Danh sách Task ---- */}
          <ScrollView
            style={styles.taskList}
            contentContainerStyle={styles.taskListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.progressValue}>NHIỆM VỤ {doneTasks}/{totalTasks}</Text>
            {week.tasks.map(task => (
              <TaskRow
                key={task.taskId}
                task={task}
                isCompleted={completedTasks.includes(task.taskId)}
                onToggle={() => handleTaskPress(task.taskId, task.taskTitle)}
              />
            ))}
            <View style={{ height: 8 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    maxHeight: height * 0.72,
    backgroundColor: '#FFF',
    borderRadius: 22,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },

  // ----- Header -----
  header: {
    backgroundColor: BLUE_COLOR,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextBlock: {
    flex: 1,
    marginRight: 10,
  },
  headerWeekLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Baloo2_700Bold',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 17,
    color: '#FFF',
    fontFamily: 'Baloo2_700Bold',
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 5,
  },

  // ----- Progress -----
  progressSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Baloo2_400Regular',
  },
  progressValue: {
    fontSize: 15,
    color: BLUE_COLOR,
    fontFamily: 'Baloo2_700Bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#EEF8F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BLUE_COLOR,
    borderRadius: 3,
  },

  // ----- Task List -----
  taskList: {
    maxHeight: height * 0.45,
  },
  taskListContent: {
    padding: 14,
  },
});
