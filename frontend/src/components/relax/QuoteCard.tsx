import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MINT_COLOR = '#66C5BA';

export default function QuoteCard() {
  return (
    <View style={styles.quoteCard}>
      <MaterialCommunityIcons name="format-quote-open" size={40} color={MINT_COLOR} style={{ opacity: 0.3 }} />
      <Text style={styles.quoteText}>
        Bạn đã làm rất tốt rồi, hãy thả lỏng bờ vai và cho phép bản thân nghỉ ngơi một chút nhé.
      </Text>
      <MaterialCommunityIcons name="format-quote-close" size={40} color={MINT_COLOR} style={{ opacity: 0.3, alignSelf: 'flex-end' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Baloo2_600SemiBold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    marginVertical: -15,
  },
});
