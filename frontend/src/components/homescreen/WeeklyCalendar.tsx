import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DiaryEntry } from '../../components/diary/DiaryCard';
import { MOCK_EMOTIONS } from '../../constants/mock-data';

interface WeeklyCalendarProps {
  diaries: DiaryEntry[];
}

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function WeeklyCalendar({ diaries }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { weekDates, monthTitle } = useMemo(() => {
    const currentDay = currentDate.getDay();
    const diffToMonday = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), diffToMonday + i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isFuture = date.getTime() > new Date().getTime() && !isToday;

      const dateStr = toLocalDateStr(date);
      const entryForDate = diaries.find(d => d.created_at.startsWith(dateStr));
      const matchedEmotion = entryForDate ? MOCK_EMOTIONS.find(e => e.id === entryForDate.emotion_id) : null;

      week.push({
        dateNum: date.getDate(),
        isToday,
        isFuture,
        // Sử dụng icon cảm xúc thật từ nhật ký
        realEmotion: matchedEmotion ? matchedEmotion.icon : null
      });
    }

    const monthEng = currentDate.toLocaleString('en-US', { month: 'long' });
    const monthVN = currentDate.getMonth() + 1;

    return {
      weekDates: week,
      monthTitle: `${monthEng} - Tháng ${monthVN}`
    };
  }, [currentDate, diaries]);

  const handlePrevWeek = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
  };

  return (
    <View style={styles.calendarSection}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>{monthTitle}</Text>
        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={handlePrevWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="chevron-left" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 20 }}>
            <Feather name="chevron-right" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekDays}>
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
          <Text key={idx} style={styles.dayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.datesRow}>
        {weekDates.map((dayObj, idx) => (
          <View key={idx} style={styles.dateCol}>
            <View style={[styles.dateCircle, dayObj.isToday && styles.activeDateCircle]}>
              <Text style={styles.dateNumText}>{dayObj.dateNum}</Text>
            </View>

            {dayObj.isFuture ? (
              <View style={styles.emptyIconCircle} />
            ) : (
              dayObj.realEmotion ? (
                <Image source={dayObj.realEmotion} style={styles.historyIcon} />
              ) : (
                <View style={styles.emptyIconCircle} />
              )
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    color: '#333',
  },
  calendarNav: {
    flexDirection: 'row',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    color: '#000',
    width: 30,
    textAlign: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateCol: {
    alignItems: 'center',
    width: 30,
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activeDateCircle: {
    backgroundColor: '#E5E5E5',
  },
  dateNumText: {
    fontSize: 14,
    fontFamily: 'Baloo2_500Medium',
    color: '#333',
  },
  historyIcon: {
    width: 24,
    height: 24,
  },
  emptyIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
});
