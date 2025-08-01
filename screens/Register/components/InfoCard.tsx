import React from 'react';
import { View, Text } from 'react-native';

export const InfoCard: React.FC = () => {
  return (
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
  );
};
