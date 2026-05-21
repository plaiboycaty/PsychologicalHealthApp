import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { DiaryEntry } from './DiaryCard';
import { MOCK_EMOTIONS } from '../../constants/mock-data';

const { width, height } = Dimensions.get('window');
const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FFF8F0';

interface DiaryDetailModalProps {
  visible: boolean;
  item: DiaryEntry | null;
  onClose: () => void;
  onEdit: (item: DiaryEntry) => void;
  onDelete: (id: number) => void;
}

function formatDate(isoString: string): string {
  if (!isoString) return '';
  let date: Date;
  if (isoString.includes('T') && !isoString.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(isoString)) {
    date = new Date(isoString.replace('T', ' '));
  } else {
    date = new Date(isoString);
  }
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ` lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export default function DiaryDetailModal({
  visible,
  item,
  onClose,
  onEdit,
  onDelete,
}: DiaryDetailModalProps) {
  if (!item) return null;

  const emotion = MOCK_EMOTIONS.find(e => e.id === item.emotion_id);
  const emotionColor = emotion?.color ?? '#BDBDBD';
  const emotionIcon = emotion?.icon;

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

        <View style={styles.modalContainer}>
          {/* Ảnh tiêu đề (nếu có) */}
          {item.image_url ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image_url }} style={styles.topImage} />
              <TouchableOpacity style={styles.closeFloatBtn} onPress={onClose}>
                <Ionicons name="close" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.simpleHeader}>
              <Text style={styles.simpleHeaderLabel}>Chi tiết nhật ký</Text>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color="#2D2D2D" />
              </TouchableOpacity>
            </View>
          )}

          {/* Nội dung chính */}
          <ScrollView
            style={styles.scrollBlock}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Meta: Ngày giờ + Cảm xúc */}
            <View style={styles.metaRow}>
              <View style={styles.dateBlock}>
                <Feather name="calendar" size={13} color="#888" style={{ marginRight: 5 }} />
                <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
              </View>

              <View style={[styles.emotionBadge, { borderColor: emotionColor }]}>
                {!emotionIcon ? (
                  <Text style={styles.emotionEmojiText}>😐</Text>
                ) : typeof emotionIcon === 'string' ? (
                  <Text style={styles.emotionEmojiText}>{emotionIcon}</Text>
                ) : (
                  <Image source={emotionIcon} style={styles.emotionImage} />
                )}
                <Text style={[styles.emotionText, { color: emotionColor }]}>
                  {item.emotion_name}
                </Text>
              </View>
            </View>

            <Text style={styles.titleText}>{item.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.contentText}>{item.content}</Text>
          </ScrollView>

          {/* Nút bấm hành động */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.footerBtn, styles.deleteBtn]} onPress={() => onDelete(item.id)}>
              <Feather name="trash-2" size={18} color="#EB5757" style={{ marginRight: 6 }} />
              <Text style={styles.deleteBtnText}>Xóa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.footerBtn, styles.editBtn]} onPress={() => onEdit(item)}>
              <Feather name="edit-3" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.editBtnText}>Sửa</Text>
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
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeFloatBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  simpleHeaderLabel: {
    fontSize: 16,
    color: '#B5977A',
    fontFamily: 'Baloo2_700Bold',
  },
  scrollBlock: {
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Baloo2_400Regular',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFF',
  },
  emotionImage: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  emotionEmojiText: {
    fontSize: 13,
    marginRight: 4,
  },
  emotionText: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
  },
  titleText: {
    fontSize: 20,
    color: '#2D2D2D',
    fontFamily: 'Baloo2_700Bold',
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  contentText: {
    fontSize: 15,
    color: '#4F4F4F',
    fontFamily: 'Baloo2_400Regular',
    lineHeight: 24,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EB5757',
    marginRight: 10,
  },
  deleteBtnText: {
    fontSize: 15,
    color: '#EB5757',
    fontFamily: 'Baloo2_700Bold',
  },
  editBtn: {
    backgroundColor: MINT_COLOR,
  },
  editBtnText: {
    fontSize: 15,
    color: '#FFF',
    fontFamily: 'Baloo2_700Bold',
  },
});
