import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { 
  eventBus, 
  appState, 
  historyService, 
  taskService, 
  notificationService,
  searchService 
} from '../../services/subjectExamples';

export const SubjectDemoScreen = () => {
  // 状态管理
  const [userState, setUserState] = useState<any>({});
  const [theme, setTheme] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [taskResult, setTaskResult] = useState<string>('');

  useEffect(() => {
    // 订阅用户状态
    const userSub = appState.getUserState().subscribe(setUserState);
    
    // 订阅主题状态
    const themeSub = appState.getTheme().subscribe(setTheme);
    
    // 订阅通知
    const notificationSub = notificationService.getNotifications().subscribe(
      notification => {
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
      }
    );
    
    // 订阅未读计数
    const unreadSub = notificationService.getUnreadCount().subscribe(setUnreadCount);
    
    // 订阅搜索结果
    const searchSub = searchService.getSearchResults$().subscribe(setSearchResults);
    
    // 订阅操作历史
    const historySub = historyService.getActionHistory().subscribe(
      history => setActionHistory([history])
    );

    // 订阅事件总线
    const eventSub = eventBus.on('demo-event').subscribe(
      data => Alert.alert('事件接收', `接收到事件: ${JSON.stringify(data)}`)
    );

    return () => {
      userSub.unsubscribe();
      themeSub.unsubscribe();
      notificationSub.unsubscribe();
      unreadSub.unsubscribe();
      searchSub.unsubscribe();
      historySub.unsubscribe();
      eventSub.unsubscribe();
    };
  }, []);

  // 处理搜索
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    searchService.search(text);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        
        {/* Subject 事件总线演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📡 Subject - 事件总线
          </Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-3 mb-2"
            onPress={() => {
              eventBus.emit('demo-event', { message: '这是一个测试事件', timestamp: new Date() });
              historyService.recordAction('发送事件', { type: 'demo-event' });
            }}
          >
            <Text className="text-white text-center font-medium">发送事件</Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">
            点击按钮发送事件，会弹出接收提示
          </Text>
        </View>

        {/* BehaviorSubject 状态管理演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔄 BehaviorSubject - 状态管理
          </Text>
          
          {/* 用户状态 */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-2">用户状态:</Text>
            <Text className="text-xs text-gray-600 mb-2">
              登录状态: {userState.isAuthenticated ? '已登录' : '未登录'}
            </Text>
            <TouchableOpacity
              className="bg-green-500 rounded-lg p-2 mb-2"
              onPress={() => {
                appState.updateUserState({
                  isAuthenticated: !userState.isAuthenticated,
                  user: userState.isAuthenticated ? null : { name: '测试用户' }
                });
                historyService.recordAction('切换登录状态', { isAuthenticated: !userState.isAuthenticated });
              }}
            >
              <Text className="text-white text-center text-sm">
                {userState.isAuthenticated ? '退出登录' : '登录'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 主题状态 */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-2">主题设置:</Text>
            <Text className="text-xs text-gray-600 mb-2">
              当前主题: {theme.isDark ? '深色' : '浅色'}
            </Text>
            <TouchableOpacity
              className="bg-purple-500 rounded-lg p-2"
              onPress={() => {
                appState.toggleTheme();
                historyService.recordAction('切换主题', { isDark: !theme.isDark });
              }}
            >
              <Text className="text-white text-center text-sm">切换主题</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 通知系统演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔔 通知系统 (未读: {unreadCount})
          </Text>
          
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              className="bg-green-500 rounded-lg p-2 flex-1"
              onPress={() => {
                notificationService.notify('success', '操作成功！');
                historyService.recordAction('发送成功通知', {});
              }}
            >
              <Text className="text-white text-center text-xs">成功</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-red-500 rounded-lg p-2 flex-1"
              onPress={() => {
                notificationService.notify('error', '发生错误！');
                historyService.recordAction('发送错误通知', {});
              }}
            >
              <Text className="text-white text-center text-xs">错误</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-500 rounded-lg p-2 flex-1"
              onPress={() => {
                notificationService.markAsRead();
                historyService.recordAction('标记已读', {});
              }}
            >
              <Text className="text-white text-center text-xs">已读</Text>
            </TouchableOpacity>
          </View>

          {/* 最近通知 */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">最近通知:</Text>
            {notifications.slice(0, 3).map((notification, index) => (
              <View key={notification.id} className="bg-gray-50 rounded p-2 mb-1">
                <Text className="text-xs text-gray-800">{notification.message}</Text>
                <Text className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 搜索演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔍 搜索服务 (防抖)
          </Text>
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3"
            placeholder="输入搜索关键词 (至少3个字符)"
            value={searchTerm}
            onChangeText={handleSearch}
          />
          
          {searchResults.length > 0 && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">搜索结果:</Text>
              {searchResults.slice(0, 3).map((result, index) => (
                <View key={result.id} className="bg-gray-50 rounded p-2 mb-1">
                  <Text className="text-xs font-medium text-gray-800">{result.title}</Text>
                  <Text className="text-xs text-gray-600">{result.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* AsyncSubject 任务演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            ⏳ AsyncSubject - 异步任务
          </Text>
          
          <TouchableOpacity
            className="bg-orange-500 rounded-lg p-3 mb-2"
            onPress={() => {
              setTaskResult('任务执行中...');
              taskService.executeTask('demo-task').subscribe(result => {
                setTaskResult(result);
                historyService.recordAction('执行异步任务', { result });
              });
            }}
          >
            <Text className="text-white text-center font-medium">执行异步任务</Text>
          </TouchableOpacity>
          
          <Text className="text-sm text-gray-600">
            任务结果: {taskResult || '暂无'}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            AsyncSubject 只会发送最后一个值
          </Text>
        </View>

        {/* ReplaySubject 历史记录演示 */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📜 ReplaySubject - 操作历史
          </Text>
          
          {actionHistory.length > 0 && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">最近操作:</Text>
              {actionHistory.slice(-3).map((action, index) => (
                <View key={index} className="bg-gray-50 rounded p-2 mb-1">
                  <Text className="text-xs font-medium text-gray-800">{action.action}</Text>
                  <Text className="text-xs text-gray-500">
                    {action.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};
