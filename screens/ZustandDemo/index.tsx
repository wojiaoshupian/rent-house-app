import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useStore } from '../../store/useStore';

export const ZustandDemoScreen = () => {
  const { counter, user, todos, increment, decrement, setUser, addTodo, toggleTodo, removeTodo } =
    useStore();

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
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Text className="text-2xl">⚡</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-gray-800">Zustand 状态管理</Text>
          <Text className="text-center text-gray-600">轻量级状态管理，简单而强大</Text>
        </View>

        {/* Counter Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg text-blue-600">🔢</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">计数器演示</Text>
          </View>

          <View className="mb-4 flex-row items-center justify-center space-x-6">
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg"
              onPress={decrement}
              activeOpacity={0.8}>
              <Text className="text-2xl font-bold text-white">-</Text>
            </TouchableOpacity>

            <View className="rounded-2xl bg-blue-500 px-8 py-4 shadow-lg">
              <Text className="text-center text-4xl font-bold text-white">{counter}</Text>
            </View>

            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg"
              onPress={increment}
              activeOpacity={0.8}>
              <Text className="text-2xl font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-600">点击按钮来增加或减少计数</Text>
        </View>

        {/* User Info Section */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Text className="text-lg text-green-600">👤</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">用户信息管理</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="mb-2 font-medium text-gray-700">用户名</Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                value={userName}
                onChangeText={setUserName}
                placeholder="输入用户名"
              />
            </View>

            <View>
              <Text className="mb-2 font-medium text-gray-700">邮箱</Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="输入邮箱"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              className="rounded-xl bg-green-500 py-4 shadow-lg"
              onPress={handleSetUser}
              activeOpacity={0.8}>
              <Text className="text-center text-lg font-semibold text-white">更新用户信息</Text>
            </TouchableOpacity>
          </View>

          {user.name && (
            <View className="mt-4 rounded-xl bg-blue-50 p-4">
              <Text className="mb-1 font-medium text-gray-800">📋 当前用户信息</Text>
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
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Text className="text-lg text-purple-600">📝</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Todo 列表管理</Text>
          </View>

          <View className="mb-4 flex-row space-x-3">
            <TextInput
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              value={newTodoText}
              onChangeText={setNewTodoText}
              placeholder="输入新的Todo"
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity
              className="rounded-xl bg-purple-500 px-6 py-3 shadow-lg"
              onPress={handleAddTodo}
              activeOpacity={0.8}>
              <Text className="font-semibold text-white">添加</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {todos.map((todo) => (
              <View
                key={todo.id}
                className="flex-row items-center justify-between rounded-xl bg-gray-50 p-4">
                <TouchableOpacity
                  className="flex-1 flex-row items-center"
                  onPress={() => toggleTodo(todo.id)}>
                  <View
                    className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
                      todo.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                    }`}>
                    {todo.completed && <Text className="text-xs text-white">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 text-lg ${
                      todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}>
                    {todo.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="rounded-lg bg-red-500 px-4 py-2"
                  onPress={() => removeTodo(todo.id)}
                  activeOpacity={0.8}>
                  <Text className="font-medium text-white">删除</Text>
                </TouchableOpacity>
              </View>
            ))}

            {todos.length === 0 && (
              <View className="items-center py-8">
                <Text className="text-lg text-gray-400">📝 暂无Todo，请添加一个</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View className="rounded-2xl bg-blue-500 p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-white">📊 状态统计</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">{counter}</Text>
              <Text className="text-sm text-white/80">计数器</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">{todos.length}</Text>
              <Text className="text-sm text-white/80">Todo总数</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {todos.filter((t) => t.completed).length}
              </Text>
              <Text className="text-sm text-white/80">已完成</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
