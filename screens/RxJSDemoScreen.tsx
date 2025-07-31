import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { 
  appState$, 
  fetchData, 
  searchService, 
  timerService, 
  eventService 
} from '../services/rxjsService';
import { Subscription } from 'rxjs';

export const RxJSDemoScreen = () => {
  const [appState, setAppState] = useState(appState$.value);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [timerValue, setTimerValue] = useState(0);
  const [timerSubscription, setTimerSubscription] = useState<Subscription | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    // 订阅应用状态
    const appStateSub = appState$.subscribe(setAppState);
    
    // 订阅搜索结果
    const searchSub = searchService.getSearchResults$().subscribe(setSearchResults);
    
    // 订阅定时器
    const timerSub = timerService.timer$.subscribe(setTimerValue);
    
    // 创建事件流
    const eventStream = eventService.createEventStream();
    const eventSub = eventStream.subscribe((event) => {
      setEventLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${JSON.stringify(event)}`]);
    });

    return () => {
      appStateSub.unsubscribe();
      searchSub.unsubscribe();
      timerSub.unsubscribe();
      eventSub.unsubscribe();
    };
  }, []);

  const handleFetchData = (id: string) => {
    fetchData(id).subscribe({
      next: (data) => {
        Alert.alert('✅ 数据获取成功', JSON.stringify(data, null, 2));
      },
      error: (error) => {
        Alert.alert('❌ 错误', error.message);
      }
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchService.search(term);
  };

  const handleStartTimer = () => {
    if (!timerSubscription) {
      const sub = timerService.startTimer();
      setTimerSubscription(sub);
    }
  };

  const handleStopTimer = () => {
    if (timerSubscription) {
      timerService.stopTimer(timerSubscription);
      setTimerSubscription(null);
    }
  };

  const handleResetTimer = () => {
    timerService.resetTimer();
  };

  const handleEventClick = () => {
    // 模拟点击事件
    const click$ = eventService.createEventStream();
    click$.subscribe();
  };

  return (
    <ScrollView className="flex-1 bg-purple-50">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-purple-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-2xl">🔄</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            RxJS 响应式编程
          </Text>
          <Text className="text-gray-600 text-center">
            强大的响应式编程，处理异步操作
          </Text>
        </View>

        {/* App State Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-blue-600 text-lg">📊</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">应用状态管理</Text>
          </View>
          
          <View className="space-y-3 mb-4">
            <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
              <Text className="text-gray-700 font-medium">加载状态</Text>
              <View className={`px-3 py-1 rounded-full ${
                appState.isLoading ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Text className={`font-medium ${
                  appState.isLoading ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {appState.isLoading ? '加载中...' : '空闲'}
                </Text>
              </View>
            </View>
            
            {appState.data && (
              <View className="p-3 bg-blue-50 rounded-xl">
                <Text className="text-gray-800 font-medium mb-1">📄 数据内容</Text>
                <Text className="text-gray-600 text-sm">
                  {JSON.stringify(appState.data)}
                </Text>
              </View>
            )}
            
            {appState.error && (
              <View className="p-3 bg-red-50 rounded-xl">
                <Text className="text-red-800 font-medium mb-1">❌ 错误信息</Text>
                <Text className="text-red-600 text-sm">{appState.error}</Text>
              </View>
            )}
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-xl shadow-lg"
              onPress={() => handleFetchData('1')}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">获取数据 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-xl shadow-lg"
              onPress={() => handleFetchData('2')}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">获取数据 2</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Text className="text-green-600 text-lg">🔍</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">搜索功能 (防抖)</Text>
          </View>
          
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 mb-4"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder="输入搜索关键词 (3个字符以上)"
          />
          
          <View className="space-y-3">
            {searchResults.map((result, index) => (
              <View key={index} className="p-4 bg-green-50 rounded-xl border border-green-100">
                <Text className="font-semibold text-gray-800 mb-1">{result.title}</Text>
                <Text className="text-gray-600 text-sm">{result.description}</Text>
              </View>
            ))}
            
            {searchResults.length === 0 && searchTerm.length > 2 && (
              <View className="items-center py-6">
                <Text className="text-gray-500 text-lg">🔍 正在搜索...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Timer Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Text className="text-orange-600 text-lg">⏱️</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">定时器演示</Text>
          </View>
          
          <View className="items-center mb-6">
            <View className="bg-orange-500 px-8 py-6 rounded-2xl shadow-lg">
              <Text className="text-5xl font-bold text-white text-center">
                {timerValue}
              </Text>
            </View>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl shadow-lg ${
                timerSubscription ? 'bg-gray-400' : 'bg-green-500'
              }`}
              onPress={handleStartTimer}
              disabled={!!timerSubscription}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">开始</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl shadow-lg ${
                timerSubscription ? 'bg-red-500' : 'bg-gray-400'
              }`}
              onPress={handleStopTimer}
              disabled={!timerSubscription}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">停止</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-xl shadow-lg"
              onPress={handleResetTimer}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">重置</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Stream Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-600 text-lg">⚡</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">事件流演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-purple-500 py-4 rounded-xl shadow-lg mb-4"
            onPress={handleEventClick}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-lg">
              触发事件
            </Text>
          </TouchableOpacity>
          
          <View className="max-h-32 bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-semibold mb-2 text-gray-700">
              📋 事件日志:
            </Text>
            {eventLog.map((log, index) => (
              <Text key={index} className="text-xs text-gray-600 mb-1">
                {log}
              </Text>
            ))}
            {eventLog.length === 0 && (
              <Text className="text-gray-400 text-sm">暂无事件日志</Text>
            )}
          </View>
        </View>

        {/* RxJS Features */}
        <View className="bg-purple-500 rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-white mb-4">
            🔧 RxJS 特性演示
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">BehaviorSubject - 状态管理</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">debounceTime - 防抖搜索</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">interval - 定时器</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">merge - 事件流合并</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">switchMap - 取消之前的请求</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}; 