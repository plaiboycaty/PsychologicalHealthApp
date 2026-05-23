import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuthStore } from '../../store/auth.store';
import { validateLoginForm } from '../../utils/validators';
import AuthInput from '../../components/auth/AuthInput';
import { authApi } from '../../services/authApi';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const mintColor = '#66C5BA';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const loginAction = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    Keyboard.dismiss();
    const newErrors = validateLoginForm(email, password);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response: any = await authApi.login(email, password);
      // Backend trả về message, token, user
      loginAction(response.token, response.user);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAction('guest-token', {
      id: 0,
      email: 'guest@app.com',
      full_name: 'Khách Ẩn Danh',
      gender: 'Other',
      dob: '1900-01-01',
      avatar_url: undefined,
      treatment_status: 'none',
    });
  };

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
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: undefined });
                }}
                error={errors.email}
              />

              {/* Password */}
              <AuthInput
                iconName="lock"
                placeholder="Mật khẩu"
                isPassword
                passwordVisible={passwordVisible}
                togglePasswordVisible={() => setPasswordVisible(!passwordVisible)}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
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
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Baloo2_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    borderColor: '#FF7675',
  },
  errorText: {
    color: '#FF7675',
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
    color: '#333',
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
    color: '#BDBDBD',
    fontSize: 14,
    fontFamily: 'Baloo2_400Regular',
  },
  loginButton: {
    backgroundColor: mintColor,
    borderRadius: 30,
    paddingVertical: 14,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: mintColor,
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
    color: mintColor,
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Baloo2_400Regular',
  },
  registerLink: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Baloo2_700Bold',
  },
});