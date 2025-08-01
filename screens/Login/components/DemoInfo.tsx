import React from 'react';
import { View, Text } from 'react-native';

export const DemoInfo: React.FC = () => {
  return (
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
  );
};
