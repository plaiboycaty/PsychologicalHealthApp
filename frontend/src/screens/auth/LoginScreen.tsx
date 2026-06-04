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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import AuthInput from '../../components/auth/AuthInput';
import { useLogin } from '../../hooks/useAuth';
import { Colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    email,
    password,
    passwordVisible,
    errors,
    isLoading,
    changeEmail,
    changePassword,
    togglePasswordVisible,
    handleLogin,
    handleGuestLogin,
  } = useLogin();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../../assets/images/background/background.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <SafeAreaView style={styles.container}>
          {/* Layout dùng chung cho cả iOS và Android */}
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.flexContainer}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Tiếp tục hành trình chữa lành của bạn
              </Text>


              {/* Email */}
              <AuthInput
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={changeEmail}
                error={errors.email}
              />

              {/* Password */}
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

              {/* Quên mật khẩu */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleGuestLogin} style={styles.guestButton}>
                <Text style={styles.guestButtonText}>Tiếp tục dưới quyền Khách</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Không có tài khoản ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: 'transparent', // iOS: tránh nền trắng đè lên ImageBackground
  },
  flexContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: Colors.blackText,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Baloo2_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grayDark,
    textAlign: 'center',
    marginBottom: 50,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 35,
  },
  forgotPasswordText: {
    color: Colors.grayPlaceholder,
    fontSize: 14,
    fontFamily: 'Baloo2_400Regular',
  },
  loginButton: {
    backgroundColor: Colors.mintLight,
    borderRadius: 30,
    paddingVertical: 14,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: Colors.mintLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
  },
  guestButton: {
    alignItems: 'center',
    marginBottom: 35,
  },
  guestButtonText: {
    color: Colors.mintLight,
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: Colors.blackText,
    fontSize: 16,
    fontFamily: 'Baloo2_400Regular',
  },
  registerLink: {
    color: Colors.blackText,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Baloo2_700Bold',
  },
});