import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const UsageScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const learningPaths = [
    {
      id: 1,
      title: 'React Native 基础',
      description: '学习移动应用开发基础',
      progress: 75,
      icon: '📱',
    },
    {
      id: 2,
      title: '状态管理',
      description: '掌握 Zustand 状态管理',
      progress: 60,
      icon: '🔄',
    },
    {
      id: 3,
      title: '响应式编程',
      description: '学习 RxJS 响应式编程',
      progress: 45,
      icon: '⚡',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: '开始注册',
      icon: '📝',
      description: '创建您的账户开始学习',
      onPress: () => navigation.navigate('Register'),
    },
    {
      id: 2,
      title: '查看库',
      icon: '📚',
      description: '浏览技术库和工具',
      onPress: () => {
        Alert.alert(
          '提示',
          '请点击底部的"库"标签页查看所有库演示，或者点击下方的"综合库演示"查看详细内容。',
          [
            { text: '取消', style: 'cancel' },
            { text: '查看演示', onPress: () => navigation.navigate('LibraryDemo') },
          ]
        );
      },
    },
    {
      id: 3,
      title: '个人中心',
      icon: '👤',
      description: '管理您的学习进度',
      onPress: () => {
        Alert.alert('提示', '请点击底部的"我的"标签页查看个人信息，或者先注册一个账户。', [
          { text: '取消', style: 'cancel' },
          { text: '去注册', onPress: () => navigation.navigate('Register') },
        ]);
      },
    },
  ];

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
          <View className="mb-6 grid grid-cols-1 gap-4">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm"
                onPress={action.onPress}>
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Text className="text-2xl">{action.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-gray-800">{action.title}</Text>
                  <Text className="text-xs text-gray-500">{action.description}</Text>
                </View>
                <Text className="text-base text-gray-500">→</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Learning Paths */}
          <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold text-gray-800">学习路径</Text>
            {learningPaths.map((path, index) => (
              <View
                key={path.id}
                className={`mb-4 ${
                  index === learningPaths.length - 1 ? '' : 'border-b border-gray-100 pb-4'
                }`}>
                <View className="mb-2 flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Text className="text-lg">{path.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">{path.title}</Text>
                    <Text className="text-xs text-gray-500">{path.description}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-blue-500">{path.progress}%</Text>
                </View>
                <View className="h-2 rounded-full bg-gray-200">
                  <View
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${path.progress}%` }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <Text className="mb-2 text-lg font-semibold text-blue-800">学习建议</Text>
            <View className="space-y-2">
              <Text className="text-sm text-blue-700">• 注册账户以保存学习进度</Text>
              <Text className="text-sm text-blue-700">• 每天保持学习习惯</Text>
              <Text className="text-sm text-blue-700">• 实践是最好的学习方式</Text>
              <Text className="text-sm text-blue-700">• 遇到问题及时寻求帮助</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
