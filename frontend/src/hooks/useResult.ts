import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getResultUIConfig } from '../utils/testResultHelper';
import { treatmentApi } from '../services/treatmentApi';

export const useResult = (testId: string, category: string) => {
  const navigation = useNavigation<any>();
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const testName = useMemo(() => {
    return Number(testId) === 1 ? 'Lo âu' : Number(testId) === 3 ? 'Trầm cảm' : 'Hưng cảm';
  }, [testId]);

  const uiConfig = useMemo(() => {
    return getResultUIConfig(category, testName);
  }, [category, testName]);

  const isEmergency = useMemo(() => {
    return category.toLowerCase().includes('nặng');
  }, [category]);

  const isTreatment = useMemo(() => {
    return category.toLowerCase().includes('nhẹ') || category.toLowerCase().includes('vừa');
  }, [category]);

  const handleClose = useCallback(() => {
    navigation.navigate('MainTabs');
  }, [navigation]);

  const handleDonePress = useCallback(() => {
    if (isEmergency) {
      setShowEmergencyModal(true);
    } else if (isTreatment) {
      setShowTreatmentModal(true);
    } else {
      handleClose();
    }
  }, [isEmergency, isTreatment, handleClose]);

  const handleConfirmTreatment = useCallback(() => {
    setShowTreatmentModal(false);
    navigation.navigate('MainTabs', { screen: 'Roadmap' });
  }, [navigation]);

  const handleCancel = useCallback(() => {
    setShowTreatmentModal(false);
    setShowEmergencyModal(false);
    handleClose(); 
  }, [handleClose]);

  const handleSendEmergency = useCallback(async () => {
    setIsSendingEmail(true);
    try {
      await treatmentApi.sendEmergencyEmail();
      Alert.alert('Thành công', 'Yêu cầu hỗ trợ khẩn cấp đã được gửi tới bác sĩ!');
      setShowEmergencyModal(false);
      handleClose();
    } catch (e: any) {
      Alert.alert('Lỗi', e.response?.data?.message || 'Không thể gửi email lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSendingEmail(false);
    }
  }, [handleClose]);

  return {
    testName,
    uiConfig,
    showTreatmentModal,
    showEmergencyModal,
    isSendingEmail,
    handleDonePress,
    handleConfirmTreatment,
    handleCancel,
    handleSendEmergency,
  };
};
