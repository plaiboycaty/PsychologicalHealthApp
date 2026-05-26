import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation.types';
import { useResult } from '../../hooks/useResult';

const { width, height } = Dimensions.get('window');

type RouteProps = RouteProp<AppStackParamList, 'Result'>;

export default function ResultScreen() {
  const route = useRoute<RouteProps>();

  const { totalScore, category, testId } = route.params;

  const { testName, uiConfig, handleClose } = useResult(testId, category);

  return (
    <View style={[styles.container, { backgroundColor: uiConfig.color }]}>
      <StatusBar barStyle="dark-content" backgroundColor={uiConfig.color} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Kết quả đánh giá trạng thái {testName}
            </Text>
          </View>
          <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.doneBtn}>
              <Text style={styles.doneText}>XONG</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NỘI DUNG CHÍNH */}
        <View style={styles.content}>

          {/* PHẦN 1: ĐIỂM SỐ & MỨC ĐỘ */}
          <View style={styles.topSection}>
            <Text style={styles.scoreNumber}>{totalScore}</Text>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          {/* PHẦN 2: KHUNG CHAT (TEXTBOX) & MÈO */}
          <View style={styles.bottomSection}>

            <View style={styles.chatWrapper}>
              {/* Thân khung chat */}
              <View style={[styles.chatBubble, { backgroundColor: uiConfig.color }]}>
                <Text style={styles.chatMessage}>{uiConfig.message}</Text>
              </View>
              {/* Đuôi khung chat thuần CSS (Không dùng SVG) */}
              <View style={[styles.chatTail, { backgroundColor: uiConfig.color }]} />
            </View>

            {/* Chú mèo */}
            <Image
              source={uiConfig.catImage}
              style={styles.catImage}
            />

          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
  },
  headerSide: {
    width: 60,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  doneBtn: {
    paddingLeft: 10,
  },
  doneText: {
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.02,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  topSection: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 150,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    includeFontPadding: false,
    lineHeight: Platform.OS === 'ios' ? undefined : undefined,
  },
  categoryText: {
    fontSize: 24,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  chatWrapper: {
    position: 'relative',
    width: width * 0.72,
    zIndex: 2,
  },
  chatBubble: {
    borderWidth: 8,
    borderColor: '#000000',
    borderRadius: 28,
    paddingHorizontal: 25,
    paddingVertical: 35,
    zIndex: 2,
  },
  chatTail: {
    position: 'absolute',
    bottom: -18,
    left: width * 0.19,
    width: 41,
    height: 41,
    borderLeftWidth: 9,
    borderBottomWidth: 9,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderColor: '#000000',
    borderBottomLeftRadius: 6,
    transform: [{ rotate: '-44deg' }],
    zIndex: 3,
  },
  chatMessage: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 26,
  },
  catImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginLeft: width * 0.15,
    marginTop: 30,
    zIndex: 1,
  },
});
