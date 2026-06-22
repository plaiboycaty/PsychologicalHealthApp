import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  Dimensions, TouchableOpacity, ViewToken
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { MOCK_ONBOARDING } from '../../constants/mock-data';
import { Colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const width = Dimensions.get('window').width;
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Nút Skip hoặc Get Started -> Chuyển sang màn Login
  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_ONBOARDING}
        ref={slidesRef}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* Background cong cong mô phỏng ảnh mẫu */}
            <View style={[styles.imageBackground, { backgroundColor: item.color }]}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>
                  {currentIndex === MOCK_ONBOARDING.length - 1 ? "Bắt Đầu" : "Bỏ qua"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Dấu chấm điều hướng (Pagination) */}
      <View style={styles.paginationContainer}>
        {MOCK_ONBOARDING.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '60%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  skipButton: {
    backgroundColor: Colors.mintLight,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  skipText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: Colors.mintLight,
  },
  inactiveDot: {
    width: 10,
    backgroundColor: Colors.border,
  }
});

