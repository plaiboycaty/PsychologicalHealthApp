import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuestionHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onCancel: () => void;
}

const mintColor = '#4ABEB2';

export default function QuestionHeader({
  currentIndex,
  totalQuestions,
  onPrev,
  onCancel,
}: QuestionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={onPrev} style={styles.btnHeaderLeft}>
            <Ionicons name="chevron-back" size={16} color={mintColor} />
            <Text style={styles.headerActionText}>Câu trước</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerCenter}>
        <Text style={styles.progressText}>
          {currentIndex + 1}/{totalQuestions}
        </Text>
      </View>

      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.headerActionText, { textTransform: 'uppercase' }]}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerSide: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  btnHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionText: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: mintColor,
  },
  progressText: {
    fontSize: 20,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
  },
});
