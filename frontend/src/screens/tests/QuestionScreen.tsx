import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation.types';
import { useQuestion } from '../../hooks/useQuestion';

// Import subcomponents
import QuestionHeader from '../../components/tests/QuestionHeader';
import QuestionCard from '../../components/tests/QuestionCard';
import OptionsList from '../../components/tests/OptionsList';
import TestConfirmModal from '../../components/tests/TestConfirmModal';

const mintColor = '#4ABEB2';
const bgColor = '#EFEFEF';

type RouteProps = RouteProp<AppStackParamList, 'Question'>;

export default function QuestionScreen() {
  const route = useRoute<RouteProps>();
  const { testId } = route.params;

  const {
    testDetails,
    isLoading,
    currentIndex,
    totalQuestions,
    currentQuestion,
    selectedOptionId,
    isOptionSelected,
    cancelModalVisible,
    setCancelModalVisible,
    submitModalVisible,
    setSubmitModalVisible,
    isSubmitting,
    handleSelectOption,
    handlePrev,
    handleNext,
    handleCancelTest,
    handleSubmitTest,
  } = useQuestion(Number(testId));

  if (isLoading || !testDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Đang tải dữ liệu bài kiểm tra...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />

      {/* HEADER */}
      <QuestionHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        onPrev={handlePrev}
        onCancel={() => setCancelModalVisible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* THẺ CÂU HỎI */}
        <QuestionCard content={currentQuestion.content} />

        {/* DANH SÁCH ĐÁP ÁN */}
        <OptionsList
          options={currentQuestion.options}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
        />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButtonPrimary,
            (!isOptionSelected || isSubmitting) && styles.navButtonPrimaryDisabled
          ]}
          onPress={handleNext}
          disabled={!isOptionSelected || isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonPrimaryText}>
            {isSubmitting ? 'Đang nộp...' : currentIndex === totalQuestions - 1 ? 'Nộp bài' : 'Tiếp'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL HỦY BÀI TEST */}
      <TestConfirmModal
        visible={cancelModalVisible}
        title="Xác nhận hủy làm bài test ?"
        message="Đáp án của bạn sẽ không được lưu khi bạn nhấn &quot;Xác nhận&quot;"
        onConfirm={handleCancelTest}
        onCancel={() => setCancelModalVisible(false)}
      />

      {/* MODAL NỘP BÀI TEST */}
      <TestConfirmModal
        visible={submitModalVisible}
        title="Xác nhận nộp bài"
        message="Bạn có chắc chắn nộp bài ?"
        onConfirm={handleSubmitTest}
        onCancel={() => setSubmitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  navButtonPrimary: {
    backgroundColor: mintColor,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPrimaryDisabled: {
    opacity: 0.5,
  },
  navButtonPrimaryText: {
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFFFFF',
  },
});