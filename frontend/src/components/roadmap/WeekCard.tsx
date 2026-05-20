import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeekData } from '../../constants/roadmap-mock';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;
const ACTIVE_BLUE = '#39BFFF';
const LOCKED_GRAY = '#C4C4C4';

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
      activeOpacity={isLocked ? 1 : 0.8}
      onPress={() => !isLocked && onPress(week)}
      style={[
        styles.card,
        isLocked ? styles.cardLocked : styles.cardUnlocked,
        isEven ? styles.alignRight : styles.alignLeft,
      ]}
    >
      <View style={styles.rowTop}>
        <View style={[styles.iconCircle, isLocked ? styles.iconCircleLocked : styles.iconCircleUnlocked]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={18} color="#999" />
          ) : week.status === 'completed' ? (
            <Ionicons name="checkmark" size={20} color="#FFF" />
          ) : (
            <Text style={styles.weekNumberText}>{week.week_number}</Text>
          )}
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.weekLabel, isLocked && styles.textLocked]}>Tuần {week.week_number}</Text>
          <Text style={[styles.weekTitle, isLocked && styles.textLocked]} numberOfLines={2}>
            {week.title}
          </Text>
        </View>
      </View>

      {!isLocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, progress === 100 && styles.progressLabelDone]}>
              {progress === 100 ? 'Hoàn thành' : `${doneTasks}/${totalTasks} nhiệm vụ`}
            </Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      {isLocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.lockedHint}>Hoàn thành</Text>
            <Text style={styles.lockedHint}>0%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={{ width: '0%' }} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 5,
    padding: 14,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardUnlocked: {
    borderColor: ACTIVE_BLUE,
  },
  cardLocked: {
    borderColor: LOCKED_GRAY,
  },
  alignLeft: {
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  alignRight: {
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  iconCircleUnlocked: {
    backgroundColor: ACTIVE_BLUE,
  },
  iconCircleLocked: {
    backgroundColor: '#F0F0F0',
  },
  weekNumberText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Baloo2_700Bold'
  },
  titleBlock: {
    flex: 1,
  },
  weekLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    fontFamily: 'Baloo2_400Regular'
  },
  weekTitle: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Baloo2_700Bold',
    marginTop: 2,
    lineHeight: 20,
  },
  textLocked: {
    color: '#999',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    fontFamily: 'Baloo2_700Bold'
  },
  progressLabelDone: {
    color: ACTIVE_BLUE,
    fontFamily: 'Baloo2_700Bold'
  },
  progressPercent: {
    fontSize: 12,
    color: ACTIVE_BLUE,
    fontFamily: 'Baloo2_700Bold'
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ACTIVE_BLUE,
    borderRadius: 3,
  },
  lockedHint: {
    fontSize: 12,
    color: '#C4C4C4',
  },
});