import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TabBar, TabItem } from '../components/TabBar';

export const TabBarDemoScreen = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      key: 'home',
      title: '首页',
      icon: '🏠',
      badge: 0,
    },
    {
      key: 'search',
      title: '搜索',
      icon: '🔍',
      badge: 3,
    },
    {
      key: 'favorites',
      title: '收藏',
      icon: '⭐',
      badge: 0,
    },
    {
      key: 'profile',
      title: '我的',
      icon: '👤',
      badge: 0,
    },
  ]);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const addTab = () => {
    const newTab: TabItem = {
      key: `tab-${Date.now()}`,
      title: `新标签${tabs.length + 1}`,
      icon: '📌',
      badge: Math.floor(Math.random() * 5),
    };
    setTabs([...tabs, newTab]);
  };

  const removeTab = (tabKey: string) => {
    if (tabs.length > 1) {
      setTabs(tabs.filter(tab => tab.key !== tabKey));
      if (activeTab === tabKey) {
        setActiveTab(tabs[0].key);
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            动态 TabBar 演示
          </Text>
          <Text className="text-gray-500 text-base">
            可以动态添加和删除标签页
          </Text>
        </View>

        {/* Content */}
        <View className="p-5">
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              当前激活标签
            </Text>
            <View className="bg-blue-50 rounded-xl p-4">
              <Text className="text-lg font-semibold text-blue-800">
                {tabs.find(tab => tab.key === activeTab)?.title || '未知'}
              </Text>
              <Text className="text-sm text-blue-600">
                标签键: {activeTab}
              </Text>
            </View>
          </View>

          {/* Tab Management */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              标签管理
            </Text>
            <View className="space-y-3">
              <TouchableOpacity
                className="bg-green-500 rounded-xl py-3 px-4 items-center"
                onPress={addTab}
              >
                <Text className="text-white text-base font-semibold">
                  添加新标签
                </Text>
              </TouchableOpacity>
              
              {tabs.map((tab) => (
                <View key={tab.key} className="flex-row items-center justify-between bg-gray-50 rounded-xl p-3">
                  <View className="flex-row items-center">
                    <Text className="text-lg mr-2">{tab.icon}</Text>
                    <View>
                      <Text className="text-base font-medium text-gray-800">
                        {tab.title}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        徽章: {tab.badge}
                      </Text>
                    </View>
                  </View>
                  {tabs.length > 1 && (
                    <TouchableOpacity
                      className="bg-red-500 rounded-lg px-3 py-1"
                      onPress={() => removeTab(tab.key)}
                    >
                      <Text className="text-white text-sm">删除</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* TabBar Preview */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              TabBar 预览
            </Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden">
              <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabPress}
                activeColor="#3b82f6"
                inactiveColor="#6b7280"
                backgroundColor="#ffffff"
                showBadge={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}; 