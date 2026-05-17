import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeekData } from '../../constants/roadmap-mock';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;
const MINT_COLOR = '#4ABEB2';

interface WeekCardProps {
  week: WeekData;
  completedTasks: string[];
  onPress: (week: WeekData) => void;
}

export default function WeekCard({ week, completedTasks, onPress }: WeekCardProps) {
  const isLocked = week.status === 'locked';
  const totalTasks = week.tasks.length;
  const doneTasks = week.tasks.filter(t => completedTasks.includes(t.taskId)).length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const isEven = week.week_number % 2 === 0;

  return (
    <TouchableOpacity
      activeOpacity={isLocked ? 1 : 0.75}
      onPress={() => !isLocked && onPress(week)}
      style={[
        styles.card,
        isLocked ? styles.cardLocked : styles.cardUnlocked,
        isEven ? styles.alignRight : styles.alignLeft,
      ]}
    >
      {/* Row: Icon + Tiêu đề */}
      <View style={styles.rowTop}>
        {/* Icon nhỏ gọn */}
        <View style={[styles.iconCircle, isLocked ? styles.iconCircleLocked : styles.iconCircleUnlocked]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={16} color="#BDBDBD" />
          ) : week.status === 'completed' ? (
            <Ionicons name="checkmark" size={18} color="#FFF" />
          ) : (
            <Text style={styles.weekNumberText}>{week.week_number}</Text>
          )}
        </View>

        {/* Tên tuần + Tiêu đề */}
        <View style={styles.titleBlock}>
          <Text style={[styles.weekLabel, isLocked && styles.textLocked]}>Tuần {week.week_number}</Text>
          <Text style={[styles.weekTitle, isLocked && styles.textLocked]} numberOfLines={2}>
            {week.title}
          </Text>
        </View>
      </View>

      {/* Progress Bar (chỉ hiện khi unlocked) */}
      {!isLocked && (
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, progress === 100 && styles.progressLabelDone]}>
            {progress === 100 ? 'Hoàn thành' : `${doneTasks}/${totalTasks} nhiệm vụ`}
          </Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
      )}
      {!isLocked && (
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      )}

      {isLocked && (
        <Text style={styles.lockedHint}>🔒 Chưa mở khóa</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardUnlocked: {
    borderColor: MINT_COLOR,
  },
  cardLocked: {
    borderColor: '#E0E0E0',
  },
  alignLeft: {
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  alignRight: {
    alignSelf: 'flex-end',
    marginRight: 24,
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  iconCircleUnlocked: {
    backgroundColor: MINT_COLOR,
  },
  iconCircleLocked: {
    backgroundColor: '#F0F0F0',
  },
  weekNumberText: {
    fontSize: 15,
    color: '#FFF',
    fontFamily: 'Baloo2_700Bold',
  },

  titleBlock: {
    flex: 1,
  },
  weekLabel: {
    fontSize: 11,
    color: MINT_COLOR,
    fontFamily: 'Baloo2_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  weekTitle: {
    fontSize: 14,
    color: '#1A1A2E',
    fontFamily: 'Baloo2_700Bold',
    marginTop: 1,
    lineHeight: 18,
  },
  textLocked: {
    color: '#BDBDBD',
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Baloo2_400Regular',
  },
  progressLabelDone: {
    color: MINT_COLOR,
  },
  progressPercent: {
    fontSize: 11,
    color: MINT_COLOR,
    fontFamily: 'Baloo2_700Bold',
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#EEF8F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MINT_COLOR,
    borderRadius: 3,
  },

  lockedHint: {
    fontSize: 11,
    color: '#C0C0C0',
    fontFamily: 'Baloo2_400Regular',
  },
});
