import React, { useState, useCallback } from 'react';
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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MOCK_DIARIES } from '../../constants/mock-data';
import EmotionModal from '../../components/homescreen/EmotionModal';
import EmotionTracker from '../../components/homescreen/EmotionTracker';
import WeeklyCalendar from '../../components/homescreen/WeeklyCalendar';
import TestReminder from '../../components/homescreen/TestReminder';

const { width } = Dimensions.get('window');
const mintColor = '#4ABEB2';

export default function HomeScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [diaries, setDiaries] = useState<any[]>([]);

  // Đọc danh sách nhật ký từ AsyncStorage mỗi khi HomeScreen được focus
  useFocusEffect(
    useCallback(() => {
      const loadDiaries = async () => {
        try {
          const stored = await AsyncStorage.getItem('@diaries_data_key');
          if (stored !== null) {
            setDiaries(JSON.parse(stored));
          } else {
            setDiaries(MOCK_DIARIES);
          }
        } catch (e) {
          console.warn('Failed to load diaries in HomeScreen', e);
        }
      };
      loadDiaries();
    }, [])
  );

  const handleSelectEmotion = (emotion: any) => {
    setSelectedEmotion(emotion);
    setModalVisible(true);
  };

  const handleSubmitDiary = async (reason: string) => {
    if (!selectedEmotion) return;

    try {
      // 1. Tạo entry nhật ký nhanh cho hôm nay
      const created_at = new Date().toISOString();

      const newEntry = {
        id: Date.now(),
        title: 'Nhật ký nhanh',
        content: reason,
        emotion_id: selectedEmotion.id,
        emotion_name: selectedEmotion.name,
        image_url: null,
        created_at,
      };

      // 2. Cập nhật và lưu vào AsyncStorage
      const updatedList = [newEntry, ...diaries];
      setDiaries(updatedList);
      await AsyncStorage.setItem('@diaries_data_key', JSON.stringify(updatedList));

      Alert.alert('Thành công', 'Nhật ký của cậu đã được lưu lại nhé 🤍');
    } catch (e) {
      console.warn('Failed to save quick diary', e);
      Alert.alert('Lỗi', 'Không thể lưu nhật ký, cậu vui lòng thử lại.');
    }

    setModalVisible(false);
    setTimeout(() => {
      setSelectedEmotion(null);
    }, 500);
  };

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
            <Text style={styles.nameText}>Tran Minh Quan</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellIcon}>
              <Feather name="bell" size={26} color="#000" />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
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
          onClose={() => setModalVisible(false)}
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
    backgroundColor: 'transparent', // iOS: tránh nền trắng đè lên ImageBackground
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