import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { userApi } from '../services/userApi';

const formatDateToDisplay = (isoString: string) => {
  if (!isoString) return '';
  try {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return isoString;

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoString;
  }
};

const parseDateToSave = (displayDate: string) => {
  if (!displayDate) return undefined;
  const parts = displayDate.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return displayDate;
};

export const usePersonalInfo = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setName(data.full_name || '');
        setEmail(data.email || '');
        setGender(data.gender || '');
        setBirthday(formatDateToDisplay(data.dob || ''));
        setAvatarUri(data.avatar_url || null);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên không được để trống');
      return;
    }
    setSaving(true);
    try {
      await userApi.updateProfile({
        full_name: name.trim(),
        gender: gender.trim(),
        dob: parseDateToSave(birthday.trim()),
        avatar_url: avatarUri || undefined,
      });
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Lỗi', e.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    email,
    gender,
    setGender,
    birthday,
    setBirthday,
    avatarUri,
    loading,
    saving,
    pickImage,
    handleSave,
    navigation,
  };
};
