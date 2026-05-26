import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { testApi } from '../services/testApi';

export const useQuestion = (testId: number) => {
  const navigation = useNavigation<any>();
  const [testDetails, setTestDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setIsLoading(true);
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

  const questions = testDetails?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isOptionSelected = selectedOptionId !== undefined;

  const handleSelectOption = useCallback((optionId: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  }, [currentQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSubmitModalVisible(true);
    }
  }, [currentIndex, totalQuestions]);

  const handleCancelTest = useCallback(() => {
    setCancelModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  const handleSubmitTest = useCallback(async () => {
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
  }, [answers, testId, navigation]);

  return {
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
  };
};
