import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DiaryEntry } from './DiaryCard';
import { MOCK_EMOTIONS } from '../../constants/mock-data';

const { width, height } = Dimensions.get('window');
const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FFF8F0';

interface DiaryEditorModalProps {
  visible: boolean;
  item: DiaryEntry | null;
  onClose: () => void;
  onSave: (entryData: {
    title: string;
    content: string;
    emotion_id: number;
    emotion_name: string;
    image_url: string | null;
  }) => void;
}

export default function DiaryEditorModal({
  visible,
  item,
  onClose,
  onSave,
}: DiaryEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotionId, setSelectedEmotionId] = useState(1);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (item) {
        setTitle(item.title);
        setContent(item.content);
        setSelectedEmotionId(item.emotion_id);
        setImageUri(item.image_url);
      } else {
        setTitle('');
        setContent('');
        setSelectedEmotionId(1);
        setImageUri(null);
      }
    }
  }, [visible, item]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cậu cần cấp quyền truy cập thư viện ảnh để chọn ảnh nhé!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Error picking image: ', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh, cậu vui lòng thử lại.');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Cậu chưa nhập tiêu đề cho ngày hôm nay.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Thông báo', 'Cậu chưa ghi nội dung nhật ký.');
      return;
    }

    const selectedEmotion = MOCK_EMOTIONS.find(e => e.id === selectedEmotionId);
    if (!selectedEmotion) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      emotion_id: selectedEmotionId,
      emotion_name: selectedEmotion.name,
      image_url: imageUri,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop đóng modal */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {item ? 'Chỉnh sửa nhật ký' : 'Viết nhật ký mới'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#2D2D2D" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollBlock}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Chọn cảm xúc */}
              <Text style={styles.sectionLabel}>Cảm xúc hôm nay của cậu thế nào?</Text>
              <View style={styles.emotionGrid}>
                {MOCK_EMOTIONS.map(e => {
                  const isSelected = e.id === selectedEmotionId;
                  return (
                    <TouchableOpacity
                      key={e.id}
                      style={[
                        styles.emotionChip,
                        isSelected && { borderColor: e.color, backgroundColor: e.color + '12' },
                      ]}
                      onPress={() => setSelectedEmotionId(e.id)}
                    >
                      {!e.icon ? (
                        <Text style={styles.emotionEmojiText}>😐</Text>
                      ) : typeof e.icon === 'string' ? (
                        <Text style={styles.emotionEmojiText}>{e.icon}</Text>
                      ) : (
                        <Image
                          source={e.icon}
                          style={[styles.emotionImage, isSelected && styles.emotionImageSelected]}
                        />
                      )}
                      <Text style={[styles.emotionName, isSelected && { color: e.color, fontFamily: 'Baloo2_700Bold' }]}>
                        {e.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Nhập tiêu đề */}
              <Text style={styles.sectionLabel}>Tiêu đề</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Đặt một tựa đề ngắn cho hôm nay..."
                placeholderTextColor="#BDBDBD"
                value={title}
                onChangeText={setTitle}
                maxLength={80}
              />

              {/* Nhập nội dung */}
              <Text style={styles.sectionLabel}>Nội dung</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Ghi lại những trải nghiệm, suy nghĩ của cậu..."
                placeholderTextColor="#BDBDBD"
                multiline
                numberOfLines={6}
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
              />

              {/* Đính kèm ảnh */}
              <Text style={styles.sectionLabel}>Đính kèm hình ảnh</Text>
              {imageUri ? (
                <View style={styles.attachedImageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.attachedImage} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
                    <Ionicons name="trash" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                  <Feather name="image" size={20} color={MINT_COLOR} style={{ marginRight: 8 }} />
                  <Text style={styles.imagePickerText}>Thêm ảnh kỷ niệm</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* Footer buttons */}
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.footerBtn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Huỷ bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.footerBtn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Lưu nhật ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.82,
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  headerTitle: {
    fontSize: 18,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_700Bold',
  },
  closeBtn: {
    padding: 4,
  },
  scrollBlock: {
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#B5977A',
    fontFamily: 'Baloo2_700Bold',
    marginBottom: 8,
    marginTop: 12,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#FFF',
  },
  emotionImage: {
    width: 18,
    height: 18,
    marginRight: 6,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  emotionImageSelected: {
    opacity: 1,
  },
  emotionEmojiText: {
    fontSize: 14,
    marginRight: 6,
  },
  emotionName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Baloo2_400Regular',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_400Regular',
    backgroundColor: '#FAFAFA',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_400Regular',
    backgroundColor: '#FAFAFA',
    minHeight: 120,
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: MINT_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#EEF8F7',
  },
  imagePickerText: {
    fontSize: 14,
    color: MINT_COLOR,
    fontFamily: 'Baloo2_700Bold',
  },
  attachedImageWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  attachedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Baloo2_700Bold',
  },
  saveBtn: {
    backgroundColor: MINT_COLOR,
  },
  saveBtnText: {
    fontSize: 15,
    color: '#FFF',
    fontFamily: 'Baloo2_700Bold',
  },
});
