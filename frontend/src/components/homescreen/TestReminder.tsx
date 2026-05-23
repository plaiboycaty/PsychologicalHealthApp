import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { testApi } from '../../services/testApi';

const mintColor = '#4ABEB2';

export default function TestReminder() {
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [hasTested, setHasTested] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const fetchLatestTest = async () => {
        try {
          const response: any = await testApi.getLatestTest();
          if (response && response.data) {
            const testDate = new Date(response.data.created_at);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - testDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            setDaysSince(diffDays);
            setHasTested(true);
          } else {
            setHasTested(false);
          }
        } catch (error) {
          console.warn('Failed to fetch latest test date', error);
        }
      };

      fetchLatestTest();
    }, [])
  );

  return (
    <View style={styles.reminderSection}>
      <View style={styles.reminderIconWrapper}>
        <Feather name="calendar" size={26} color="#E67E22" />
      </View>
      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>Nhắc nhở đánh giá !!!</Text>
        <Text style={styles.reminderText}>
          {!hasTested
            ? "Bạn chưa làm bài đánh giá tâm lý nào. Làm ngay để hệ thống hiểu bạn hơn!"
            : daysSince === 0
              ? "Bạn vừa làm bài đánh giá hôm nay. Theo dõi cảm xúc thường xuyên nhé!"
              : `Đã ${daysSince} ngày kể từ lần đánh giá cuối. Làm bài test để theo dõi tiến trình!`
          }
        </Text>
        <TouchableOpacity>
          <Text style={styles.reminderLink}>Làm ngay {'->'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  reminderIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#FEF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    color: '#000',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
    fontFamily: 'Baloo2_500Medium',
  },
  reminderLink: {
    color: mintColor,
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
  },
});
