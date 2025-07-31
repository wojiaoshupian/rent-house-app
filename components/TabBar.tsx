import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface TabItem {
  key: string;
  title: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  showBadge?: boolean;
}

export const TabBar = (props: TabBarProps) => {
  const {
    tabs,
    activeTab,
    onTabPress,
    activeColor = '#3b82f6',
    inactiveColor = '#6b7280',
    backgroundColor = '#ffffff',
    showBadge = true,
  } = props;

  const handleTabPress = (tabKey: string) => {
    onTabPress(tabKey);
  };

  return (
    <View
      className="flex-row border-t border-gray-200"
      style={{
        backgroundColor,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const iconText = tab.icon || '';
        const titleText = tab.title || '';
        const badgeNumber = tab.badge || 0;

        return (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center justify-center py-3"
            onPress={() => {
              if (!tab.disabled) {
                handleTabPress(tab.key);
              }
            }}
            disabled={tab.disabled}
            activeOpacity={0.7}
          >
            <View className="items-center">
              {iconText && (
                <View className="mb-1">
                  <Text 
                    className="text-xl"
                    style={{
                      color: isActive ? activeColor : inactiveColor,
                      opacity: tab.disabled ? 0.5 : 1,
                    }}
                  >
                    {iconText}
                  </Text>
                </View>
              )}
              
              <Text
                className="text-sm font-medium"
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  opacity: tab.disabled ? 0.5 : 1,
                }}
              >
                {titleText}
              </Text>
              
              {showBadge && badgeNumber > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {badgeNumber > 99 ? '99+' : String(badgeNumber)}
                  </Text>
                </View>
              )}
              
              {isActive && (
                <View
                  className="absolute -bottom-1 w-8 h-1 rounded-full"
                  style={{
                    backgroundColor: activeColor,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}; 