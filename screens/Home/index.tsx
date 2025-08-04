import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { buildingService } from '../../services/buildingService';
import { Building } from '../../types/building';
import { catchError, of } from 'rxjs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // 楼宇列表状态
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取楼宇列表
  const fetchBuildings = () => {
    setLoading(true);
    setError(null);

    buildingService.getBuildingList()
      .pipe(
        catchError((error) => {
          console.error('获取楼宇列表失败:', error);
          const errorMessage = error.message || '获取楼宇列表失败，请重试';
          setError(errorMessage);
          Alert.alert('获取失败', errorMessage);
          return of([]);
        })
      )
      .subscribe({
        next: (buildingList) => {
          setBuildings(buildingList);
          setLoading(false);
          console.log('✅ 成功获取楼宇列表:', buildingList);
        },
        error: (error) => {
          console.error('RxJS错误:', error);
          setLoading(false);
          setError('网络请求失败，请检查网络连接');
          Alert.alert('错误', '网络请求失败，请检查网络连接');
        }
      });
  };

  // 组件挂载时获取楼宇列表
  useEffect(() => {
    fetchBuildings();
  }, []);

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
          <Text className="mb-8 text-center text-4xl font-bold text-gray-800">库集成演示</Text>

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

        {/* 楼宇列表区域 */}
        <View className="mt-12 rounded-2xl bg-white p-6 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">楼宇列表</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => navigation.navigate('BuildingList')}
                className="px-3 py-1 rounded-full bg-green-500"
              >
                <Text className="text-sm font-medium text-white">查看全部</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={fetchBuildings}
                disabled={loading}
                className={`px-3 py-1 rounded-full ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
              >
                <Text className={`text-sm font-medium ${loading ? 'text-gray-500' : 'text-white'}`}>
                  {loading ? '加载中...' : '刷新'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 加载状态 */}
          {loading && (
            <View className="flex-row items-center justify-center py-8">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="ml-2 text-gray-600">正在获取楼宇列表...</Text>
            </View>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-800 font-medium mb-2">获取失败</Text>
              <Text className="text-red-600 text-sm mb-3">{error}</Text>
              <TouchableOpacity
                onPress={fetchBuildings}
                className="bg-red-500 px-4 py-2 rounded-lg self-start"
              >
                <Text className="text-white text-sm font-medium">重试</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 楼宇列表 */}
          {!loading && !error && buildings.length > 0 && (
            <View className="space-y-3">
              {buildings.map((building, index) => (
                <View key={building.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-lg font-semibold text-gray-800">{building.buildingName}</Text>
                    <View className="bg-green-100 px-2 py-1 rounded-full">
                      <Text className="text-green-800 text-xs font-medium">ID: {building.id}</Text>
                    </View>
                  </View>

                  <View className="space-y-1">
                    <Text className="text-gray-600">房东: {building.landlordName}</Text>
                    <View className="flex-row space-x-4">
                      <Text className="text-gray-600">电费: ¥{building.electricityUnitPrice}/度</Text>
                      <Text className="text-gray-600">水费: ¥{building.waterUnitPrice}/吨</Text>
                    </View>
                    {building.hotWaterUnitPrice && (
                      <Text className="text-gray-600">热水: ¥{building.hotWaterUnitPrice}/吨</Text>
                    )}
                    <Text className="text-gray-500 text-sm">
                      收租方式: {building.rentCollectionMethod === 'FIXED_MONTH_START' ? '固定月初' : '其他'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 空状态 */}
          {!loading && !error && buildings.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-6xl mb-4">🏢</Text>
              <Text className="text-gray-600 text-lg font-medium mb-2">暂无楼宇数据</Text>
              <Text className="text-gray-500 text-sm mb-4">点击下方按钮创建第一个楼宇</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateBuilding')}
                className="bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">创建楼宇</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
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
