import { Alert } from 'react-native';

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  confirmPhone: string;
}

// 手机号验证正则表达式
const phoneRegex = /^1[3-9]\d{9}$/;

export const validatePhone = (phoneNumber: string): boolean => {
  return phoneRegex.test(phoneNumber);
};

export const validateRegisterForm = (formData: RegisterFormData): boolean => {
  if (!formData.username.trim()) {
    Alert.alert('错误', '请输入用户名');
    return false;
  }
  if (!formData.password.trim()) {
    Alert.alert('错误', '请输入密码');
    return false;
  }
  if (formData.password.length < 6) {
    Alert.alert('错误', '密码长度至少6位');
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    Alert.alert('错误', '两次输入的密码不一致');
    return false;
  }
  if (!formData.phone.trim()) {
    Alert.alert('错误', '请输入手机号');
    return false;
  }
  if (!validatePhone(formData.phone.trim())) {
    Alert.alert('错误', '请输入正确的手机号格式');
    return false;
  }
  if (!formData.confirmPhone.trim()) {
    Alert.alert('错误', '请确认手机号');
    return false;
  }
  if (formData.phone.trim() !== formData.confirmPhone.trim()) {
    Alert.alert('错误', '两次输入的手机号不一致');
    return false;
  }
  return true;
};
