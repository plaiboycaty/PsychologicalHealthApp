import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';

const mintColor = '#66C5BA';

interface EmotionModalProps {
  visible: boolean;
  emotion: { id: number | string; name: string; icon: any } | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function EmotionModal({ visible, emotion, onClose, onSubmit }: EmotionModalProps) {
  const [reason, setReason] = useState('');

  // Reset input khi mở lại modal
  useEffect(() => {
    if (visible) {
      setReason('');
    }
  }, [visible]);

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  if (!emotion) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
          >
            <View style={styles.modalContainer}>
              <Image source={emotion.icon} style={styles.emotionIcon} />

              <Text style={styles.title}>Bạn đang cảm thấy {emotion.name.toLowerCase()}</Text>
              <Text style={styles.subtitle}>
                Cho mình biết lý do vì sao bạn {emotion.name.toLowerCase()} được không?
              </Text>

              <TextInput
                style={styles.textInput}
                placeholder="Viết vài dòng chia sẻ nhé..."
                placeholderTextColor="#999"
                multiline
                maxLength={200}
                value={reason}
                onChangeText={setReason}
              />
              <Text style={styles.charCount}>{reason.length}/200</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, !reason.trim() && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!reason.trim()}
                >
                  <Text style={styles.submitButtonText}>Gửi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  keyboardContainer: {
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  emotionIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
    marginTop: -50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Baloo2_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Baloo2_500Medium',
  },
  textInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F7FA',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    color: '#333',
    fontFamily: 'Baloo2_500Medium',
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Baloo2_700Bold',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: mintColor,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A0D8D4',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Baloo2_700Bold',
  },
});
