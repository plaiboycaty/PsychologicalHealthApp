import React, { useState } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth.store';
import { validateRegisterForm } from '../../utils/validators';
import AuthInput from '../../components/auth/AuthInput';
import { authApi } from '../../services/authApi';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const mintColor = '#66C5BA';

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const loginAction = useAuthStore((state) => state.login);

  const handleRegister = async () => {
    Keyboard.dismiss();

    const newErrors = validateRegisterForm(fullName, email, password, confirmPassword, gender, dob);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const dobParts = dob.split('/');
    const apiDob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

    setIsLoading(true);
    try {
      await authApi.register({
        full_name: fullName,
        email,
        password,
        gender: gender || 'Other',
        dob: apiDob,
      });

      Alert.alert(
        'Đăng ký thành công',
        'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setIsLoading(false);
    }
  };

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
                  onChangeText={(text) => {
                    setFullName(text);
                    setErrors({ ...errors, fullName: undefined });
                  }}
                  error={errors.fullName}
                />

                {/* 2. E-mail */}
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

                {/* 3. Mật khẩu */}
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

                {/* 4. Xác nhận mật khẩu */}
                <AuthInput
                  iconName="lock"
                  placeholder="Xác nhận mật khẩu"
                  isPassword
                  passwordVisible={confirmPasswordVisible}
                  togglePasswordVisible={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  error={errors.confirmPassword}
                />

                {/* 5. Giới tính */}
                <View style={[styles.inputWrapper, styles.shadowInput, errors.gender ? styles.inputErrorBorder : null]}>
                  <Feather name="users" size={20} color="#999" style={styles.inputIcon} />
                  <Text style={styles.genderLabel}>Giới tính</Text>

                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => { setGender('Male'); setErrors({ ...errors, gender: undefined }); }}
                      style={[styles.genderOption, gender === 'Male' && styles.genderOptionActive]}
                    >
                      <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Nam</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => { setGender('Female'); setErrors({ ...errors, gender: undefined }); }}
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
                  onChangeText={(text) => {
                    setDob(text);
                    setErrors({ ...errors, dob: undefined });
                  }}
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
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Baloo2_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
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
    borderColor: '#FF7675',
  },
  errorText: {
    color: '#FF7675',
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
    color: '#BDBDBD',
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
    backgroundColor: '#F5F7FA',
  },
  genderOptionActive: {
    backgroundColor: '#66C5BA',
  },
  genderText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
  },
  genderTextActive: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#66C5BA',
    borderRadius: 30,
    paddingVertical: 14,
    width: '60%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#66C5BA',
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
    color: '#000',
    fontSize: 16,
    fontFamily: 'Baloo2_400Regular',
  },
  loginLink: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Baloo2_700Bold',
  },
});
