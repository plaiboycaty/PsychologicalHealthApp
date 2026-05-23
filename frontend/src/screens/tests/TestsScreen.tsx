import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

const mintColor = '#4ABEB2';

// Danh sách 3 bài test
const TESTS = [
  {
    id: 'zung',
    title: 'BÀI ĐÁNH GIÁ LO ÂU ZUNG',
    description:
      'Dưới đây là 20 câu mô tả một số triệu chứng của cơ thể. Ở mỗi câu, hãy chọn một mức độ phù hợp nhất với tình trạng mà bạn cảm thấy trong vòng 1 tuần vừa qua......',
    image: require('../../../assets/images/test_images/zung.png'),
    color: '#4ABEB2',
  },
  {
    id: 'beck',
    title: 'BÀI ĐÁNH GIÁ TRẦM CẢM BECK',
    description:
      'Dưới đây là 20 câu mô tả một số triệu chứng của cơ thể. Ở mỗi câu, hãy chọn một mức độ phù hợp nhất với tình trạng mà bạn cảm thấy trong vòng 1 tuần vừa qua......',
    image: require('../../../assets/images/test_images/beck.png'),
    color: '#4ABEB2',
  },
  {
    id: 'young',
    title: 'BÀI ĐÁNH GIÁ HƯNG CẢM YOUNG',
    description:
      'Dưới đây là 20 câu mô tả một số triệu chứng của cơ thể. Ở mỗi câu, hãy chọn một mức độ phù hợp nhất với tình trạng mà bạn cảm thấy trong vòng 1 tuần vừa qua......',
    image: require('../../../assets/images/test_images/young.png'),
    color: '#4ABEB2',
  },
];

export default function TestsScreen() {
  const navigation = useNavigation<any>();

  const handleStartTest = (testId: string) => {
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
          {TESTS.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={styles.testCard}
              onPress={() => handleStartTest(test.id)}
              activeOpacity={0.85}
            >
              {/* Tên bài test nằm trên cùng */}
              <Text style={styles.testTitle}>{test.title}</Text>

              {/* Row gồm ảnh + mô tả */}
              <View style={styles.testBody}>
                <Image source={test.image} style={styles.testImage} resizeMode="contain" />
                <Text style={styles.testDescription}>{test.description}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Khoảng trống tránh bị Bottom Tab che */}
          <View style={{ height: 110 }} />
        </ScrollView>
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
    padding: 20,
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
