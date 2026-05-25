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
import { testApi } from '../../services/testApi';

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

  const [testDetails, setTestDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response: any = await testApi.getTestDetail(Number(testId));
        if (response && response.test) {
          setTestDetails(response.test);
        }
      } catch (error) {
        console.warn('Failed to fetch test detail', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestDetails();
  }, [testId]);

  if (isLoading || !testDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Đang tải dữ liệu bài kiểm tra...</Text>
      </View>
    );
  }

  const questions = testDetails.questions;
  const totalQuestions = questions.length;

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const isOptionSelected = selectedOptionId !== undefined;

  const handleSelectOption = (optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
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

  const handleSubmitTest = async () => {
    setSubmitModalVisible(false);
    setIsSubmitting(true);

    try {
      const optionIds = Object.values(answers);
      const response: any = await testApi.submitTest({
        test_id: Number(testId),
        option_ids: optionIds
      });

      if (response && response.result) {
        navigation.navigate('Result', {
          testId: String(testId),
          totalScore: response.result.total_score,
          category: response.result.category,
        });
      }
    } catch (error) {
      console.warn('Failed to submit test', error);
    } finally {
      setIsSubmitting(false);
    }
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