import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const mintColor = '#4ABEB2';

import { MOCK_EMOTIONS } from '../../constants/mock-data';

export const EMOTIONS = MOCK_EMOTIONS;

interface EmotionTrackerProps {
  onSelectEmotion: (emotion: any) => void;
}

export default function EmotionTracker({ onSelectEmotion }: EmotionTrackerProps) {
  return (
    <View style={styles.emotionSection}>
      <Text style={styles.sectionTitle}>Hôm nay bạn cảm thấy thế nào ?</Text>
      <View style={styles.emotionGrid}>
        {EMOTIONS.map((emo) => (
          <TouchableOpacity
            key={emo.id}
            style={styles.emotionItem}
            onPress={() => onSelectEmotion(emo)}
          >
            <Image source={emo.icon} style={styles.emotionIcon} resizeMode="contain" />
            <Text style={styles.emotionText}>{emo.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emotionSection: {
    backgroundColor: mintColor,
    borderRadius: 24,
    padding: 15,
    paddingTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  emotionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 12,
  },
  emotionIcon: {
    width: 65,
    height: 65,
    marginBottom: 5,
  },
  emotionText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Baloo2_500Medium',
  },
});
