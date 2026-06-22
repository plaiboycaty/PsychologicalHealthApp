import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOCK_EMOTIONS } from '../../constants/mock-data';

const MINT_COLOR = '#4ABEB2';

import { Diary } from '../../types/models';

export type DiaryEntry = Diary;

interface DiaryCardProps {
  item: DiaryEntry;
  onPress: (item: DiaryEntry) => void;
}

function formatTime(isoString: string): string {
  if (!isoString) return '';
  let date: Date;
  if (isoString.includes('T') && !isoString.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(isoString)) {
    date = new Date(isoString.replace('T', ' '));
  } else {
    date = new Date(isoString);
  }
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function DiaryCard({ item, onPress }: DiaryCardProps) {
  const emotion = MOCK_EMOTIONS.find(e => e.id === item.emotion_id);
  const emotionColor = emotion?.color ?? '#BDBDBD';
  const emotionIcon = emotion?.icon;

  const renderEmotionIcon = (isMini = false) => {
    if (!emotionIcon) {
      return <Text style={isMini ? styles.emotionIconMini : styles.emotionIcon}>😐</Text>;
    }
    if (typeof emotionIcon === 'string') {
      return <Text style={isMini ? styles.emotionIconMini : styles.emotionIcon}>{emotionIcon}</Text>;
    }
    return (
      <Image
        source={emotionIcon}
        style={isMini ? styles.emotionImageMini : styles.emotionImage}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      {/* Dải màu cảm xúc bên trái */}
      <View style={[styles.emotionBar, { backgroundColor: emotionColor }]} />

      {/* Phần thời gian + icon cảm xúc */}
      <View style={styles.leftCol}>
        <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
        {renderEmotionIcon(false)}
      </View>

      {/* Nội dung nhật ký */}
      <View style={styles.contentCol}>
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.bodyText} numberOfLines={2}>{item.content}</Text>

        {/* Ảnh thumbnail nếu có */}
        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.thumbnail} />
        )}

        {/* Tag cảm xúc */}
        <View style={[styles.emotionTag, { borderColor: emotionColor, flexDirection: 'row', alignItems: 'center' }]}>
          {renderEmotionIcon(true)}
          <Text style={[styles.emotionTagText, { color: emotionColor }]}>
            {item.emotion_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    // Shadow iOS
    shadowColor: '#B0A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Shadow Android
    elevation: 3,
  },
  emotionBar: {
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  leftCol: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontFamily: 'Baloo2_400Regular',
    marginBottom: 4,
  },
  emotionIcon: {
    fontSize: 26,
  },
  emotionIconMini: {
    fontSize: 12,
    marginRight: 4,
  },
  emotionImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  emotionImageMini: {
    width: 14,
    height: 14,
    marginRight: 4,
    resizeMode: 'contain',
  },
  contentCol: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16, // Đổi từ 36 thành 16 vì không cần không gian cho nút 3 chấm nữa
  },
  titleText: {
    fontSize: 15,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_700Bold',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Baloo2_400Regular',
    lineHeight: 19,
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  emotionTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  emotionTagText: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
  },
});
