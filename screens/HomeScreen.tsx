import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../contexts/UserContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useUser();

  const navigationItems = [
    {
      title: 'Zustand',
      subtitle: '状态管理',
      description: '轻量级状态管理库，简单易用的API',
      route: 'ZustandDemo' as const,
      color: '#667eea',
      icon: '⚡',
      features: ['计数器', '用户管理', 'Todo列表'],
    },
    {
      title: 'RxJS',
      subtitle: '响应式编程',
      description: '强大的响应式编程库，处理异步操作',
      route: 'RxJSDemo' as const,
      color: '#f093fb',
      icon: '🔄',
      features: ['状态管理', '防抖搜索', '定时器', '事件流'],
    },
    {
      title: 'Lodash',
      subtitle: '工具库',
      description: 'JavaScript实用工具函数库',
      route: 'LodashDemo' as const,
      color: '#4facfe',
      icon: '🛠️',
      features: ['数组操作', '对象处理', '字符串工具', '函数式编程'],
    },
    {
      title: '综合演示',
      subtitle: '联合使用',
      description: '展示所有库的协同工作',
      route: 'LibraryDemo' as const,
      color: '#43e97b',
      icon: '🚀',
      features: ['库集成', '数据处理', '状态同步'],
    },
    {
      title: '动态 TabBar',
      subtitle: '组件演示',
      description: '可动态配置的TabBar组件',
      route: 'TabBarDemo' as const,
      color: '#ff6b6b',
      icon: '📱',
      features: ['动态添加', '徽章显示', '动画效果', '禁用状态'],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pb-8 pt-12">
        {/* Header */}
        <View className="mb-12 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Text className="text-3xl">📱</Text>
          </View>
          <Text className="mb-4 text-center text-4xl font-bold text-gray-800">库集成演示</Text>

          {/* User Welcome */}
          {isAuthenticated ? (
            <View className="mb-6 rounded-2xl bg-green-50 p-4">
              <Text className="text-center text-lg font-semibold text-green-800">
                欢迎回来，{user?.username}! 👋
              </Text>
              <Text className="text-center text-sm text-green-600">
                状态: {user?.status} | 角色: {user?.roles.join(', ')}
              </Text>
            </View>
          ) : (
            <View className="mb-6 rounded-2xl bg-blue-50 p-4">
              <Text className="text-center text-lg font-semibold text-blue-800">
                欢迎使用演示应用! 🎉
              </Text>
              <Text className="text-center text-sm text-blue-600">
                请前往个人中心注册账户以获得完整体验
              </Text>
            </View>
          )}

          <Text className="mb-8 text-center text-lg text-gray-600">
            探索现代 React Native 开发的最佳实践
          </Text>
        </View>

        {/* Navigation Cards */}
        <View className="space-y-6">
          {navigationItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.9}>
              {/* Background */}
              <View
                className="absolute inset-0"
                style={{
                  backgroundColor: item.color,
                }}
              />

              {/* Content */}
              <View className="relative z-10 p-6">
                <View className="mb-4 flex-row items-center">
                  <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-2xl font-bold text-white">{item.title}</Text>
                    <Text className="text-lg text-white/80">{item.subtitle}</Text>
                  </View>
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Text className="text-lg text-white">→</Text>
                  </View>
                </View>

                <Text className="mb-4 text-base leading-6 text-white/90">{item.description}</Text>

                {/* Features */}
                <View className="flex-row flex-wrap">
                  {item.features.map((feature, featureIndex) => (
                    <View
                      key={featureIndex}
                      className="mb-2 mr-2 rounded-full bg-white/20 px-3 py-1">
                      <Text className="text-sm font-medium text-white">{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View className="mt-12 rounded-2xl bg-white p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-gray-800">技术栈概览</Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">状态管理</Text>
              <View className="rounded-full bg-green-100 px-3 py-1">
                <Text className="font-medium text-green-800">Zustand</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">响应式编程</Text>
              <View className="rounded-full bg-purple-100 px-3 py-1">
                <Text className="font-medium text-purple-800">RxJS</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">工具库</Text>
              <View className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="font-medium text-blue-800">Lodash</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">路由导航</Text>
              <View className="rounded-full bg-orange-100 px-3 py-1">
                <Text className="font-medium text-orange-800">React Navigation</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">UI组件</Text>
              <View className="rounded-full bg-red-100 px-3 py-1">
                <Text className="font-medium text-red-800">动态 TabBar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-center text-gray-500">点击卡片开始探索各个库的强大功能</Text>
        </View>
      </View>
    </ScrollView>
  );
};
