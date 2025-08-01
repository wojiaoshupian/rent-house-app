import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { validatePhone } from '../validation';

interface FormFieldsProps {
  formData: {
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
    confirmPhone: string;
  };
  updateFormData: (field: string, value: string) => void;
  onRegister: () => void;
  loading: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  updateFormData,
  onRegister,
  loading,
}) => {
  return (
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-md">
      <Text className="mb-4 text-xl font-bold text-gray-800">注册信息</Text>

      {/* Username */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">用户名 *</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          placeholder="请输入用户名"
          value={formData.username}
          onChangeText={(text) => updateFormData('username', text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Phone */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">手机号 *</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          placeholder="请输入手机号"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
          maxLength={11}
        />
        {formData.phone && !validatePhone(formData.phone) && (
          <Text className="mt-1 text-xs text-red-500">请输入正确的手机号格式</Text>
        )}
      </View>

      {/* Confirm Phone */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">确认手机号 *</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          placeholder="请再次输入手机号"
          value={formData.confirmPhone}
          onChangeText={(text) => updateFormData('confirmPhone', text)}
          keyboardType="phone-pad"
          maxLength={11}
        />
        {formData.confirmPhone && formData.phone !== formData.confirmPhone && (
          <Text className="mt-1 text-xs text-red-500">两次输入的手机号不一致</Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">密码 *</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          placeholder="请输入密码（至少6位）"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Confirm Password */}
      <View className="mb-6">
        <Text className="mb-2 text-sm font-medium text-gray-700">确认密码 *</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          placeholder="请再次输入密码"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          secureTextEntry
          autoCapitalize="none"
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <Text className="mt-1 text-xs text-red-500">两次输入的密码不一致</Text>
        )}
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className={`items-center rounded-xl py-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
        onPress={onRegister}
        disabled={loading}>
        <Text className="text-base font-semibold text-white">
          {loading ? '注册中...' : '注册'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
