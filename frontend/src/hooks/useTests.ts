import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { testApi } from '../services/testApi';

export const useTests = () => {
  const navigation = useNavigation<any>();
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchTests = useCallback(async () => {
    try {
      const response: any = await testApi.getAllTests();
      if (response && response.tests) {
        setTests(response.tests);
      }
    } catch (error) {
      console.warn('Failed to load tests', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTests();
    }, [fetchTests])
  );

  const handlePressCard = useCallback((test: any) => {
    setSelectedTest(test);
    setModalVisible(true);
  }, []);

  const handleStartTest = useCallback((testId: number) => {
    setModalVisible(false);
    navigation.navigate('Question', { testId });
  }, [navigation]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    tests,
    selectedTest,
    isModalVisible,
    handlePressCard,
    handleStartTest,
    closeModal,
  };
};
