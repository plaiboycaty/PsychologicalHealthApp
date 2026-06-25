import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useHistory } from '../../hooks/useHistory';
import { AppStackParamList } from '../../types/navigation.types';

const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FAFAFA';

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { history, loading, filterType, changeFilter } = useHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    const hr = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${hr}:${min} - ${d}/${m}/${y}`;
  };

  const getCategoryColor = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('nhẹ') || lower.includes('bình thường')) return '#4ABEB2'; // Xanh mint
    if (lower.includes('vừa')) return '#FBBF24'; // Vàng cam
    if (lower.includes('nặng')) return '#FB7185'; // Đỏ/hồng
    return '#C4C4C4';
  };

  const renderFilterChips = () => {
    const filters = [
      { id: 'all', label: 'Tất cả' },
      { id: 'anxiety', label: 'Lo âu' },
      { id: 'depression', label: 'Trầm cảm' },
      { id: 'mania', label: 'Hưng cảm' },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filters.map((f) => {
          const isActive = filterType === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => changeFilter(f.id)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#1A1A2E" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer} pointerEvents="none">
          <Text style={styles.headerTitle}>Lịch sử bài Test</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterContainer}>
        {renderFilterChips()}
      </View>

      {/* DANH SÁCH LỊCH SỬ */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={MINT_COLOR} />
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Chưa có bài kiểm tra nào.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.testTitle}>{item.name || 'Bài đánh giá tâm lý'}</Text>
                  <Text style={styles.scoreText}>Điểm: <Text style={{ fontFamily: 'Baloo2_700Bold' }}>{item.total_score}</Text></Text>
                </View>

                <View style={[styles.badge, { backgroundColor: getCategoryColor(item.category) }]}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  backButton: {
    padding: 5,
    zIndex: 10,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Baloo2_700Bold',
    color: '#1A1A2E',
  },
  placeholder: {
    width: 44,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: MINT_COLOR,
  },
  filterChipActive: {
    backgroundColor: MINT_COLOR,
    borderColor: MINT_COLOR,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    color: MINT_COLOR,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Baloo2_700Bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: 'Baloo2_500Medium',
    color: '#666666',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'Baloo2_500Medium',
    color: '#9CA3AF',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Baloo2_500Medium',
    color: '#9CA3AF',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    marginRight: 10,
  },
  testTitle: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Baloo2_400Regular',
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFFFFF',
  },
});
