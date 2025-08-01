import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RegisterLinkProps {
  onNavigateToRegister: () => void;
}

export const RegisterLink: React.FC<RegisterLinkProps> = ({ onNavigateToRegister }) => {
  return (
    <View className="bg-white rounded-xl p-6 shadow-sm">
      <View className="flex-row items-center justify-center">
        <Text className="text-gray-600 mr-2">还没有账户？</Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text className="text-blue-500 font-medium">立即注册</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
