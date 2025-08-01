import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  arrayUtils,
  objectUtils,
  stringUtils,
  numberUtils,
  functionUtils,
  collectionUtils,
} from '../../utils/lodashUtils';

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
      去重并排序: arrayUtils.uniqueAndSort([...sampleArray, 1, 2, 3]),
      '分组 (按年龄)': arrayUtils.groupByProperty(sampleObjects, 'age'),
      '查找 (年龄>25)': arrayUtils.findAndFilter(sampleObjects, (obj: any) => obj.age > 25),
      '分块 (每3个)': arrayUtils.chunkArray(sampleArray, 3),
      去重: arrayUtils.removeDuplicates([...sampleArray, 1, 2, 3]),
    };
    setResults(demoResults);
  };

  const handleObjectDemo = () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } };
    const obj2 = { b: { d: 4, e: 5 }, f: 6 };

    const demoResults = {
      深度合并: objectUtils.deepMerge(obj1, obj2),
      获取嵌套值: objectUtils.getNestedValue(obj1, 'b.c', 'default'),
      设置嵌套值: objectUtils.setNestedValue(obj1, 'b.g', 7),
      选择属性: objectUtils.pickProperties(sampleObjects[0], ['name', 'age']),
      排除属性: objectUtils.omitProperties(sampleObjects[0], ['id']),
      对象比较: objectUtils.isEqual(obj1, { ...obj1 }),
    };
    setResults(demoResults);
  };

  const handleStringDemo = () => {
    const demoResults = {
      驼峰转换: stringUtils.toCamelCase('hello world example'),
      下划线转换: stringUtils.toSnakeCase('HelloWorldExample'),
      首字母大写: stringUtils.capitalize('hello world'),
      截断字符串: stringUtils.truncate('这是一个很长的字符串，需要被截断', 10),
      模板字符串: stringUtils.template('Hello <%= name %>, you are <%= age %> years old', {
        name: 'Alice',
        age: 25,
      }),
    };
    setResults(demoResults);
  };

  const handleNumberDemo = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const demoResults = {
      '随机数 (1-100)': numberUtils.random(1, 100),
      '数字范围 (1-10)': numberUtils.range(1, 11),
      求和: numberUtils.sum(numbers),
      平均值: numberUtils.mean(numbers),
      最大值: numberUtils.max(numbers),
      最小值: numberUtils.min(numbers),
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
      防抖函数: '已创建，点击按钮测试',
      节流函数: '已创建，点击按钮测试',
      柯里化函数: `add(5, 3) = ${curriedAdd(5)(3)}`,
      柯里化函数2: `addFive(3) = ${addFive(3)}`,
    };
    setResults(demoResults);

    // 存储函数引用以便测试
    (global as any).debouncedAlert = debouncedAlert;
    (global as any).throttledAlert = throttledAlert;
  };

  const handleCollectionDemo = () => {
    const demoResults = {
      映射集合: collectionUtils.mapCollection(sampleObjects, (obj: any) => obj.name),
      过滤集合: collectionUtils.filterCollection(sampleObjects, (obj: any) => obj.age > 25),
      归约集合: collectionUtils.reduceCollection(
        sampleObjects,
        (acc: any, obj: any) => acc + obj.age,
        0
      ),
      排序集合: collectionUtils.sortCollection(sampleObjects, 'age'),
      去重集合: collectionUtils.uniqueCollection(sampleObjects, 'city'),
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
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Text className="text-2xl">🛠️</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-gray-800">Lodash 工具库</Text>
          <Text className="text-center text-gray-600">JavaScript实用工具函数库</Text>
        </View>

        {/* Array Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg text-blue-600">📊</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">数组操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-blue-500 py-3 shadow-lg"
            onPress={handleArrayDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行数组操作演示</Text>
          </TouchableOpacity>

          {results['去重并排序'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-blue-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">去重并排序:</Text>
                <Text className="text-gray-600">{JSON.stringify(results['去重并排序'])}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Object Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Text className="text-lg text-green-600">📦</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">对象操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-green-500 py-3 shadow-lg"
            onPress={handleObjectDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行对象操作演示</Text>
          </TouchableOpacity>

          {results['深度合并'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-green-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">深度合并:</Text>
                <Text className="text-xs text-gray-600">
                  {JSON.stringify(results['深度合并'], null, 2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* String Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Text className="text-lg text-purple-600">📝</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">字符串操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-purple-500 py-3 shadow-lg"
            onPress={handleStringDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行字符串操作演示</Text>
          </TouchableOpacity>

          {results['驼峰转换'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-purple-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">驼峰转换:</Text>
                <Text className="text-gray-600">{results['驼峰转换']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Number Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Text className="text-lg text-orange-600">🔢</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">数字操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-orange-500 py-3 shadow-lg"
            onPress={handleNumberDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行数字操作演示</Text>
          </TouchableOpacity>

          {results['随机数 (1-100)'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-orange-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">随机数:</Text>
                <Text className="text-gray-600">{results['随机数 (1-100)']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Function Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Text className="text-lg text-red-600">⚡</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">函数操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-red-500 py-3 shadow-lg"
            onPress={handleFunctionDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行函数操作演示</Text>
          </TouchableOpacity>

          <View className="mb-4 flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 rounded-xl bg-blue-500 py-3 shadow-lg"
              onPress={testDebounce}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">测试防抖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 rounded-xl bg-green-500 py-3 shadow-lg"
              onPress={testThrottle}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">测试节流</Text>
            </TouchableOpacity>
          </View>

          {results['柯里化函数'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-red-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">柯里化函数:</Text>
                <Text className="text-gray-600">{results['柯里化函数']}</Text>
                <Text className="text-gray-600">{results['柯里化函数2']}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Collection Operations */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <Text className="text-lg text-indigo-600">📋</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">集合操作演示</Text>
          </View>

          <TouchableOpacity
            className="mb-4 rounded-xl bg-indigo-500 py-3 shadow-lg"
            onPress={handleCollectionDemo}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">运行集合操作演示</Text>
          </TouchableOpacity>

          {results['映射集合'] && (
            <View className="space-y-3">
              <View className="rounded-xl bg-indigo-50 p-3">
                <Text className="mb-1 font-semibold text-gray-800">映射集合:</Text>
                <Text className="text-gray-600">{JSON.stringify(results['映射集合'])}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Lodash Features */}
        <View className="rounded-2xl bg-blue-500 p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-white">🔧 Lodash 特性演示</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">数组操作 - uniq, groupBy, chunk</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">对象操作 - merge, get, set, pick, omit</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">
                字符串操作 - camelCase, snakeCase, capitalize
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">数字操作 - random, range, sum, mean</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">函数操作 - debounce, throttle, curry</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white/90">•</Text>
              <Text className="ml-2 text-white/90">集合操作 - map, filter, reduce, sortBy</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
