import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth.store';

interface GuestPlaceholderProps {
  featureName: string;
}

const mintColor = '#4ABEB2';

export default function GuestPlaceholder({ featureName }: GuestPlaceholderProps) {
  const { logout } = useAuthStore();

  const handleLoginPress = () => {
    // Khi gọi logout, store sẽ xoá token và isAuthenticated = false
    // -> AppNavigator tự động fallback về AuthStack (Màn Login/Onboarding)
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed-outline" size={80} color={mintColor} />
      </View>
      
      <Text style={styles.title}>Bạn đang dùng quyền Khách</Text>
      
      <Text style={styles.message}>
        Tính năng <Text style={styles.highlight}>{featureName}</Text> yêu cầu lưu trữ dữ liệu cá nhân hóa. Vui lòng đăng nhập hoặc tạo tài khoản để sử dụng nhé!
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLoginPress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#FAFAFA',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E6F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: mintColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Baloo2_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Baloo2_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  highlight: {
    fontFamily: 'Baloo2_700Bold',
    color: mintColor,
  },
  button: {
    backgroundColor: mintColor,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: mintColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
