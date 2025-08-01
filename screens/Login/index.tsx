import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { userService, LoginRequest } from '../../services/userService';
import { useUser } from '../../contexts/UserContext';
import { catchError, of } from 'rxjs';
import { LoginForm } from './LoginForm';
import { validateLoginForm } from './validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 处理登录
  const handleLogin = () => {
    if (!validateLoginForm(username, password)) return;

    setLoading(true);

    const loginData: LoginRequest = {
      username: username.trim(),
      password: password,
    };

    userService
      .login(loginData)
      .pipe(
        catchError((error) => {
          console.error('登录失败:', error);
          const errorMessage = error.message || '登录失败，请重试';
          Alert.alert('登录失败', errorMessage);
          return of(null);
        })
      )
      .subscribe({
        next: (loginResponse) => {
          setLoading(false);
          if (loginResponse && loginResponse.user) {
            // 存储用户信息到 Context
            setUser(loginResponse.user);
            console.log('👤 用户登录成功，信息已存储到 Context:', loginResponse.user);

            Alert.alert('登录成功', `欢迎回来，${loginResponse.user.username || '用户'}！`, [
              {
                text: '确定',
                onPress: () => navigation.goBack(),
              },
            ]);

            // 清空表单
            setUsername('');
            setPassword('');
          } else {
            Alert.alert('登录失败', '服务器返回的数据格式不正确');
          }
        },
        error: (error) => {
          console.error('RxJS错误:', error);
          setLoading(false);
          Alert.alert('错误', '网络请求失败，请检查网络连接');
        },
      });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        onLogin={handleLogin}
        loading={loading}
        onNavigateToRegister={() => navigation.navigate('Register')}
      />
    </View>
  );
};
