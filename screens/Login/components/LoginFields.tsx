import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LoginFieldsProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
  loading: boolean;
}

export const LoginFields: React.FC<LoginFieldsProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  onLogin,
  loading,
}) => {
  return (
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
        onPress={onLogin}
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
  );
};
