import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types/navigation.types';
import { MOCK_TESTS_MAP } from '../../constants/mock-data';

// Import subcomponents
import QuestionHeader from '../../components/tests/QuestionHeader';
import QuestionCard from '../../components/tests/QuestionCard';
import OptionsList from '../../components/tests/OptionsList';
import TestConfirmModal from '../../components/tests/TestConfirmModal';

const mintColor = '#4ABEB2';
const bgColor = '#EFEFEF';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Question'>;
type RouteProps = RouteProp<AppStackParamList, 'Question'>;

export default function QuestionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { testId } = route.params;

  const testDetails = useMemo(() => {
    return MOCK_TESTS_MAP[testId] || MOCK_TESTS_MAP['zung'];
  }, [testId]);

  const questions = testDetails.questions;
  const totalQuestions = testDetails.total_questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.question_id];
  const isOptionSelected = selectedOptionId !== undefined;

  const handleSelectOption = (optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.question_id]: optionId,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSubmitModalVisible(true);
    }
  };

  const handleCancelTest = () => {
    setCancelModalVisible(false);
    navigation.goBack();
  };

  const handleSubmitTest = () => {
    setSubmitModalVisible(false);
    let totalScore = 0;
    questions.forEach(q => {
      const selectedId = answers[q.question_id];
      const option = q.options.find(o => o.option_id === selectedId);
      if (option) {
        totalScore += option.score;
      }
    });

    let category = 'Bình thường';
    if (testId === 'zung') {
      if (totalScore >= 19) category = 'Rất nặng';
      else if (totalScore >= 16) category = 'Nặng';
      else if (totalScore >= 12) category = 'Vừa';
      else if (totalScore >= 9) category = 'Nhẹ';
      else category = 'Bình thường';
    } else if (testId === 'beck') {
      if (totalScore >= 11) category = 'Rất nặng';
      else if (totalScore >= 9) category = 'Nặng';
      else if (totalScore >= 6) category = 'Vừa';
      else if (totalScore >= 4) category = 'Nhẹ';
      else category = 'Bình thường';
    } else {
      if (totalScore >= 14) category = 'Rất nặng';
      else if (totalScore >= 11) category = 'Nặng';
      else if (totalScore >= 7) category = 'Vừa';
      else if (totalScore >= 4) category = 'Nhẹ';
      else category = 'Bình thường';
    }

    navigation.navigate('Result', {
      testId,
      totalScore,
      category,
    });
  };

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
            !isOptionSelected && styles.navButtonPrimaryDisabled
          ]}
          onPress={handleNext}
          disabled={!isOptionSelected}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonPrimaryText}>
            {currentIndex === totalQuestions - 1 ? 'Nộp bài' : 'Tiếp'}
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