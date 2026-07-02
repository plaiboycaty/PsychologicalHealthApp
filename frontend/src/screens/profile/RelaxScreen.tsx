import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuoteCard from '../../components/relax/QuoteCard';
import AudioPlayer from '../../components/relax/AudioPlayer';
import EmergencyContact from '../../components/relax/EmergencyContact';

const BG_COLOR = '#FAFAFA';

export default function RelaxScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer} pointerEvents="none">
          <Text style={styles.headerTitle}>Thư giãn</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>


        <QuoteCard />


        <Text style={styles.sectionTitle}>Không gian tĩnh lặng</Text>
        <Text style={styles.sectionSubtitle}>Hãy chọn một âm thanh để xoa dịu tâm trí bạn.</Text>

        <AudioPlayer />


        <View style={{ height: 20 }} />
        <Text style={styles.sectionTitle}>Cần sự lắng nghe chuyên sâu?</Text>
        <Text style={styles.sectionSubtitle}>Đừng chịu đựng một mình. Hãy liên hệ với những người có thể giúp đỡ bạn.</Text>

        <EmergencyContact
          name="Đường Dây Nóng Ngày Mai"
          desc="Hỗ trợ sức khỏe tinh thần"
          phone="0963061414"
          iconName="medkit"
          iconColor="#E63946"
          bgColor="#EEF8F7"
        />

        <EmergencyContact
          name="Viện Sức khỏe Tâm thần Bạch Mai"
          desc="Khám & Tư vấn tâm lý"
          phone="02438522087"
          iconName="business"
          iconColor="#4A90E2"
          bgColor="#F0F8FF"
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
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
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Baloo2_400Regular',
    color: '#666',
    marginBottom: 16,
  },
});
