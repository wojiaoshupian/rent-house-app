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
