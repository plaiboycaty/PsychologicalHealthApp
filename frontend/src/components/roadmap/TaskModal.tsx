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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskRow from './TaskRow';
import { WeekData } from '../../constants/roadmap-mock';

const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.88;
const MINT_COLOR = '#39BFFF';

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
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
          <View style={{ backgroundColor: MINT_COLOR, paddingBottom: 10 }}>
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
                onToggle={() => onToggleTask(week.id, task.taskId)}
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
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    backgroundColor: MINT_COLOR,
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
    color: MINT_COLOR,
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
    backgroundColor: MINT_COLOR,
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
