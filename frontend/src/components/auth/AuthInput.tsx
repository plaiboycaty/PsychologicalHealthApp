import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface AuthInputProps extends TextInputProps {
  iconName: keyof typeof Feather.glyphMap;
  error?: string;
  isPassword?: boolean;
  passwordVisible?: boolean;
  togglePasswordVisible?: () => void;
}

export default function AuthInput({
  iconName,
  error,
  isPassword,
  passwordVisible,
  togglePasswordVisible,
  style,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          styles.shadowInput,
          error ? styles.inputErrorBorder : null,
        ]}
      >
        <Feather name={iconName as any} size={20} color={Colors.grayIcon} style={styles.inputIcon} />
        <TextInput
          style={[styles.textInput, style]}
          placeholderTextColor={Colors.grayPlaceholder}
          secureTextEntry={isPassword && !passwordVisible}
          {...props}
        />
        {isPassword && togglePasswordVisible && (
          <TouchableOpacity onPress={togglePasswordVisible} style={styles.eyeIconWrapper}>
            <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={20} color={Colors.grayIcon} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 15,
  },
  inputErrorBorder: {
    borderWidth: 1,
    borderColor: Colors.redLight,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'Baloo2_400Regular',
  },
  eyeIconWrapper: {
    padding: 5,
  },
  shadowInput: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 15,
  },
  errorText: {
    color: Colors.redLight,
    fontSize: 13,
    marginLeft: 20,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: 'Baloo2_400Regular',
  },
});

