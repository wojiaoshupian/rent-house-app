import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { userService, RegisterRequest } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // 手机号验证正则表达式
  const phoneRegex = /^1[3-9]\d{9}$/;

  const validatePhone = (phoneNumber: string): boolean => {
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = (): boolean => {
    if (!username.trim()) {
      Alert.alert('错误', '请输入用户名');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('错误', '请输入密码');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('错误', '密码长度至少6位');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('错误', '请输入手机号');
      return false;
    }
    if (!validatePhone(phone.trim())) {
      Alert.alert('错误', '请输入正确的手机号格式');
      return false;
    }
    if (!confirmPhone.trim()) {
      Alert.alert('错误', '请确认手机号');
      return false;
    }
    if (phone.trim() !== confirmPhone.trim()) {
      Alert.alert('错误', '两次输入的手机号不一致');
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    setLoading(true);

    const registerData: RegisterRequest = {
      username: username.trim(),
      password: password,
      phone: phone.trim(),
      roles: ['USER'],
    };

    // 使用封装好的用户服务
    userService
      .register(registerData)
      .pipe(
        catchError((error) => {
          console.error('注册失败:', error);
          const errorMessage = error.message || '注册失败，请重试';
          Alert.alert('注册失败', errorMessage);
          return of(null);
        })
      )
      .subscribe({
        next: (user) => {
          setLoading(false);
          if (user) {
            // 将用户信息存储到 Context 中
            setUser(user);
            console.log('👤 用户信息已存储到 Context:', user);

            Alert.alert('注册成功', `用户 ${user.username} 注册成功！`, [
              {
                text: '确定',
                onPress: () => navigation.goBack(),
              },
            ]);
            // 清空表单
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setPhone('');
            setConfirmPhone('');
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
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">用户注册</Text>
          <Text className="text-base text-gray-500">创建您的账户</Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <View className="mb-6 rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-xl font-bold text-gray-800">注册信息</Text>

            {/* Username */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">用户名 *</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
                placeholder="请输入用户名"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">手机号 *</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
                placeholder="请输入手机号"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
              {phone && !validatePhone(phone) && (
                <Text className="mt-1 text-xs text-red-500">请输入正确的手机号格式</Text>
              )}
            </View>

            {/* Confirm Phone */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">确认手机号 *</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
                placeholder="请再次输入手机号"
                value={confirmPhone}
                onChangeText={setConfirmPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
              {confirmPhone && phone !== confirmPhone && (
                <Text className="mt-1 text-xs text-red-500">两次输入的手机号不一致</Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">密码 *</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
                placeholder="请输入密码（至少6位）"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-gray-700">确认密码 *</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              {confirmPassword && password !== confirmPassword && (
                <Text className="mt-1 text-xs text-red-500">两次输入的密码不一致</Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`items-center rounded-xl py-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
              onPress={handleRegister}
              disabled={loading}>
              <Text className="text-base font-semibold text-white">
                {loading ? '注册中...' : '注册'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <Text className="mb-2 text-lg font-semibold text-blue-800">注册说明</Text>
            <View className="space-y-2">
              <Text className="text-sm text-blue-700">• 用户名不能为空</Text>
              <Text className="text-sm text-blue-700">• 手机号必须是11位数字</Text>
              <Text className="text-sm text-blue-700">• 需要确认手机号以确保正确性</Text>
              <Text className="text-sm text-blue-700">• 密码长度至少6位</Text>
              <Text className="text-sm text-blue-700">• 默认注册角色为USER</Text>
              <Text className="text-sm text-blue-700">• 注册成功后自动返回上一页</Text>
            </View>
          </View>

          {/* Back Button */}
          <View className="mt-6">
            <TouchableOpacity
              className="items-center rounded-xl bg-gray-500 py-4"
              onPress={() => navigation.goBack()}>
              <Text className="text-base font-semibold text-white">返回</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
