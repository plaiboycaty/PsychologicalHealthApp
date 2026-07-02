import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmergencyContactProps {
  name: string;
  desc: string;
  phone: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

export default function EmergencyContact({ 
  name, 
  desc, 
  phone, 
  iconName, 
  iconColor, 
  bgColor 
}: EmergencyContactProps) {
  return (
    <View style={styles.supportCard}>
      <View style={styles.supportInfo}>
        <View style={styles.supportIconBg}>
          <Ionicons name={iconName as any} size={24} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.supportName}>{name}</Text>
          <Text style={styles.supportDesc}>{desc}</Text>
        </View>
      </View>
      <View style={styles.supportActions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: bgColor }]} 
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Ionicons name="call" size={20} color={iconColor} />
          <Text style={[styles.actionBtnText, { color: iconColor }]}>Gọi Ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  supportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  supportIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportName: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#333',
  },
  supportDesc: {
    fontSize: 13,
    fontFamily: 'Baloo2_400Regular',
    color: '#888',
    marginTop: 2,
  },
  supportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    marginLeft: 6,
  },
});
