import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const mintColor = '#4ABEB2';

interface ConfirmTestModalProps {
  visible: boolean;
  test: any;
  onClose: () => void;
  onConfirm: (testId: number) => void;
  testAsset?: any;
}

export default function ConfirmTestModal({
  visible,
  test,
  onClose,
  onConfirm,
  testAsset
}: ConfirmTestModalProps) {
  if (!test) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Nút đóng góc phải */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#888" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Image source={testAsset?.image} style={styles.testImage} resizeMode="contain" />
            </View>
            <Text style={styles.title}>Xác nhận làm bài</Text>
          </View>

          <Text style={styles.testName}>{test.name}</Text>
          
          <View style={styles.warningBox}>
            <Feather name="info" size={20} color="#E67E22" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Hãy chọn một không gian yên tĩnh và trả lời thật lòng với cảm xúc hiện tại của bạn nhé.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(test.id)}>
              <Text style={styles.confirmBtnText}>Bắt đầu làm bài</Text>
              <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F6F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  testImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Baloo2_700Bold',
    color: '#333',
  },
  testName: {
    fontSize: 18,
    fontFamily: 'Baloo2_600SemiBold',
    color: mintColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF0E6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E67E22',
    fontFamily: 'Baloo2_500Medium',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Baloo2_600SemiBold',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: mintColor,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
  },
});
