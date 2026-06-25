import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { useStatistics } from '../../hooks/useStatistics';

const { width } = Dimensions.get('window');
const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FAFAFA';

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const {
    filterType,
    lineData,
    donutData,
    isLoading,
    changeFilter,
  } = useStatistics();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={28} color="#1A1A2E" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer} pointerEvents="none">
          <Text style={styles.headerTitle}>Thống kê</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'week' && styles.filterTabActive]}
          onPress={() => changeFilter('week')}
        >
          <Text style={[styles.filterText, filterType === 'week' && styles.filterTextActive]}>
            theo tuần
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filterType === 'month' && styles.filterTabActive]}
          onPress={() => changeFilter('month')}
        >
          <Text style={[styles.filterText, filterType === 'month' && styles.filterTextActive]}>
            theo tháng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
          onPress={() => changeFilter('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
            tất cả
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MINT_COLOR} />
          <Text style={styles.loadingText}>Đang tải dữ liệu thống kê...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* BIỂU ĐỒ ĐƯỜNG */}
          <View style={styles.chartCard}>
            <View style={styles.chartWrapper}>
              {lineData && lineData.length > 0 && (
                <LineChart
                  data={lineData}
                  curved
                  areaChart
                  thickness={3}
                  color="#4ABEB2"
                  startFillColor="#2563EB03"
                  endFillColor="#2563EB03"
                  maxValue={100}
                  stepValue={20}
                  noOfSections={5}
                  yAxisColor="#E5E7EB"
                  xAxisColor="#E5E7EB"
                  rulesColor="#F3F4F6"
                  rulesType="solid"
                  rulesThickness={1}
                  hideRules={false}
                  yAxisTextStyle={styles.axisText}
                  xAxisLabelTextStyle={styles.axisText}
                  dataPointsColor="#4ABEB2"
                  initialSpacing={25}
                  spacing={40}
                  width={width - 90}
                  height={220}
                />
              )}
            </View>
            <Text style={styles.chartTitle}>Biến thiên điểm số của các bài test</Text>
          </View>

          {/* BIỂU ĐỒ DONUT */}
          <View style={styles.chartCard}>
            <View style={styles.donutWrapper}>
              {donutData && donutData.length > 0 && (
                <PieChart
                  donut
                  data={donutData}
                  showText={false}
                  innerRadius={70}
                  radius={100}
                  centerLabelComponent={() => (
                    <View style={styles.centerLabel}>
                      <Text style={styles.centerLabelText}>Biểu đồ</Text>
                      <Text style={styles.centerLabelText}>cảm xúc</Text>
                    </View>
                  )}
                />
              )}
            </View>

            {/* CHÚ GIẢI (LEGEND) */}
            <View style={styles.legendContainer}>
              {donutData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendValue}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Khoảng trống dưới cùng tránh bị che */}
          <View style={{ height: 50 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MINT_COLOR,
    backgroundColor: '#FFFFFF',
    minWidth: 100,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: MINT_COLOR,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    color: MINT_COLOR,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
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
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    marginTop: 20,
    textAlign: 'center',
  },
  donutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#333333',
    lineHeight: 20,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 6,
    minWidth: '28%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    fontFamily: 'Baloo2_500Medium',
    color: '#555555',
    marginRight: 5,
  },
  legendValue: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    color: '#333333',
  },
  axisText: {
    color: '#888888',
    fontSize: 11,
    fontFamily: 'Baloo2_400Regular',
  },
});
