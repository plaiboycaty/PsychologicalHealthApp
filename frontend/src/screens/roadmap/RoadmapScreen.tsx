import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import WeekCard from '../../components/roadmap/WeekCard';
import TaskModal from '../../components/roadmap/TaskModal';
import { useRoadmap } from '../../hooks/useRoadmap';

const ACTIVE_BLUE = '#39BFFF';
const TEAL_BTN = '#35979C';
const RED_BTN = '#E63946';

export default function Roadmap52HzScreen() {
  const {
    status,
    roadmapData,
    completedTasks,
    daysElapsed,
    category,
    selectedWeek,
    modalVisible,
    isSending,
    handleToggleTask,
    handleOpenWeek,
    handleGoToTest,
    handleEmergencyEmail,
    closeModal,
  } = useRoadmap();

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={ACTIVE_BLUE} />
      <Text style={styles.messageText}>Đang tải lộ trình...</Text>
    </View>
  );

  const renderLocked = (type: 'no_test' | 'completed') => (
    <View style={styles.centerContainer}>
      <Ionicons name="lock-closed" size={80} color="#C4C4C4" style={{ marginBottom: 20 }} />
      <Text style={styles.titleText}>Chưa Mở Khóa Lộ Trình</Text>
      <Text style={styles.messageText}>
        {type === 'no_test'
          ? 'Hệ thống cần phân tích tâm lý của bạn trước khi đưa ra phác đồ điều trị phù hợp.'
          : 'Tuyệt vời! Bạn đã hoàn thành Lộ trình 4 tuần. Hãy làm lại bài kiểm tra để chúng tôi đánh giá mức độ phục hồi nhé!'}
      </Text>
      <TouchableOpacity style={styles.actionBtn} onPress={handleGoToTest}>
        <Text style={styles.actionBtnText}>Làm Bài Kiểm Tra Đánh Giá</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHealthy = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="happy" size={80} color="#FFD166" style={{ marginBottom: 20 }} />
      <Text style={styles.titleText}>Sức Khỏe Rất Tốt!</Text>
      <Text style={styles.messageText}>
        Tâm lý của bạn đang ở trạng thái hoàn toàn khỏe mạnh. Bạn không cần tham gia lộ trình điều trị nào cả. Hãy tiếp tục duy trì lối sống tích cực nhé!
      </Text>
    </View>
  );

  const renderEmergency = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="warning" size={80} color={RED_BTN} style={{ marginBottom: 20 }} />
      <Text style={styles.titleText}>Cần Hỗ Trợ Y Tế</Text>
      <Text style={[styles.messageText, { color: '#E63946' }]}>
        Tình trạng tâm lý của bạn hiện đang cần sự can thiệp chuyên môn trực tiếp. Xin đừng chịu đựng một mình.
      </Text>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: RED_BTN }]} onPress={handleEmergencyEmail} disabled={isSending}>
        {isSending ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionBtnText}>Gửi Yêu Cầu Cho Bác Sĩ</Text>}
      </TouchableOpacity>
    </View>
  );

  const renderTreatment = () => {
    // Tính tiến độ: Số tuần đã hoàn thành
    const completedWeeksCount = roadmapData.filter(week => {
      const tasks = week.tasks || [];
      
      const doneTasks = tasks.filter((t: any) => completedTasks.includes(t.taskId)).length;
      return doneTasks === tasks.length && tasks.length > 0;
    }).length;

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lộ trình 52Hz</Text>
          <Text style={styles.headerSubtitle}>Hành trình 4 tuần chữa lành</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeLabel}>Tiến độ: </Text>
            <Text style={styles.progressBadgeValue}>Tuần {completedWeeksCount}/{roadmapData.length}</Text>
          </View>
        </View>

        <View style={styles.roadmapContainer}>
          {roadmapData.map((week) => (
            <WeekCard
              key={week.id}
              week={week}
              completedTasks={completedTasks}
              daysElapsed={daysElapsed}
              onPress={handleOpenWeek}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (status) {
      case 'loading': return renderLoading();
      case 'no_test': return renderLocked('no_test');
      case 'roadmap_completed_need_test': return renderLocked('completed');
      case 'healthy': return renderHealthy();
      case 'emergency': return renderEmergency();
      case 'treatment': return renderTreatment();
      default: return (
        <View style={styles.centerContainer}>
          <Text style={styles.messageText}>Dữ liệu bị lỗi. Vui lòng thử lại sau.</Text>
        </View>
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background/roadmap_background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderContent()}

        <TaskModal
          visible={modalVisible}
          week={selectedWeek}
          completedTasks={completedTasks}
          onClose={closeModal}
          onToggleTask={handleToggleTask}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  titleText: {
    fontSize: 26,
    fontFamily: 'Baloo2_700Bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Baloo2_500Medium',
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  actionBtn: {
    backgroundColor: TEAL_BTN,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
  },
  scrollContent: { paddingTop: 10 },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    color: '#000',
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Baloo2_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBadgeLabel: { fontSize: 14, color: '#333', fontFamily: 'Baloo2_700Bold' },
  progressBadgeValue: { fontSize: 14, color: ACTIVE_BLUE, fontFamily: 'Baloo2_700Bold' },
  roadmapContainer: { paddingVertical: 10 },
});