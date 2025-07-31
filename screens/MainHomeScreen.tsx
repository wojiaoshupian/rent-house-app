import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MainHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const quickActions = [
    {
      id: 1,
      title: '开始学习',
      icon: '📚',
      description: '探索我们的学习资源',
      onPress: () => navigation.navigate('Usage'),
    },
    {
      id: 2,
      title: '用户注册',
      icon: '📝',
      description: '创建您的账户',
      onPress: () => navigation.navigate('Register'),
    },
    {
      id: 3,
      title: '技术库',
      icon: '🔧',
      description: '查看技术栈和工具',
      onPress: () => navigation.navigate('Library'),
    },
    {
      id: 4,
      title: '个人中心',
      icon: '👤',
      description: '管理您的账户',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  const recentActivity = [
    { id: 1, title: 'Zustand 状态管理', time: '2小时前', type: '学习' },
    { id: 2, title: 'RxJS 响应式编程', time: '1天前', type: '实践' },
    { id: 3, title: 'Lodash 工具库', time: '3天前', type: '学习' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">欢迎回来</Text>
          <Text className="text-base text-gray-500">今天想学习什么？</Text>
        </View>

        {/* Quick Actions */}
        <View className="p-5">
          <Text className="mb-4 text-xl font-bold text-gray-800">快速操作</Text>
          <View className="mb-6 grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
                onPress={action.onPress}>
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Text className="text-2xl">{action.icon}</Text>
                </View>
                <Text className="mb-1 text-base font-semibold text-gray-800">{action.title}</Text>
                <Text className="text-xs text-gray-500">{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats */}
          <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold text-gray-800">学习统计</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">12</Text>
                <Text className="text-xs text-gray-500">今日学习</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">156</Text>
                <Text className="text-xs text-gray-500">总学习时长</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-500">8</Text>
                <Text className="text-xs text-gray-500">完成项目</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold text-gray-800">最近活动</Text>
            {recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                className={`flex-row items-center py-3 ${
                  index === recentActivity.length - 1 ? '' : 'border-b border-gray-100'
                }`}>
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Text className="text-lg">{activity.type === '学习' ? '📖' : '🔧'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">{activity.title}</Text>
                  <Text className="text-xs text-gray-500">
                    {activity.time} • {activity.type}
                  </Text>
                </View>
                <Text className="text-base text-gray-500">→</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
