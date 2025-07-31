import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useStore } from '../store/useStore';

export const ZustandDemoScreen = () => {
  const {
    counter,
    user,
    todos,
    increment,
    decrement,
    setUser,
    addTodo,
    toggleTodo,
    removeTodo,
  } = useStore();

  const [newTodoText, setNewTodoText] = useState('');
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleSetUser = () => {
    if (userName.trim() && userEmail.trim()) {
      setUser(userName.trim(), userEmail.trim());
      Alert.alert('✅ 成功', '用户信息已更新！');
    } else {
      Alert.alert('❌ 错误', '请输入用户名和邮箱！');
    }
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-2xl">⚡</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Zustand 状态管理
          </Text>
          <Text className="text-gray-600 text-center">
            轻量级状态管理，简单而强大
          </Text>
        </View>

        {/* Counter Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-blue-600 text-lg">🔢</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">计数器演示</Text>
          </View>
          
          <View className="flex-row items-center justify-center space-x-6 mb-4">
            <TouchableOpacity
              className="w-14 h-14 bg-red-500 rounded-full items-center justify-center shadow-lg"
              onPress={decrement}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-2xl">-</Text>
            </TouchableOpacity>
            
            <View className="bg-blue-500 px-8 py-4 rounded-2xl shadow-lg">
              <Text className="text-4xl font-bold text-white text-center">
                {counter}
              </Text>
            </View>
            
            <TouchableOpacity
              className="w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg"
              onPress={increment}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-2xl">+</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-center text-gray-600">
            点击按钮来增加或减少计数
          </Text>
        </View>

        {/* User Info Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Text className="text-green-600 text-lg">👤</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">用户信息管理</Text>
          </View>
          
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">用户名</Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                value={userName}
                onChangeText={setUserName}
                placeholder="输入用户名"
              />
            </View>
            
            <View>
              <Text className="text-gray-700 font-medium mb-2">邮箱</Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="输入邮箱"
                keyboardType="email-address"
              />
            </View>
            
            <TouchableOpacity
              className="bg-green-500 py-4 rounded-xl shadow-lg"
              onPress={handleSetUser}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-lg">
                更新用户信息
              </Text>
            </TouchableOpacity>
          </View>
          
          {user.name && (
            <View className="mt-4 bg-blue-50 p-4 rounded-xl">
              <Text className="text-gray-800 font-medium mb-1">
                📋 当前用户信息
              </Text>
              <Text className="text-gray-700">
                <Text className="font-semibold">用户名：</Text> {user.name}
              </Text>
              <Text className="text-gray-700">
                <Text className="font-semibold">邮箱：</Text> {user.email}
              </Text>
            </View>
          )}
        </View>

        {/* Todo List Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-600 text-lg">📝</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Todo 列表管理</Text>
          </View>
          
          <View className="flex-row space-x-3 mb-4">
            <TextInput
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
              value={newTodoText}
              onChangeText={setNewTodoText}
              placeholder="输入新的Todo"
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity
              className="bg-purple-500 px-6 py-3 rounded-xl shadow-lg"
              onPress={handleAddTodo}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">添加</Text>
            </TouchableOpacity>
          </View>
          
          <View className="space-y-3">
            {todos.map((todo) => (
              <View
                key={todo.id}
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <TouchableOpacity
                  className="flex-1 flex-row items-center"
                  onPress={() => toggleTodo(todo.id)}
                >
                  <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                  }`}>
                    {todo.completed && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-lg ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded-lg"
                  onPress={() => removeTodo(todo.id)}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-medium">删除</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {todos.length === 0 && (
              <View className="items-center py-8">
                <Text className="text-gray-400 text-lg">📝 暂无Todo，请添加一个</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View className="bg-blue-500 rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-white mb-4">
            📊 状态统计
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">{counter}</Text>
              <Text className="text-white/80 text-sm">计数器</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">{todos.length}</Text>
              <Text className="text-white/80 text-sm">Todo总数</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {todos.filter(t => t.completed).length}
              </Text>
              <Text className="text-white/80 text-sm">已完成</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}; 