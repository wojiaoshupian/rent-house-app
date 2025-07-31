import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { 
  arrayUtils, 
  objectUtils, 
  stringUtils, 
  numberUtils, 
  functionUtils,
  collectionUtils 
} from '../utils/lodashUtils';

export const LodashDemoScreen = () => {
  const [inputText, setInputText] = useState('');
  const [arrayInput, setArrayInput] = useState('');
  const [objectInput, setObjectInput] = useState('');
  const [results, setResults] = useState<any>({});

  // 示例数据
  const sampleArray = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10];
  const sampleObjects = [
    { id: 1, name: 'Alice', age: 25, city: 'Beijing' },
    { id: 2, name: 'Bob', age: 30, city: 'Shanghai' },
    { id: 3, name: 'Charlie', age: 25, city: 'Beijing' },
    { id: 4, name: 'David', age: 35, city: 'Guangzhou' },
  ];

  const handleArrayDemo = () => {
    const demoResults = {
      '去重并排序': arrayUtils.uniqueAndSort([...sampleArray, 1, 2, 3]),
      '分组 (按年龄)': arrayUtils.groupByProperty(sampleObjects, 'age'),
      '查找 (年龄>25)': arrayUtils.findAndFilter(sampleObjects, (obj: any) => obj.age > 25),
      '分块 (每3个)': arrayUtils.chunkArray(sampleArray, 3),
      '去重': arrayUtils.removeDuplicates([...sampleArray, 1, 2, 3]),
    };
    setResults(demoResults);
  };

  const handleObjectDemo = () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } };
    const obj2 = { b: { d: 4, e: 5 }, f: 6 };
    
    const demoResults = {
      '深度合并': objectUtils.deepMerge(obj1, obj2),
      '获取嵌套值': objectUtils.getNestedValue(obj1, 'b.c', 'default'),
      '设置嵌套值': objectUtils.setNestedValue(obj1, 'b.g', 7),
      '选择属性': objectUtils.pickProperties(sampleObjects[0], ['name', 'age']),
      '排除属性': objectUtils.omitProperties(sampleObjects[0], ['id']),
      '对象比较': objectUtils.isEqual(obj1, { ...obj1 }),
    };
    setResults(demoResults);
  };

  const handleStringDemo = () => {
    const demoResults = {
      '驼峰转换': stringUtils.toCamelCase('hello world example'),
      '下划线转换': stringUtils.toSnakeCase('HelloWorldExample'),
      '首字母大写': stringUtils.capitalize('hello world'),
      '截断字符串': stringUtils.truncate('这是一个很长的字符串，需要被截断', 10),
      '模板字符串': stringUtils.template('Hello <%= name %>, you are <%= age %> years old', { name: 'Alice', age: 25 }),
    };
    setResults(demoResults);
  };

  const handleNumberDemo = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const demoResults = {
      '随机数 (1-100)': numberUtils.random(1, 100),
      '数字范围 (1-10)': numberUtils.range(1, 11),
      '求和': numberUtils.sum(numbers),
      '平均值': numberUtils.mean(numbers),
      '最大值': numberUtils.max(numbers),
      '最小值': numberUtils.min(numbers),
    };
    setResults(demoResults);
  };

  const handleFunctionDemo = () => {
    // 防抖函数示例
    const debouncedAlert = functionUtils.debounce(() => {
      Alert.alert('防抖', '这是防抖函数的演示');
    }, 1000);

    // 节流函数示例
    const throttledAlert = functionUtils.throttle(() => {
      Alert.alert('节流', '这是节流函数的演示');
    }, 2000);

    // 柯里化函数示例
    const add = (a: number, b: number) => a + b;
    const curriedAdd = functionUtils.curry(add);
    const addFive = curriedAdd(5);

    const demoResults = {
      '防抖函数': '已创建，点击按钮测试',
      '节流函数': '已创建，点击按钮测试',
      '柯里化函数': `add(5, 3) = ${curriedAdd(5)(3)}`,
      '柯里化函数2': `addFive(3) = ${addFive(3)}`,
    };
    setResults(demoResults);

    // 存储函数引用以便测试
    (global as any).debouncedAlert = debouncedAlert;
    (global as any).throttledAlert = throttledAlert;
  };

  const handleCollectionDemo = () => {
    const demoResults = {
      '映射集合': collectionUtils.mapCollection(sampleObjects, (obj: any) => obj.name),
      '过滤集合': collectionUtils.filterCollection(sampleObjects, (obj: any) => obj.age > 25),
      '归约集合': collectionUtils.reduceCollection(sampleObjects, (acc: any, obj: any) => acc + obj.age, 0),
      '排序集合': collectionUtils.sortCollection(sampleObjects, 'age'),
      '去重集合': collectionUtils.uniqueCollection(sampleObjects, 'city'),
    };
    setResults(demoResults);
  };

  const testDebounce = () => {
    (global as any).debouncedAlert?.();
  };

  const testThrottle = () => {
    (global as any).throttledAlert?.();
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-2xl">🛠️</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Lodash 工具库
          </Text>
          <Text className="text-gray-600 text-center">
            JavaScript实用工具函数库
          </Text>
        </View>

        {/* Array Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-blue-600 text-lg">📊</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">数组操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleArrayDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行数组操作演示
            </Text>
          </TouchableOpacity>
          
          {results['去重并排序'] && (
            <View className="space-y-3">
              <View className="p-3 bg-blue-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">去重并排序:</Text>
                <Text className="text-gray-600">{JSON.stringify(results['去重并排序'])}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Object Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Text className="text-green-600 text-lg">📦</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">对象操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-green-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleObjectDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行对象操作演示
            </Text>
          </TouchableOpacity>
          
          {results['深度合并'] && (
            <View className="space-y-3">
              <View className="p-3 bg-green-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">深度合并:</Text>
                <Text className="text-gray-600 text-xs">{JSON.stringify(results['深度合并'], null, 2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* String Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-600 text-lg">📝</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">字符串操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-purple-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleStringDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行字符串操作演示
            </Text>
          </TouchableOpacity>
          
          {results['驼峰转换'] && (
            <View className="space-y-3">
              <View className="p-3 bg-purple-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">驼峰转换:</Text>
                <Text className="text-gray-600">{results['驼峰转换']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Number Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Text className="text-orange-600 text-lg">🔢</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">数字操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleNumberDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行数字操作演示
            </Text>
          </TouchableOpacity>
          
          {results['随机数 (1-100)'] && (
            <View className="space-y-3">
              <View className="p-3 bg-orange-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">随机数:</Text>
                <Text className="text-gray-600">{results['随机数 (1-100)']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Function Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <Text className="text-red-600 text-lg">⚡</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">函数操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-red-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleFunctionDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行函数操作演示
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row space-x-3 mb-4">
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-xl shadow-lg"
              onPress={testDebounce}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">测试防抖</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-xl shadow-lg"
              onPress={testThrottle}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">测试节流</Text>
            </TouchableOpacity>
          </View>
          
          {results['柯里化函数'] && (
            <View className="space-y-3">
              <View className="p-3 bg-red-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">柯里化函数:</Text>
                <Text className="text-gray-600">{results['柯里化函数']}</Text>
                <Text className="text-gray-600">{results['柯里化函数2']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Collection Operations */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
              <Text className="text-indigo-600 text-lg">📋</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">集合操作演示</Text>
          </View>
          
          <TouchableOpacity
            className="bg-indigo-500 py-3 rounded-xl shadow-lg mb-4"
            onPress={handleCollectionDemo}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              运行集合操作演示
            </Text>
          </TouchableOpacity>
          
          {results['映射集合'] && (
            <View className="space-y-3">
              <View className="p-3 bg-indigo-50 rounded-xl">
                <Text className="font-semibold text-gray-800 mb-1">映射集合:</Text>
                <Text className="text-gray-600">{JSON.stringify(results['映射集合'])}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Lodash Features */}
        <View className="bg-blue-500 rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-white mb-4">
            🔧 Lodash 特性演示
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">数组操作 - uniq, groupBy, chunk</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">对象操作 - merge, get, set, pick, omit</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">字符串操作 - camelCase, snakeCase, capitalize</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">数字操作 - random, range, sum, mean</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">函数操作 - debounce, throttle, curry</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="text-white/90 ml-2">集合操作 - map, filter, reduce, sortBy</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}; 