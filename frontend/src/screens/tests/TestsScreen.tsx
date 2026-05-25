import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { testApi } from '../../services/testApi';
import ConfirmTestModal from '../../components/tests/ConfirmTestModal';

const mintColor = '#4ABEB2';

// Bản đồ tài nguyên tĩnh (Ảnh và màu sắc) ánh xạ theo ID của bài test trên Database
const TEST_ASSETS: { [key: number]: any } = {
  1: {
    image: require('../../../assets/images/test_images/zung.png'),
    color: mintColor,
  },
  2: {
    image: require('../../../assets/images/test_images/young.png'),
    color: mintColor,
  },
  3: {
    image: require('../../../assets/images/test_images/beck.png'),
    color: mintColor,
  }
};

export default function TestsScreen() {
  const navigation = useNavigation<any>();
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchTests = async () => {
        try {
          const response: any = await testApi.getAllTests();
          if (response && response.tests) {
            setTests(response.tests);
          }
        } catch (error) {
          console.warn('Failed to load tests', error);
        }
      };
      fetchTests();
    }, [])
  );

  const handlePressCard = (test: any) => {
    setSelectedTest(test);
    setModalVisible(true);
  };

  const handleStartTest = (testId: number) => {
    setModalVisible(false);
    navigation.navigate('Question', { testId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5ED" />
      <SafeAreaView style={styles.safeArea}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bài Test đánh giá</Text>
          <Text style={styles.headerSubtitle}>Làm các bài test để đánh giá sức khỏe tâm lý của bạn</Text>
        </View>

        {/* DANH SÁCH BÀI TEST */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tests.map((test) => {
            const asset = TEST_ASSETS[test.id] || TEST_ASSETS[1];
            return (
              <TouchableOpacity
                key={test.id}
                style={[styles.testCard, { backgroundColor: asset.color }]}
                onPress={() => handlePressCard(test)}
                activeOpacity={0.85}
              >
                {/* Tên bài test nằm trên cùng */}
                <Text style={styles.testTitle}>{test.name}</Text>

                {/* Row gồm ảnh + mô tả */}
                <View style={styles.testBody}>
                  <Image source={asset.image} style={styles.testImage} resizeMode="contain" />
                  <Text style={styles.testDescription} numberOfLines={6}>
                    {test.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Khoảng trống tránh bị Bottom Tab che */}
          <View style={{ height: 110 }} />
        </ScrollView>

        <ConfirmTestModal 
          visible={isModalVisible}
          test={selectedTest}
          testAsset={selectedTest ? TEST_ASSETS[selectedTest.id] || TEST_ASSETS[1] : null}
          onClose={() => setModalVisible(false)}
          onConfirm={handleStartTest}
        />
      </SafeAreaView>
    </View>
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
    backgroundColor: '#FFF5ED',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 10 : 5,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Baloo2_700Bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Baloo2_500Medium',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  testCard: {
    backgroundColor: mintColor,
    borderRadius: 24,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  testTitle: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFDEC1',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  testBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testImage: {
    width: 90,
    height: 90,
    marginRight: 15,
    // Đẩy ảnh xuống dưới một chút cho cân bằng
    alignSelf: 'flex-end',
  },
  testDescription: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Baloo2_500Medium',
    color: '#FFDEC1',
    lineHeight: 20,
  },
});
