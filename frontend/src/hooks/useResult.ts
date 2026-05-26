import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getResultUIConfig } from '../utils/testResultHelper';

export const useResult = (testId: string, category: string) => {
  const navigation = useNavigation<any>();

  const testName = Number(testId) === 1 ? 'Lo âu' : Number(testId) === 3 ? 'Trầm cảm' : 'Hưng cảm';
  const uiConfig = getResultUIConfig(category, testName);

  const handleClose = useCallback(() => {
    navigation.navigate('MainTabs');
  }, [navigation]);

  return {
    testName,
    uiConfig,
    handleClose,
  };
};
