import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Option {
  id?: number;
  option_id?: number;
  content: string;
  score: number;
}

interface OptionsListProps {
  options: Option[];
  selectedOptionId: number | undefined;
  onSelectOption: (optionId: number) => void;
}

const mintColor = '#4ABEB2';

export default function OptionsList({
  options,
  selectedOptionId,
  onSelectOption,
}: OptionsListProps) {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option) => {
        const oId = option.id ?? option.option_id;
        const isSelected = selectedOptionId === oId;
        return (
          <TouchableOpacity
            key={oId}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonActive
            ]}
            onPress={() => onSelectOption(oId as number)}
            activeOpacity={0.8}
          >
            <Text style={styles.optionText}>
              {option.content}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: mintColor,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: '#000000',
    lineHeight: 22,
  },
});
