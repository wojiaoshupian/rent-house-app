import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { userService, RegisterRequest } from '../services/userService';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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
      roles: ['USER']
    };

    // 使用封装好的用户服务
    userService.register(registerData)
      .pipe(
        catchError(error => {
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
            console.log('注册成功:', user);
            Alert.alert(
              '注册成功', 
              `用户 ${user.username} 注册成功！`,
              [
                {
                  text: '确定',
                  onPress: () => navigation.goBack()
                }
              ]
            );
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
        }
      });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            用户注册
          </Text>
          <Text className="text-gray-500 text-base">
            创建您的账户
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              注册信息
            </Text>
            
            {/* Username */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                用户名 *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                placeholder="请输入用户名"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                手机号 *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                placeholder="请输入手机号"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
              {phone && !validatePhone(phone) && (
                <Text className="text-red-500 text-xs mt-1">
                  请输入正确的手机号格式
                </Text>
              )}
            </View>

            {/* Confirm Phone */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                确认手机号 *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                placeholder="请再次输入手机号"
                value={confirmPhone}
                onChangeText={setConfirmPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
              {confirmPhone && phone !== confirmPhone && (
                <Text className="text-red-500 text-xs mt-1">
                  两次输入的手机号不一致
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                密码 *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                placeholder="请输入密码（至少6位）"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                确认密码 *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              {confirmPassword && password !== confirmPassword && (
                <Text className="text-red-500 text-xs mt-1">
                  两次输入的密码不一致
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-base font-semibold">
                {loading ? '注册中...' : '注册'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-lg font-semibold text-blue-800 mb-2">
              注册说明
            </Text>
            <View className="space-y-2">
              <Text className="text-sm text-blue-700">
                • 用户名不能为空
              </Text>
              <Text className="text-sm text-blue-700">
                • 手机号必须是11位数字
              </Text>
              <Text className="text-sm text-blue-700">
                • 需要确认手机号以确保正确性
              </Text>
              <Text className="text-sm text-blue-700">
                • 密码长度至少6位
              </Text>
              <Text className="text-sm text-blue-700">
                • 默认注册角色为USER
              </Text>
              <Text className="text-sm text-blue-700">
                • 注册成功后自动返回上一页
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <View className="mt-6">
            <TouchableOpacity
              className="bg-gray-500 rounded-xl py-4 items-center"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-base font-semibold">
                返回
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}; 