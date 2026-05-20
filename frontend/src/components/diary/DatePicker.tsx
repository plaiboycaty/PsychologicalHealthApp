import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MINT_COLOR = '#4ABEB2';

// 1. Nhận baseDate để tạo ra 7 ngày của tuần CHỨA ngày đó (không fix cứng ngày hôm nay nữa)
function generateWeekDays(baseDate: Date): { date: Date; dayLabel: string; dateLabel: string }[] {
  const days: { date: Date; dayLabel: string; dateLabel: string }[] = [];
  const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const current = new Date(baseDate);
  const dayOfWeek = current.getDay(); // 0 = CN
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  // Lùi về ngày Thứ 2 của tuần đó
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

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

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

interface DatePickerProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (dateStr: string) => void;
  onOpenCalendar?: () => void;
}

export default function DatePicker({ selectedDate, onSelectDate, onOpenCalendar }: DatePickerProps) {
  // Lấy ngày đang chọn làm mốc để vẽ tuần
  const currentDate = new Date(selectedDate);
  const days = generateWeekDays(currentDate);
  const todayStr = toDateStr(new Date());

  // Hàm lùi 1 tuần (Trừ đi 7 ngày so với ngày đang chọn)
  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    onSelectDate(toDateStr(prev));
  };

  // Hàm tiến 1 tuần
  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    onSelectDate(toDateStr(next));
  };

  // UI Nút mở bộ lọc lịch (Đặt ở đầu danh sách ngày)
  const renderFilterButton = () => (
    <TouchableOpacity style={styles.calendarBtn} onPress={onOpenCalendar} activeOpacity={0.7}>
      <Feather name="calendar" size={20} color="#888888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* ---- Thanh điều hướng Tháng / Tuần ---- */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={handlePrevWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="chevron-left" size={24} color="#B5977A" />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>
          {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </Text>

        <TouchableOpacity onPress={handleNextWeek} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="chevron-right" size={24} color="#B5977A" />
        </TouchableOpacity>
      </View>

      {/* ---- Danh sách ngày ---- */}
      <FlatList
        horizontal
        data={days}
        keyExtractor={item => toDateStr(item.date)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderFilterButton} // Nhét nút Lịch vào đầu
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },

  // --- Navigation Row (Tháng/Năm) ---
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 15,
    color: '#B5977A',
    fontFamily: 'Baloo2_700Bold',
    textTransform: 'capitalize',
  },

  // --- Scrollable Days ---
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: 'center', // Giúp nút Lịch và các ngày thẳng hàng với nhau
  },
  calendarBtn: {
    width: 46,
    height: 64,
    borderRadius: 23,
    backgroundColor: '#F0EBE6', // Màu nền nhẹ cho nút lịch
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    // Shadow nổi bật hơn khi chọn
    shadowColor: MINT_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
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