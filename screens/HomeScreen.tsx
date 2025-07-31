import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigationItems = [
    {
      title: 'Zustand',
      subtitle: '状态管理',
      description: '轻量级状态管理库，简单易用的API',
      route: 'ZustandDemo' as const,
      color: '#667eea',
      icon: '⚡',
      features: ['计数器', '用户管理', 'Todo列表']
    },
    {
      title: 'RxJS',
      subtitle: '响应式编程',
      description: '强大的响应式编程库，处理异步操作',
      route: 'RxJSDemo' as const,
      color: '#f093fb',
      icon: '🔄',
      features: ['状态管理', '防抖搜索', '定时器', '事件流']
    },
    {
      title: 'Lodash',
      subtitle: '工具库',
      description: 'JavaScript实用工具函数库',
      route: 'LodashDemo' as const,
      color: '#4facfe',
      icon: '🛠️',
      features: ['数组操作', '对象处理', '字符串工具', '函数式编程']
    },
    {
      title: '综合演示',
      subtitle: '联合使用',
      description: '展示所有库的协同工作',
      route: 'LibraryDemo' as const,
      color: '#43e97b',
      icon: '🚀',
      features: ['库集成', '数据处理', '状态同步']
    },
    {
      title: '动态 TabBar',
      subtitle: '组件演示',
      description: '可动态配置的TabBar组件',
      route: 'TabBarDemo' as const,
      color: '#ff6b6b',
      icon: '📱',
      features: ['动态添加', '徽章显示', '动画效果', '禁用状态']
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-12 pb-8">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-3xl">📱</Text>
          </View>
          <Text className="text-4xl font-bold text-center mb-8 text-gray-800">
            库集成演示
          </Text>
          
          <Text className="text-lg text-center mb-8 text-gray-600">
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
              activeOpacity={0.9}
            >
              {/* Background */}
              <View 
                className="absolute inset-0"
                style={{
                  backgroundColor: item.color,
                }}
              />
              
              {/* Content */}
              <View className="p-6 relative z-10">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-white mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-white/80 text-lg">
                      {item.subtitle}
                    </Text>
                  </View>
                  <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                    <Text className="text-white text-lg">→</Text>
                  </View>
                </View>
                
                <Text className="text-white/90 text-base mb-4 leading-6">
                  {item.description}
                </Text>
                
                {/* Features */}
                <View className="flex-row flex-wrap">
                  {item.features.map((feature, featureIndex) => (
                    <View 
                      key={featureIndex}
                      className="bg-white/20 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-white text-sm font-medium">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            技术栈概览
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">状态管理</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-800 font-medium">Zustand</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">响应式编程</Text>
              <View className="bg-purple-100 px-3 py-1 rounded-full">
                <Text className="text-purple-800 font-medium">RxJS</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">工具库</Text>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800 font-medium">Lodash</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">路由导航</Text>
              <View className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-800 font-medium">React Navigation</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">UI组件</Text>
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-800 font-medium">动态 TabBar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-500 text-center">
            点击卡片开始探索各个库的强大功能
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}; 