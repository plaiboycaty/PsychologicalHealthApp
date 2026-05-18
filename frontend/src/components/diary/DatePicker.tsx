import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const MINT_COLOR = '#4ABEB2';

// Tạo danh sách 7 ngày trong tuần hiện tại
function generateWeekDays(): { date: Date; dayLabel: string; dateLabel: string }[] {
  const today = new Date();
  const days: { date: Date; dayLabel: string; dateLabel: string }[] = [];
  const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Lấy thứ Hai của tuần hiện tại
  const monday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = CN
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + diffToMonday);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      date: d,
      dayLabel: DAY_NAMES[d.getDay()],
      dateLabel: d.getDate().toString(),
    });
  }
  return days;
}

interface DatePickerProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (dateStr: string) => void;
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const days = generateWeekDays();
  const todayStr = toDateStr(new Date());

  return (
    <FlatList
      horizontal
      data={days}
      keyExtractor={item => toDateStr(item.date)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const dateStr = toDateStr(item.date);
        const isSelected = dateStr === selectedDate;
        const isToday = dateStr === todayStr;

        return (
          <TouchableOpacity
            onPress={() => onSelectDate(dateStr)}
            style={[styles.dayChip, isSelected && styles.dayChipSelected]}
            activeOpacity={0.75}
          >
            <Text style={[styles.dayLabel, isSelected && styles.textSelected]}>
              {item.dayLabel}
            </Text>
            <Text style={[styles.dateLabel, isSelected && styles.textSelected, isToday && !isSelected && styles.todayDate]}>
              {item.dateLabel}
            </Text>
            {isToday && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  dayChip: {
    width: 46,
    height: 64,
    borderRadius: 23,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    // Shadow
    shadowColor: '#B0A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dayChipSelected: {
    backgroundColor: MINT_COLOR,
  },
  dayLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    fontFamily: 'Baloo2_700Bold',
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 16,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_700Bold',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  todayDate: {
    color: MINT_COLOR,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: MINT_COLOR,
    marginTop: 3,
  },
});
