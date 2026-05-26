import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useDiaries } from '../../hooks/useDiaries';

import { MOCK_DIARIES } from '../../constants/mock-data';
import DiaryCard, { DiaryEntry } from '../../components/diary/DiaryCard';
import DatePicker from '../../components/diary/DatePicker';
import CalendarFilterModal from '../../components/diary/CalendarFilterModal';
import DiaryDetailModal from '../../components/diary/DiaryDetailModal';
import DiaryEditorModal from '../../components/diary/DiaryEditorModal';

const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FFF8F0';
const STORAGE_KEY = '@diaries_data_key';

// Lấy ngày hôm nay dạng 'YYYY-MM-DD' (sử dụng giờ địa phương thay vì UTC để tránh lệch ngày)
function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Lấy ngày từ ISO string diary
function getEntryDate(isoStr: string): string {
  return isoStr.split('T')[0];
}

export default function DiaryScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const { diaries, loading, loadDiaries, addDiary, editDiary, removeDiary } = useDiaries();

  // States cho các Modals chi tiết & thêm/sửa
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<DiaryEntry | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const [selectedEditorEntry, setSelectedEditorEntry] = useState<DiaryEntry | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  // ---- Đọc dữ liệu từ API khi màn hình nhận focus ----
  useFocusEffect(
    useCallback(() => {
      loadDiaries();
    }, [loadDiaries])
  );

  // Lọc nhật ký theo ngày đang chọn
  const filteredDiaries = diaries.filter(
    d => getEntryDate(d.created_at) === selectedDate
  );

  // Xử lý Xoá Nhật Ký (kèm Alert hỏi xác nhận)
  const handleDeleteDiary = useCallback((id: number) => {
    Alert.alert(
      'Xác nhận xoá',
      'Cậu có chắc chắn muốn xoá nhật ký này không? Hành động này không thể hoàn tác.',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDiary(id);
              setIsDetailVisible(false);
              setSelectedDetailEntry(null);
            } catch (error) {
              // Lỗi đã được catch và hiển thị bên trong hook
            }
          },
        },
      ]
    );
  }, []);

  // Xử lý khi nhấn vào xem chi tiết card
  const handleCardPress = (entry: DiaryEntry) => {
    setSelectedDetailEntry(entry);
    setIsDetailVisible(true);
  };

  // Mở modal thêm nhật ký mới
  const handleAddNew = () => {
    setSelectedEditorEntry(null);
    setIsEditorVisible(true);
  };

  // Xử lý Lưu Thêm mới / Chỉnh sửa
  const handleSaveEntry = async (entryData: {
    title: string;
    content: string;
    emotion_id: number;
    emotion_name: string;
    image_url: string | null;
  }) => {
    try {
      if (selectedEditorEntry) {
        // Đang SỬA nhật ký
        await editDiary(selectedEditorEntry.id, entryData);
        
        setIsEditorVisible(false);
        setSelectedEditorEntry(null);
        setIsDetailVisible(false);
        setSelectedDetailEntry(null);
      } else {
        // Đang THÊM MỚI nhật ký
        await addDiary(entryData);
        setIsEditorVisible(false);
      }
    } catch (error) {
      // Hook đã catch và Alert lỗi, không cần làm gì thêm ở đây
    }
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

      {/* ---- DatePicker ---- */}
      <View style={styles.datePickerWrapper}>
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onOpenCalendar={() => setIsCalendarVisible(true)}
        />
      </View>

      <CalendarFilterModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        currentSelectedDate={selectedDate}
        onSelectDate={(dateStr) => {
          setSelectedDate(dateStr);
        }}
      />

      <Text style={styles.countLabel}>
        {filteredDiaries.length > 0 ? `${filteredDiaries.length} ghi chú` : ''}
      </Text>

      {/* ---- Loading Indicator ---- */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MINT_COLOR} />
        </View>
      ) : (
        /* ---- Danh sách nhật ký ---- */
        <FlatList
          data={filteredDiaries}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <DiaryCard
              item={item}
              onPress={handleCardPress}
            />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            filteredDiaries.length === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ---- Floating Action Button ---- */}
      <TouchableOpacity style={styles.fab} onPress={handleAddNew} activeOpacity={0.85}>
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ---- Modal Xem Chi Tiết Nhật Ký ---- */}
      {isDetailVisible && (
        <DiaryDetailModal
          visible={isDetailVisible}
          item={selectedDetailEntry}
          onClose={() => {
            setIsDetailVisible(false);
            setSelectedDetailEntry(null);
          }}
          onEdit={(entry) => {
            // Đóng modal chi tiết trước để tránh xung đột animation khi mở đè 2 modal
            setIsDetailVisible(false);
            setSelectedDetailEntry(null);
            setTimeout(() => {
              setSelectedEditorEntry(entry);
              setIsEditorVisible(true);
            }, 300);
          }}
          onDelete={handleDeleteDiary}
        />
      )}

      {/* ---- Modal Thêm mới / Chỉnh sửa Nhật Ký ---- */}
      {isEditorVisible && (
        <DiaryEditorModal
          visible={isEditorVisible}
          item={selectedEditorEntry}
          onClose={() => {
            setIsEditorVisible(false);
            setSelectedEditorEntry(null);
          }}
          onSave={handleSaveEntry}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ----- Header -----
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
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
    textAlign: 'right',
    marginRight: 24,
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
    paddingTop: 8,
    paddingBottom: 120,
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
    bottom: 110,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: MINT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D9E98',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
});