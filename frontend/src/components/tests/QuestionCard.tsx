import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QuestionCardProps {
  content: string;
}

export default function QuestionCard({ content }: QuestionCardProps) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  questionText: {
    fontSize: 17,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
  },
});
