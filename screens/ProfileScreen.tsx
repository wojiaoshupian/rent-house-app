import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const profileItems = [
    {
      id: 1,
      title: '个人信息',
      icon: '👤',
      description: '查看和编辑个人资料',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: '设置',
      icon: '⚙️',
      description: '应用设置和偏好',
      color: '#10b981',
    },
    {
      id: 3,
      title: '通知',
      icon: '🔔',
      description: '管理通知设置',
      color: '#f59e0b',
    },
    {
      id: 4,
      title: '隐私',
      icon: '🔒',
      description: '隐私和安全设置',
      color: '#ef4444',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: '帮助中心',
      icon: '❓',
      description: '获取帮助和支持',
    },
    {
      id: 2,
      title: '意见反馈',
      icon: '💬',
      description: '提交建议和反馈',
    },
    {
      id: 3,
      title: '关于我们',
      icon: 'ℹ️',
      description: '了解更多信息',
    },
    {
      id: 4,
      title: '用户注册',
      icon: '📝',
      description: '注册新用户账户',
      onPress: () => navigation.navigate('Register'),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mr-4">
              <Text className="text-3xl text-white">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                用户名
              </Text>
              <Text className="text-gray-500 text-base">
                user@example.com
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-5">
          {/* Profile Items */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              账户设置
            </Text>
            <View className="gap-3">
              {profileItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-md"
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: item.color + '20' }}
                    >
                      <Text className="text-xl">{item.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800 mb-1">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {item.description}
                      </Text>
                    </View>
                    <Text className="text-base text-gray-500">→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              快速操作
            </Text>
            <View className="bg-white rounded-2xl p-5 shadow-md">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.id}
                  className={`flex-row items-center py-3 ${index === quickActions.length - 1 ? '' : 'border-b border-gray-100'}`}
                  onPress={action.onPress}
                >
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-lg">{action.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">
                      {action.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {action.description}
                    </Text>
                  </View>
                  <Text className="text-base text-gray-500">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-2xl p-5 shadow-md">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              账户信息
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">128</Text>
                <Text className="text-xs text-gray-500">使用天数</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">56</Text>
                <Text className="text-xs text-gray-500">收藏内容</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-yellow-500">23</Text>
                <Text className="text-xs text-gray-500">分享次数</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <View className="mt-6">
            <TouchableOpacity className="bg-red-500 rounded-2xl p-4 items-center shadow-md">
              <Text className="text-white text-base font-semibold">
                退出登录
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}; 