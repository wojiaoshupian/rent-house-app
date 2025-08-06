import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, TabItem } from './TabBar';
import { MainHomeScreen } from '../../screens/MainHome';
import { UsageScreen } from '../../screens/Usage';
import { ProfileScreen } from '../../screens/Profile';

export const MainTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs: TabItem[] = [
    {
      key: 'home',
      title: '首页',
      icon: '🏠',
      badge: 0,
    },
    {
      key: 'usage',
      title: '使用',
      icon: '📖',
      badge: 0,
    },
   
    {
      key: 'profile',
      title: '我的',
      icon: '👤',
      badge: 0,
    },
  ];

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <MainHomeScreen />;
      case 'usage':
        return <UsageScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MainHomeScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">{renderContent()}</View>
      <SafeAreaView edges={['bottom']} className="bg-white">
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          activeColor="#3b82f6"
          inactiveColor="#6b7280"
          backgroundColor="#ffffff"
          showBadge={true}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};
