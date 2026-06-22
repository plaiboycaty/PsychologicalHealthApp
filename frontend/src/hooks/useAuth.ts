import { useState, useCallback } from 'react';
import { Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../services/authApi';
import { validateLoginForm, validateRegisterForm } from '../utils/validators';

export const useLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const loginAction = useAuthStore((state) => state.login);

  const handleLogin = useCallback(async () => {
    Keyboard.dismiss();
    const newErrors = validateLoginForm(email, password);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response: { token: string; user: any } = await authApi.login(email, password) as any;
      // Backend trả về message, token, user
      loginAction(response.token, response.user);
    } catch (err) {
      const e = err as any;
      const message = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, loginAction]);

  const handleGuestLogin = useCallback(() => {
    loginAction('guest-token', {
      id: 0,
      email: 'guest@app.com',
      full_name: 'Khách Ẩn Danh',
      gender: 'Other',
      dob: '2000-01-01',
      avatar_url: undefined,
      treatment_status: 'none',
      status: 'active',
      role: 'guest',
    });
  }, [loginAction]);

  const togglePasswordVisible = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const changeEmail = useCallback((text: string) => {
    setEmail(text);
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const changePassword = useCallback((text: string) => {
    setPassword(text);
    setErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  return {
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
  };
};

export const useRegister = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(async () => {
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
    } catch (err) {
      const e = err as any;
      const message = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, password, confirmPassword, gender, dob, navigation]);

  const togglePasswordVisible = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisible = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const changeFullName = useCallback((text: string) => {
    setFullName(text);
    setErrors((prev) => ({ ...prev, fullName: undefined }));
  }, []);

  const changeEmail = useCallback((text: string) => {
    setEmail(text);
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const changePassword = useCallback((text: string) => {
    setPassword(text);
    setErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  const changeConfirmPassword = useCallback((text: string) => {
    setConfirmPassword(text);
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  }, []);

  const changeGender = useCallback((val: string) => {
    setGender(val);
    setErrors((prev) => ({ ...prev, gender: undefined }));
  }, []);

  const changeDob = useCallback((text: string) => {
    setDob(text);
    setErrors((prev) => ({ ...prev, dob: undefined }));
  }, []);

  return {
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
  };
};
