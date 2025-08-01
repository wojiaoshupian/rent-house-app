import React from 'react';
import { View, Text } from 'react-native';

export const LoginHeader: React.FC = () => {
  return (
    <View className="mb-8 items-center">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500 shadow-lg">
        <Text className="text-3xl text-white">🔐</Text>
      </View>
      <Text className="mb-2 text-3xl font-bold text-gray-800">用户登录</Text>
      <Text className="text-center text-gray-600">请输入您的账户信息</Text>
    </View>
  );
};
