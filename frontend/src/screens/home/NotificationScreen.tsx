import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationItem {
  id: string;
  type: 'system' | 'roadmap' | 'diary_reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'diary_reminder',
    title: 'Nhắc nhở viết nhật ký!',
    message: 'Đừng quên ghi lại cảm xúc của cậu ngày hôm nay nhé.',
    timestamp: '2 giờ trước',
    isRead: false,
  },
  {
    id: '2',
    type: 'roadmap',
    title: 'Chúc mừng cậu!',
    message: 'Cậu đã hoàn thành xuất sắc lộ trình tuần 1. Hãy tiếp tục cố gắng nhé!',
    timestamp: 'Hôm qua',
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Ứng dụng vừa được nâng cấp với nhiều tính năng mới thú vị dành cho cậu.',
    timestamp: '3 ngày trước',
    isRead: true,
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'roadmap':
        return { name: 'flag', color: '#E67E22', bgColor: '#FDEBD0' };
      case 'diary_reminder':
        return { name: 'book', color: '#E74C3C', bgColor: '#FADBD8' };
      case 'system':
      default:
        return { name: 'settings', color: '#4ABEB2', bgColor: '#EEF8F7' };
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const iconConfig = getIconConfig(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead ? styles.cardUnread : styles.cardRead]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}>
          <Feather name={iconConfig.name as any} size={20} color={iconConfig.color} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell-off" size={60} color="#D1D5DB" style={{ marginBottom: 20 }} />
      <Text style={styles.emptyText}>Cậu không có thông báo nào mới!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer} pointerEvents="none">
          <Text style={styles.headerTitle}>Thông báo</Text>
        </View>

        {notifications.some(n => !n.isRead) ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.readAllButton}>
            <Text style={styles.readAllText}>Đã đọc tất cả</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  backButton: {
    padding: 5,
    zIndex: 10,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Baloo2_700Bold',
    color: '#1A1A2E',
  },
  readAllButton: {
    padding: 5,
    zIndex: 10,
  },
  placeholder: {
    width: 60,
  },
  readAllText: {
    fontSize: 13,
    color: '#4ABEB2',
    fontFamily: 'Baloo2_600SemiBold',
  },
  listContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  cardUnread: {
    backgroundColor: '#EEF8F7',
  },
  cardRead: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    color: '#333333',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontFamily: 'Baloo2_500Medium',
    color: '#666666',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Baloo2_400Regular',
    color: '#999999',
    marginTop: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ABEB2',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Baloo2_500Medium',
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
});
