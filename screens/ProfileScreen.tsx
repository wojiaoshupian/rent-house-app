import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../contexts/UserContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, logout } = useUser();
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
          <View className="mb-4 flex-row items-center">
            <View className="mr-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500">
              <Text className="text-3xl text-white">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-2xl font-bold text-gray-800">
                {isAuthenticated ? user?.username : '未登录'}
              </Text>
              <Text className="text-base text-gray-500">
                {isAuthenticated ? (user?.email || user?.phone || '暂无联系方式') : '请先登录或注册'}
              </Text>
              {isAuthenticated && (
                <Text className="text-sm text-green-600">
                  状态: {user?.status} | 角色: {user?.roles.join(', ')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-5">
          {/* Profile Items */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-bold text-gray-800">账户设置</Text>
            <View className="gap-3">
              {profileItems.map((item) => (
                <TouchableOpacity key={item.id} className="rounded-2xl bg-white p-5 shadow-md">
                  <View className="flex-row items-center">
                    <View
                      className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: item.color + '20' }}>
                      <Text className="text-xl">{item.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold text-gray-800">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-500">{item.description}</Text>
                    </View>
                    <Text className="text-base text-gray-500">→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-bold text-gray-800">快速操作</Text>
            <View className="rounded-2xl bg-white p-5 shadow-md">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.id}
                  className={`flex-row items-center py-3 ${index === quickActions.length - 1 ? '' : 'border-b border-gray-100'}`}
                  onPress={action.onPress}>
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Text className="text-lg">{action.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">{action.title}</Text>
                    <Text className="text-xs text-gray-500">{action.description}</Text>
                  </View>
                  <Text className="text-base text-gray-500">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View className="rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-xl font-bold text-gray-800">账户信息</Text>
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
            {isAuthenticated ? (
              <TouchableOpacity
                className="items-center rounded-2xl bg-red-500 p-4 shadow-md"
                onPress={() => {
                  Alert.alert(
                    '确认退出',
                    '您确定要退出登录吗？',
                    [
                      { text: '取消', style: 'cancel' },
                      {
                        text: '退出',
                        style: 'destructive',
                        onPress: async () => {
                          await logout();
                          Alert.alert('提示', '已成功退出登录');
                        }
                      }
                    ]
                  );
                }}
              >
                <Text className="text-base font-semibold text-white">退出登录</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="items-center rounded-2xl bg-blue-500 p-4 shadow-md"
                onPress={() => navigation.navigate('Register')}
              >
                <Text className="text-base font-semibold text-white">立即注册</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
