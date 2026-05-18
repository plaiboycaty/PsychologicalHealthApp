import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { MOCK_DIARIES } from '../../constants/mock-data';
import DiaryCard, { DiaryEntry } from '../../components/diary/DiaryCard';
import DatePicker from '../../components/diary/DatePicker';

const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FFF8F0';

// Lấy ngày hôm nay dạng 'YYYY-MM-DD'
function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Lấy ngày từ ISO string diary
function getEntryDate(isoStr: string): string {
  return isoStr.split('T')[0];
}

export default function DiaryScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));
  const [diaries, setDiaries] = useState<DiaryEntry[]>(MOCK_DIARIES);

  // Lọc nhật ký theo ngày đang chọn
  const filteredDiaries = diaries.filter(
    d => getEntryDate(d.created_at) === selectedDate
  );

  // Xử lý nhấn nút "..." trên card
  const handleMorePress = useCallback((id: number) => {
    Alert.alert('Tuỳ chọn', '', [
      {
        text: '✏️  Sửa nhật ký',
        onPress: () => console.log('Edit', id),
      },
      {
        text: '🗑️  Xoá nhật ký',
        style: 'destructive',
        onPress: () => {
          setDiaries(prev => prev.filter(d => d.id !== id));
        },
      },
      { text: 'Huỷ', style: 'cancel' },
    ]);
  }, []);

  const handleAddNew = () => {
    // TODO: Mở màn hình/modal thêm nhật ký
    Alert.alert('Thêm nhật ký', 'Tính năng đang được phát triển.');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>Cậu chưa viết gì{'\n'}cho hôm nay cả...</Text>
      <Text style={styles.emptySubtext}>Hãy ghi lại cảm xúc của mình nhé 💛</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ---- Header ---- */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào,</Text>
        <Text style={styles.question}>Ngày hôm nay của cậu,{'\n'}có ổn không?</Text>
      </View>

      {/* ---- Nhãn tháng (Đưa lên trên DatePicker để đúng logic thời gian) ---- */}
      <View style={styles.monthRow}>
        <Text style={styles.monthLabel}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.countLabel}>
          {filteredDiaries.length > 0 ? `${filteredDiaries.length} ghi chú` : ''}
        </Text>
      </View>

      {/* ---- DatePicker ---- */}
      <View style={styles.datePickerWrapper}>
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>

      {/* ---- Danh sách nhật ký ---- */}
      <FlatList
        data={filteredDiaries}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <DiaryCard item={item} onMore={handleMorePress} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          filteredDiaries.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* ---- Floating Action Button ---- */}
      <TouchableOpacity style={styles.fab} onPress={handleAddNew} activeOpacity={0.85}>
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },

  // ----- Header -----
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8, // Giảm bớt để không đẩy phần thời gian xuống quá sâu
  },
  greeting: {
    fontSize: 18,
    color: '#B5977A',
    fontFamily: 'Baloo2_400Regular',
  },
  question: {
    fontSize: 24,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_700Bold',
    lineHeight: 30,
    marginTop: 2,
  },

  // ----- Month Label -----
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  monthLabel: {
    fontSize: 16,
    color: '#B5977A',
    fontFamily: 'Baloo2_700Bold',
    textTransform: 'capitalize',
  },
  countLabel: {
    fontSize: 14,
    color: MINT_COLOR,
    fontFamily: 'Baloo2_400Regular',
    marginBottom: 1,
  },

  // ----- DatePicker Wrapper -----
  datePickerWrapper: {
    paddingBottom: 16,
  },

  // ----- List -----
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8, // Thêm padding top để Card đầu tiên không bị dính sát vào DatePicker
    paddingBottom: 120, // An toàn với FAB + tab bar
  },
  listContentEmpty: {
    flex: 1,
  },

  // ----- Empty State -----
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 17,
    color: '#B5977A',
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#C8B5A0',
    fontFamily: 'Baloo2_400Regular',
    textAlign: 'center',
  },

  // ----- FAB -----
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 110, // Cách tab bar an toàn
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: MINT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow iOS
    shadowColor: '#2D9E98',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    // Android
    elevation: 10,
  },
});