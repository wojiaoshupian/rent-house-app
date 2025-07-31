import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, TabItem } from './TabBar';
import { MainHomeScreen } from '../screens/MainHomeScreen';
import { UsageScreen } from '../screens/UsageScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

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
      key: 'library',
      title: '库',
      icon: '📚',
      badge: 5,
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
      case 'library':
        return <LibraryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MainHomeScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        {renderContent()}
      </View>
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