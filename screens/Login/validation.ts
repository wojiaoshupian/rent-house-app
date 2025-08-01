import { Alert } from 'react-native';

export const validateLoginForm = (username: string, password: string): boolean => {
  if (!username.trim()) {
    Alert.alert('验证失败', '请输入用户名');
    return false;
  }
  if (!password.trim()) {
    Alert.alert('验证失败', '请输入密码');
    return false;
  }
  return true;
};
