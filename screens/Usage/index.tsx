import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const UsageScreen = () => {
  const navigation = useNavigation<NavigationProp>();



  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">学习中心</Text>
          <Text className="text-base text-gray-500">选择您的学习路径</Text>
        </View>

        {/* Quick Actions */}
        <View className="p-5">
          <Text className="mb-4 text-xl font-bold text-gray-800">快速开始</Text>
         
        </View>
      </ScrollView>
    </View>
  );
};
