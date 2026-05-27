import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

interface ResultModalsProps {
  showTreatmentModal: boolean;
  showEmergencyModal: boolean;
  isSendingEmail: boolean;
  onConfirmTreatment: () => void;
  onSendEmergency: () => void;
  onCancel: () => void;
}

export default function ResultModals({
  showTreatmentModal,
  showEmergencyModal,
  isSendingEmail,
  onConfirmTreatment,
  onSendEmergency,
  onCancel
}: ResultModalsProps) {
  return (
    <>
      {/* MODAL TREATMENT */}
      <Modal visible={showTreatmentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thông báo</Text>
            <Text style={styles.modalText}>
              Bạn có muốn xem đề xuất hỗ trợ của đội ngũ PsychologicalHealth không ? Nếu bạn đồng ý thì sẽ không thể làm lại bài kiểm tra này nữa cho tới khi hoàn thành các đề xuất hỗ trợ của chúng tôi.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmTreatment}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL EMERGENCY */}
      <Modal visible={showEmergencyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cảnh báo Y tế</Text>
            <Text style={styles.modalText}>
              Tình trạng tâm lý của bạn hiện đang cần sự hỗ trợ chuyên môn từ Bác sĩ. Bạn có muốn chúng tôi gửi yêu cầu hỗ trợ y tế khẩn cấp ngay bây giờ không?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmBtn} onPress={onSendEmergency} disabled={isSendingEmail}>
                {isSendingEmail ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Gửi Email</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Baloo2_500Medium',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#35979C',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelBtnText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
  }
});
