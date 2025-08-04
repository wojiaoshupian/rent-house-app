import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LibraryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const libraryItems = [
    {
      id: 1,
      title: 'Zustand 状态管理',
      icon: '⚡',
      description: '轻量级状态管理库',
      color: '#3b82f6',
      route: 'ZustandDemo' as keyof RootStackParamList,
    },
    {
      id: 2,
      title: 'RxJS 响应式编程',
      icon: '🔄',
      description: '响应式编程库',
      color: '#10b981',
      route: 'RxJSDemo' as keyof RootStackParamList,
    },
    {
      id: 3,
      title: 'Lodash 工具库',
      icon: '🛠️',
      description: 'JavaScript 实用工具库',
      color: '#f59e0b',
      route: 'LodashDemo' as keyof RootStackParamList,
    },
    {
      id: 4,
      title: '综合库演示',
      icon: '🎯',
      description: '多个库的综合使用',
      color: '#8b5cf6',
      route: 'LibraryDemo' as keyof RootStackParamList,
    },
    {
      id: 5,
      title: '动态 TabBar',
      icon: '📱',
      description: '自定义 TabBar 组件',
      color: '#ef4444',
      route: 'TabBarDemo' as keyof RootStackParamList,
    },
  ];

  const features = [
    {
      id: 1,
      title: '状态管理',
      description: '使用 Zustand 进行高效的状态管理',
      icon: '💾',
    },
    {
      id: 2,
      title: '响应式编程',
      description: '使用 RxJS 处理异步数据流',
      icon: '⚡',
    },
    {
      id: 3,
      title: '工具函数',
      description: '使用 Lodash 提供丰富的工具函数',
      icon: '🛠️',
    },
    {
      id: 4,
      title: 'UI 组件',
      description: '自定义组件和动态渲染',
      icon: '🎨',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">库集成演示 📚</Text>
          <Text className="text-base text-gray-500">探索各种库的使用方法和最佳实践</Text>
        </View>

        {/* Content */}
        <View className="p-5">
          {/* Library Items */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-bold text-gray-800">库演示</Text>
            <View className="gap-3">
              {libraryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="rounded-2xl bg-white p-5 shadow-md"
                  onPress={() => navigation.navigate(item.route as any)}>
                  <View className="flex-row items-center">
                    <View
                      className="mr-4 h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: item.color + '20' }}>
                      <Text className="text-2xl">{item.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-lg font-semibold text-gray-800">{item.title}</Text>
                      <Text className="mb-2 text-sm text-gray-500">{item.description}</Text>
                      <View className="flex-row items-center">
                        <View
                          className="rounded-xl px-2 py-1"
                          style={{ backgroundColor: item.color + '20' }}>
                          <Text className="text-xs font-medium" style={{ color: item.color }}>
                            查看演示
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text className="text-xl text-gray-500">→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Features */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-bold text-gray-800">主要功能</Text>
            <View className="rounded-2xl bg-white p-5 shadow-md">
              {features.map((feature, index) => (
                <View
                  key={feature.id}
                  className={`flex-row items-start ${index === features.length - 1 ? '' : 'mb-4'}`}>
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-lg">{feature.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-gray-800">
                      {feature.title}
                    </Text>
                    <Text className="text-sm leading-5 text-gray-500">{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View className="rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-xl font-bold text-gray-800">技术栈</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-500">5</Text>
                <Text className="text-xs text-gray-500">库演示</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">4</Text>
                <Text className="text-xs text-gray-500">主要功能</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-yellow-500">100%</Text>
                <Text className="text-xs text-gray-500">代码覆盖</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
