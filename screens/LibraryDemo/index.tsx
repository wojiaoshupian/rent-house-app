import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useStore } from '../../store/useStore';
import { fetchData, searchService, timerService } from '../../services/rxjsService';
import { arrayUtils, objectUtils, stringUtils, numberUtils } from '../../utils/lodashUtils';
import { Subscription } from 'rxjs';

export const LibraryDemoScreen = () => {
  const { counter, increment, decrement, todos, addTodo, toggleTodo } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [timerValue, setTimerValue] = useState(0);
  const [timerSubscription, setTimerSubscription] = useState<Subscription | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [processedData, setProcessedData] = useState<any>({});

  useEffect(() => {
    // 订阅搜索结果
    const searchSub = searchService.getSearchResults$().subscribe(setSearchResults);

    // 订阅定时器
    const timerSub = timerService.timer$.subscribe(setTimerValue);

    return () => {
      searchSub.unsubscribe();
      timerSub.unsubscribe();
    };
  }, []);

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

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleFetchAndProcess = () => {
    // 使用RxJS获取数据，然后用Lodash处理
    fetchData('demo').subscribe({
      next: (data) => {
        // 使用Lodash处理数据
        const processed = {
          // 字符串处理
          processedTitle: stringUtils.capitalize(data.title),
          processedDescription: stringUtils.truncate(data.description, 50),

          // 数组处理
          uniqueNumbers: arrayUtils.removeDuplicates([1, 2, 2, 3, 4, 4, 5]),

          // 对象处理
          pickedData: objectUtils.pickProperties(data, ['id', 'title']),

          // 数字处理
          randomNumber: numberUtils.random(1, 100),
          sumOfNumbers: numberUtils.sum([1, 2, 3, 4, 5]),
        };

        setProcessedData(processed);
        Alert.alert('✅ 数据处理完成', '数据已使用Lodash处理完成！');
      },
      error: (error) => {
        Alert.alert('❌ 错误', error.message);
      },
    });
  };

  const handleComplexDemo = () => {
    // 综合演示：Zustand + RxJS + Lodash
    const demoData = [
      { id: 1, name: 'Alice', age: 25, city: 'Beijing', score: 85 },
      { id: 2, name: 'Bob', age: 30, city: 'Shanghai', score: 92 },
      { id: 3, name: 'Charlie', age: 25, city: 'Beijing', score: 78 },
      { id: 4, name: 'David', age: 35, city: 'Guangzhou', score: 95 },
    ];

    // 使用Lodash处理数据
    const processed = {
      // 数组操作
      uniqueCities: arrayUtils.removeDuplicates(demoData.map((item: any) => item.city)),
      groupedByAge: arrayUtils.groupByProperty(demoData, 'age'),

      // 对象操作
      highScores: demoData.filter((item: any) => item.score > 80),

      // 数字操作
      averageScore: numberUtils.mean(demoData.map((item: any) => item.score)),
      maxScore: numberUtils.max(demoData.map((item: any) => item.score)),

      // 字符串操作
      processedNames: demoData.map((item: any) => stringUtils.capitalize(item.name)),
    };

    setProcessedData(processed);
    Alert.alert('🚀 综合演示', 'Zustand + RxJS + Lodash 联合使用演示完成！');
  };

  return (
    <ScrollView className="flex-1 bg-green-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <Text className="text-2xl">🚀</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-gray-800">综合库演示</Text>
          <Text className="text-center text-gray-600">展示 Zustand + RxJS + Lodash 的联合使用</Text>
        </View>

        {/* Zustand Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg text-blue-600">⚡</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Zustand 状态管理</Text>
          </View>

          <View className="mb-4 flex-row items-center justify-center space-x-4">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-lg"
              onPress={decrement}
              activeOpacity={0.8}>
              <Text className="text-xl font-bold text-white">-</Text>
            </TouchableOpacity>

            <View className="rounded-xl bg-blue-500 px-6 py-3 shadow-lg">
              <Text className="text-center text-2xl font-bold text-white">{counter}</Text>
            </View>

            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg"
              onPress={increment}
              activeOpacity={0.8}>
              <Text className="text-xl font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <TextInput
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              value={newTodoText}
              onChangeText={setNewTodoText}
              placeholder="添加Todo"
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity
              className="rounded-xl bg-blue-500 px-4 py-3 shadow-lg"
              onPress={handleAddTodo}
              activeOpacity={0.8}>
              <Text className="font-semibold text-white">添加</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-2">
            {todos.slice(0, 3).map((todo) => (
              <View key={todo.id} className="flex-row items-center rounded-xl bg-gray-50 p-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center"
                  onPress={() => toggleTodo(todo.id)}>
                  <View
                    className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                      todo.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                    }`}>
                    {todo.completed && <Text className="text-xs text-white">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 ${
                      todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}>
                    {todo.text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* RxJS Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Text className="text-lg text-purple-600">🔄</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">RxJS 响应式编程</Text>
          </View>

          <TextInput
            className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder="搜索 (防抖演示)"
          />

          <View className="mb-4 flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 rounded-xl py-3 shadow-lg ${
                timerSubscription ? 'bg-gray-400' : 'bg-green-500'
              }`}
              onPress={handleStartTimer}
              disabled={!!timerSubscription}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">开始定时器</Text>
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
          </View>

          <View className="mb-4 items-center">
            <View className="rounded-xl bg-orange-500 px-6 py-4 shadow-lg">
              <Text className="text-center text-3xl font-bold text-white">{timerValue}</Text>
            </View>
          </View>

          {searchResults.length > 0 && (
            <View className="space-y-2">
              <Text className="font-semibold text-gray-800">搜索结果:</Text>
              {searchResults.slice(0, 2).map((result, index) => (
                <View key={index} className="rounded-xl border border-green-100 bg-green-50 p-3">
                  <Text className="mb-1 font-semibold text-gray-800">{result.title}</Text>
                  <Text className="text-sm text-gray-600">{result.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Lodash Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
              <Text className="text-lg text-cyan-600">🛠️</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Lodash 数据处理</Text>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 rounded-xl bg-purple-500 py-3 shadow-lg"
              onPress={handleFetchAndProcess}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">获取并处理数据</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 rounded-xl bg-orange-500 py-3 shadow-lg"
              onPress={handleComplexDemo}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">综合演示</Text>
            </TouchableOpacity>
          </View>

          {processedData.processedTitle && (
            <View className="space-y-3">
              <View className="rounded-xl bg-blue-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">处理结果:</Text>
                <Text className="text-gray-600">标题: {processedData.processedTitle}</Text>
                <Text className="text-gray-600">描述: {processedData.processedDescription}</Text>
                <Text className="text-gray-600">随机数: {processedData.randomNumber}</Text>
                <Text className="text-gray-600">数字求和: {processedData.sumOfNumbers}</Text>
              </View>
            </View>
          )}

          {processedData.uniqueCities && (
            <View className="mt-4 space-y-3">
              <View className="rounded-xl bg-green-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">综合处理结果:</Text>
                <Text className="text-gray-600">
                  唯一城市: {JSON.stringify(processedData.uniqueCities)}
                </Text>
                <Text className="text-gray-600">
                  平均分数: {processedData.averageScore?.toFixed(2)}
                </Text>
                <Text className="text-gray-600">最高分数: {processedData.maxScore}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Library Integration */}
        <View className="rounded-2xl bg-green-500 p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-white">🔧 库集成特性</Text>

          <View className="space-y-3">
            <View>
              <Text className="font-semibold text-white/90">Zustand</Text>
              <Text className="text-sm text-white/80">• 轻量级状态管理</Text>
              <Text className="text-sm text-white/80">• 简单易用的API</Text>
              <Text className="text-sm text-white/80">• 支持TypeScript</Text>
            </View>

            <View>
              <Text className="font-semibold text-white/90">RxJS</Text>
              <Text className="text-sm text-white/80">• 响应式编程</Text>
              <Text className="text-sm text-white/80">• 事件流处理</Text>
              <Text className="text-sm text-white/80">• 异步操作管理</Text>
            </View>

            <View>
              <Text className="font-semibold text-white/90">Lodash</Text>
              <Text className="text-sm text-white/80">• 实用工具函数</Text>
              <Text className="text-sm text-white/80">• 数据处理</Text>
              <Text className="text-sm text-white/80">• 函数式编程</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
