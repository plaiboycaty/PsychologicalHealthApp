import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../../constants/roadmap-mock';

const ACTIVE_BLUE = '#39BFFF';

interface TaskRowProps {
  task: TaskItem;
  isCompleted: boolean;
  onToggle: () => void;
}

export default function TaskRow({ task, isCompleted, onToggle }: TaskRowProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.containerCompleted]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
        {isCompleted && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </View>

      {/* Text Content */}
      <View style={styles.textBlock}>
        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
          {task.taskTitle}
        </Text>
        <Text style={styles.taskDesc} numberOfLines={2}>
          {task.taskDesc}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  containerCompleted: {
    backgroundColor: '#E3F7FF',
    borderColor: '#82D7FE',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  checkboxCompleted: {
    backgroundColor: ACTIVE_BLUE,
    borderColor: ACTIVE_BLUE,
  },
  textBlock: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    color: '#1A1A2E',
    fontFamily: 'Baloo2_700Bold',
    marginBottom: 2,
  },
  taskTitleCompleted: {
    color: ACTIVE_BLUE,
  },
  taskDesc: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Baloo2_400Regular',
    lineHeight: 18,
  },
});
