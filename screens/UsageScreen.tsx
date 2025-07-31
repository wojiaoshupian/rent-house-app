import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      onPress: () => navigation.navigate('Library'),
    },
    {
      id: 3,
      title: '个人中心',
      icon: '👤',
      description: '管理您的学习进度',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            学习中心
          </Text>
          <Text className="text-gray-500 text-base">
            选择您的学习路径
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="p-5">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            快速开始
          </Text>
          <View className="grid grid-cols-1 gap-4 mb-6">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center"
                onPress={action.onPress}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                  <Text className="text-2xl">{action.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
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

          {/* Learning Paths */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              学习路径
            </Text>
            {learningPaths.map((path, index) => (
              <View
                key={path.id}
                className={`mb-4 ${
                  index === learningPaths.length - 1 ? '' : 'border-b border-gray-100 pb-4'
                }`}
              >
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-lg">{path.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      {path.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {path.description}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-blue-500">
                    {path.progress}%
                  </Text>
                </View>
                <View className="bg-gray-200 rounded-full h-2">
                  <View
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${path.progress}%` }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Text className="text-lg font-semibold text-blue-800 mb-2">
              学习建议
            </Text>
            <View className="space-y-2">
              <Text className="text-sm text-blue-700">
                • 注册账户以保存学习进度
              </Text>
              <Text className="text-sm text-blue-700">
                • 每天保持学习习惯
              </Text>
              <Text className="text-sm text-blue-700">
                • 实践是最好的学习方式
              </Text>
              <Text className="text-sm text-blue-700">
                • 遇到问题及时寻求帮助
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}; 