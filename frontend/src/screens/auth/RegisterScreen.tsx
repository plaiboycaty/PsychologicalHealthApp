import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Feather } from '@expo/vector-icons';
import AuthInput from '../../components/auth/AuthInput';
import { useRegister } from '../../hooks/useAuth';
import { Colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    fullName,
    email,
    password,
    confirmPassword,
    gender,
    dob,
    passwordVisible,
    confirmPasswordVisible,
    errors,
    isLoading,
    changeFullName,
    changeEmail,
    changePassword,
    changeConfirmPassword,
    changeGender,
    changeDob,
    togglePasswordVisible,
    toggleConfirmPasswordVisible,
    handleRegister,
  } = useRegister();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../../assets/images/background/background.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          <KeyboardAvoidingView
            behavior="padding"
            style={styles.flexContainer}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.title}>Đăng ký</Text>
                <Text style={styles.subtitle}>Hãy tìm hiểu bạn nhiều hơn</Text>

                {/* 1. Họ và tên */}
                <AuthInput
                  iconName="user"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChangeText={changeFullName}
                  error={errors.fullName}
                />

                {/* 2. E-mail */}
                <AuthInput
                  iconName="mail"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={changeEmail}
                  error={errors.email}
                />

                {/* 3. Mật khẩu */}
                <AuthInput
                  iconName="lock"
                  placeholder="Mật khẩu"
                  isPassword
                  passwordVisible={passwordVisible}
                  togglePasswordVisible={togglePasswordVisible}
                  value={password}
                  onChangeText={changePassword}
                  error={errors.password}
                />

                {/* 4. Xác nhận mật khẩu */}
                <AuthInput
                  iconName="lock"
                  placeholder="Xác nhận mật khẩu"
                  isPassword
                  passwordVisible={confirmPasswordVisible}
                  togglePasswordVisible={toggleConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={changeConfirmPassword}
                  error={errors.confirmPassword}
                />

                {/* 5. Giới tính */}
                <View style={[styles.inputWrapper, styles.shadowInput, errors.gender ? styles.inputErrorBorder : null]}>
                  <Feather name="users" size={20} color={Colors.grayIcon} style={styles.inputIcon} />
                  <Text style={styles.genderLabel}>Giới tính</Text>

                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => changeGender('Male')}
                      style={[styles.genderOption, gender === 'Male' && styles.genderOptionActive]}
                    >
                      <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Nam</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => changeGender('Female')}
                      style={[styles.genderOption, gender === 'Female' && styles.genderOptionActive]}
                    >
                      <Text style={[styles.genderText, gender === 'Female' && styles.genderTextActive]}>Nữ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                {/* 6. Sinh nhật */}
                <AuthInput
                  iconName="calendar"
                  placeholder="Sinh nhật (DD/MM/YYYY)"
                  value={dob}
                  onChangeText={changeDob}
                  error={errors.dob}
                />

                {/* Nút Đăng ký */}
                <TouchableOpacity
                  style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  )}
                </TouchableOpacity>

                {/* Quay lại Đăng nhập */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Đã có tài khoản? </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginLink}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: Colors.blackText,
    textAlign: 'center',
    fontFamily: 'Baloo2_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grayIcon,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Baloo2_400Regular',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 20,
  },
  inputErrorBorder: {
    borderWidth: 1,
    borderColor: Colors.redLight,
  },
  errorText: {
    color: Colors.redLight,
    fontSize: 13,
    marginLeft: 20,
    marginTop: -15,
    marginBottom: 15,
    fontFamily: 'Baloo2_400Regular',
  },
  inputIcon: {
    marginRight: 10,
  },
  genderLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.grayPlaceholder,
    fontFamily: 'Baloo2_400Regular',
  },
  shadowInput: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 15,
  },
  genderOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: Colors.grayInputBg,
  },
  genderOptionActive: {
    backgroundColor: Colors.mintLight,
  },
  genderText: {
    color: Colors.grayIcon,
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
  },
  genderTextActive: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: Colors.mintLight,
    borderRadius: 30,
    paddingVertical: 14,
    width: '60%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: Colors.mintLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: Colors.blackText,
    fontSize: 16,
    fontFamily: 'Baloo2_400Regular',
  },
  loginLink: {
    color: Colors.blackText,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Baloo2_700Bold',
  },
});

