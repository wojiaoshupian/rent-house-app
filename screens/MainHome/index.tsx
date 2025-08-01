import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MainHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // 快捷操作项
  const quickActions = [
    {
      id: 1,
      title: '创建楼宇',
      description: '添加新的楼宇信息',
      icon: '🏢',
      color: '#3B82F6',
      route: 'CreateBuilding' as const,
    },
    {
      id: 2,
      title: '楼宇管理',
      description: '查看和管理楼宇',
      icon: '🏘️',
      color: '#10B981',
      route: 'Home' as const, // 暂时跳转到Home，后续可以添加楼宇列表页面
    },
    {
      id: 3,
      title: '租户管理',
      description: '管理租户信息',
      icon: '👥',
      color: '#F59E0B',
      route: 'Home' as const, // 暂时跳转到Home，后续可以添加租户管理页面
    },
    {
      id: 4,
      title: '收费管理',
      description: '水电费收费管理',
      icon: '💰',
      color: '#EF4444',
      route: 'Home' as const, // 暂时跳转到Home，后续可以添加收费管理页面
    },
    {
      id: 5,
      title: 'RxJS Subject',
      description: 'Subject 演示和学习',
      icon: '🔄',
      color: '#8B5CF6',
      route: 'SubjectDemo' as const,
    },
  ];

  const recentActivity = [
    { id: 1, title: '创建楼宇：阳光公寓', time: '2小时前', type: '操作' },
    { id: 2, title: '更新租户信息', time: '1天前', type: '管理' },
    { id: 3, title: '收取水电费', time: '3天前', type: '收费' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">楼宇管理系统</Text>
          <Text className="text-base text-gray-500">高效管理您的楼宇和租户</Text>
        </View>

        {/* Quick Actions */}
        <View className="p-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">快捷操作</Text>
          <View className="flex-row flex-wrap gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm"
                onPress={() => navigation.navigate(action.route)}
              >
                <View className="items-center">
                  <View
                    className="mb-3 h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: action.color + '20' }}
                  >
                    <Text className="text-2xl">{action.icon}</Text>
                  </View>
                  <Text className="mb-1 text-center text-sm font-semibold text-gray-800">
                    {action.title}
                  </Text>
                  <Text className="text-center text-xs text-gray-500">
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 pb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">最近活动</Text>
          <View className="bg-white rounded-xl shadow-sm">
            {recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                className={`flex-row items-center p-4 ${
                  index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-blue-600 text-sm font-semibold">
                    {activity.type.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">{activity.title}</Text>
                  <Text className="text-gray-500 text-sm">{activity.time}</Text>
                </View>
                <View className="bg-gray-100 rounded-full px-2 py-1">
                  <Text className="text-gray-600 text-xs">{activity.type}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
