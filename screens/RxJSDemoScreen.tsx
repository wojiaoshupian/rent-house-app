import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  appState$,
  fetchData,
  searchService,
  timerService,
  eventService,
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
      setEventLog((prev) => [
        ...prev.slice(-9),
        `${new Date().toLocaleTimeString()}: ${JSON.stringify(event)}`,
      ]);
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
      },
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
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-purple-500 shadow-lg">
            <Text className="text-2xl">🔄</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-gray-800">RxJS 响应式编程</Text>
          <Text className="text-center text-gray-600">强大的响应式编程，处理异步操作</Text>
        </View>

        {/* App State Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg text-blue-600">📊</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">应用状态管理</Text>
          </View>

          <View className="mb-4 space-y-3">
            <View className="flex-row items-center justify-between rounded-xl bg-gray-50 p-3">
              <Text className="font-medium text-gray-700">加载状态</Text>
              <View
                className={`rounded-full px-3 py-1 ${
                  appState.isLoading ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                <Text
                  className={`font-medium ${
                    appState.isLoading ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                  {appState.isLoading ? '加载中...' : '空闲'}
                </Text>
              </View>
            </View>

            {appState.data && (
              <View className="rounded-xl bg-blue-50 p-3">
                <Text className="mb-1 font-medium text-gray-800">📄 数据内容</Text>
                <Text className="text-sm text-gray-600">{JSON.stringify(appState.data)}</Text>
              </View>
            )}

            {appState.error && (
              <View className="rounded-xl bg-red-50 p-3">
                <Text className="mb-1 font-medium text-red-800">❌ 错误信息</Text>
                <Text className="text-sm text-red-600">{appState.error}</Text>
              </View>
            )}
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 rounded-xl bg-blue-500 py-3 shadow-lg"
              onPress={() => handleFetchData('1')}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">获取数据 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-xl bg-green-500 py-3 shadow-lg"
              onPress={() => handleFetchData('2')}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">获取数据 2</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Text className="text-lg text-green-600">🔍</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">搜索功能 (防抖)</Text>
          </View>

          <TextInput
            className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder="输入搜索关键词 (3个字符以上)"
          />

          <View className="space-y-3">
            {searchResults.map((result, index) => (
              <View key={index} className="rounded-xl border border-green-100 bg-green-50 p-4">
                <Text className="mb-1 font-semibold text-gray-800">{result.title}</Text>
                <Text className="text-sm text-gray-600">{result.description}</Text>
              </View>
            ))}

            {searchResults.length === 0 && searchTerm.length > 2 && (
              <View className="items-center py-6">
                <Text className="text-lg text-gray-500">🔍 正在搜索...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Timer Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Text className="text-lg text-orange-600">⏱️</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">定时器演示</Text>
          </View>

          <View className="mb-6 items-center">
            <View className="rounded-2xl bg-orange-500 px-8 py-6 shadow-lg">
              <Text className="text-center text-5xl font-bold text-white">{timerValue}</Text>
            </View>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 rounded-xl py-3 shadow-lg ${
                timerSubscription ? 'bg-gray-400' : 'bg-green-500'
              }`}
              onPress={handleStartTimer}
              disabled={!!timerSubscription}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">开始</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-xl py-3 shadow-lg ${
                timerSubscription ? 'bg-red-500' : 'bg-gray-400'
              }`}
              onPress={handleStopTimer}
              disabled={!timerSubscription}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">停止</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 rounded-xl bg-blue-500 py-3 shadow-lg"
              onPress={handleResetTimer}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">重置</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Stream Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Text className="text-lg text-purple-600">⚡</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">事件流演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-purple-500 py-4 shadow-lg"
            onPress={handleEventClick}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-semibold text-white">触发事件</Text>
          </TouchableOpacity>

          <View className="max-h-32 rounded-xl bg-gray-50 p-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">📋 事件日志:</Text>
            {eventLog.map((log, index) => (
              <Text key={index} className="mb-1 text-xs text-gray-600">
                {log}
              </Text>
            ))}
            {eventLog.length === 0 && <Text className="text-sm text-gray-400">暂无事件日志</Text>}
          </View>
        </View>

        {/* RxJS Features */}
        <View className="rounded-2xl bg-purple-500 p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-white">🔧 RxJS 特性演示</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">BehaviorSubject - 状态管理</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">debounceTime - 防抖搜索</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">interval - 定时器</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">merge - 事件流合并</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">switchMap - 取消之前的请求</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
