import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { userService, LoginRequest } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import { catchError, of } from 'rxjs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 表单验证
  const validateForm = (): boolean => {
    if (!username.trim()) {
      Alert.alert('验证失败', '请输入用户名');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('验证失败', '请输入密码');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('验证失败', '密码长度不能少于6位');
      return false;
    }
    return true;
  };

  // 提交登录
  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);

    const loginData: LoginRequest = {
      username: username.trim(),
      password: password.trim(),
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
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Text className="text-3xl text-white">🔐</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-gray-800">用户登录</Text>
          <Text className="text-center text-gray-600">请输入您的账户信息</Text>
        </View>

        {/* Login Form */}
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">用户名</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="请输入用户名"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">密码</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`rounded-lg py-4 mb-4 ${
              loading ? 'bg-gray-400' : 'bg-blue-500'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-2 text-base">登录中...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base">登录</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity className="items-center">
            <Text className="text-blue-500 text-sm">忘记密码？</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 mr-2">还没有账户？</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-blue-500 font-medium">立即注册</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Info */}
        <View className="mt-6 bg-blue-50 rounded-xl p-4">
          <Text className="text-blue-800 text-sm text-center font-medium mb-2">
            演示提示
          </Text>
          <Text className="text-blue-700 text-xs text-center">
            这是一个演示应用，登录接口为 /api/auth/login
          </Text>
          <Text className="text-blue-700 text-xs text-center">
            请求字段：username 和 password
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
