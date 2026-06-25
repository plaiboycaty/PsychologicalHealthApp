import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth.store';
import { useHome } from '../../hooks/useHome';
import EmotionModal from '../../components/homescreen/EmotionModal';
import EmotionTracker from '../../components/homescreen/EmotionTracker';
import WeeklyCalendar from '../../components/homescreen/WeeklyCalendar';
import TestReminder from '../../components/homescreen/TestReminder';

const { width } = Dimensions.get('window');
const mintColor = '#4ABEB2';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {
    diaries,
    selectedEmotion,
    isModalVisible,
    handleSelectEmotion,
    handleSubmitDiary,
    closeModal,
  } = useHome();

  // Lấy user từ store
  const user = useAuthStore(state => state.user);

  return (
    // Dùng ImageBackground bọc toàn bộ màn hình
    <ImageBackground
      source={require('../../../assets/images/background/background.png')}
      style={styles.backgroundImage}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.nameText}>{user?.full_name || 'Khách'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.bellIcon} 
              onPress={() => (navigation as any).navigate('Notification')}
            >
              <Feather name="bell" size={26} color="#000" />
            </TouchableOpacity>
            <Image
              source={user?.avatar_url ? { uri: user.avatar_url } : require('../../../assets/images/emotions/happy.png')}
              style={styles.avatar}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EmotionTracker onSelectEmotion={handleSelectEmotion} />

          <WeeklyCalendar diaries={diaries} />

          <TestReminder />

          <View style={{ height: 110 }} />
        </ScrollView>

        <EmotionModal
          visible={isModalVisible}
          emotion={selectedEmotion}
          onClose={closeModal}
          onSubmit={handleSubmitDiary}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
  },
  greetingText: {
    fontSize: 20,
    color: '#555',
    marginBottom: 2,
    fontFamily: 'Baloo2_500Medium',
  },
  nameText: {
    fontSize: 30,
    color: '#000',
    fontFamily: 'Baloo2_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});