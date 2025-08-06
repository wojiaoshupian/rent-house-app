import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MainHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showOperationGuide, setShowOperationGuide] = useState(false);

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
      description: '查看楼宇列表和详情',
      icon: '🏘️',
      color: '#10B981',
      route: 'BuildingList' as const, // 跳转到楼宇列表页面
    },
    {
      id: 3,
      title: '房间管理',
      description: '管理房间信息',
      icon: '🏠',
      color: '#8B5CF6',
      route: 'RoomList' as const,
    },
    {
      id: 4,
      title: '抄水电表',
      description: '管理房间水电表记录',
      icon: '📊',
      color: '#06B6D4',
      route: 'UtilityReadingList' as const,
    },
    {
      id: 5,
      title: '预估账单',
      description: '查看和管理预估账单',
      icon: '�',
      color: '#EF4444',
      route: 'EstimatedBillList' as const,
    },
   
  ];



  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">楼宇管理系统</Text>
          <Text className="text-base text-gray-500">高效管理您的楼宇和租户</Text>
        </View>

        {/* 操作说明 */}
        <View className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <TouchableOpacity
            onPress={() => setShowOperationGuide(!showOperationGuide)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold text-blue-700 mr-2">
                📖 系统使用指南
              </Text>
            </View>
            <Text className="text-lg text-blue-600">
              {showOperationGuide ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showOperationGuide && (
            <View className="mt-4 bg-white rounded-xl p-5 border border-blue-200">
              <Text className="text-base font-bold text-gray-800 mb-3">🏢 楼宇管理系统操作流程</Text>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">📋 推荐操作流程：</Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-sm text-gray-600 leading-5">
                    1️⃣ 创建楼宇 → 2️⃣ 添加房间 → 3️⃣ 抄水电表 → 4️⃣ 生成账单
                  </Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">🏢 楼宇管理：</Text>
                <Text className="text-xs text-gray-600 leading-4 ml-2">
                  • 点击"创建楼宇"添加新楼宇信息{'\n'}
                  • 点击"楼宇管理"查看和编辑现有楼宇{'\n'}
                  • 设置电费、水费、热水费单价
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">🏠 房间管理：</Text>
                <Text className="text-xs text-gray-600 leading-4 ml-2">
                  • 在楼宇下创建房间{'\n'}
                  • 设置房间租金和租户信息{'\n'}
                  • 管理房间出租状态
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">📊 抄表管理：</Text>
                <Text className="text-xs text-gray-600 leading-4 ml-2">
                  • 定期录入水表、电表读数{'\n'}
                  • 系统自动计算用量{'\n'}
                  • 支持按楼宇、房间筛选查看
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">💰 账单管理：</Text>
                <Text className="text-xs text-gray-600 leading-4 ml-2">
                  • 查看预估账单{'\n'}
                  • 生成正式账单{'\n'}
                  • 导出账单数据
                </Text>
              </View>

              <View className="bg-green-50 p-3 rounded-lg border border-green-200">
                <Text className="text-xs text-green-800 font-medium">
                  💡 新手提示：建议先从"创建楼宇"开始，逐步完善系统数据
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="p-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">快捷操作</Text>
          <View className="flex-row flex-wrap gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="flex-1 min-w-[45%] bg-white rounded-xl p-4 shadow-sm"
                onPress={() => {
                  if (action.route === 'RoomList') {
                    navigation.navigate('RoomList', {});
                  } else if (action.route === 'UtilityReadingList') {
                    navigation.navigate('UtilityReadingList', {});
                  } else if (action.route === 'EstimatedBillList') {
                    navigation.navigate('EstimatedBillList', {});
                  } else {
                    navigation.navigate(action.route as any);
                  }
                }}
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

     
      </ScrollView>
    </View>
  );
};
