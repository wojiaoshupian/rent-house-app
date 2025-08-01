import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FormFields } from './components/FormFields';
import { InfoCard } from './components/InfoCard';

interface RegisterFormProps {
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
  onBack: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  updateFormData,
  onRegister,
  loading,
  onBack,
}) => {
  return (
    <ScrollView className="flex-1">
      {/* Header */}
      <View className="bg-white px-6 py-6 shadow-sm">
        <Text className="mb-2 text-3xl font-bold text-gray-800">用户注册</Text>
        <Text className="text-base text-gray-500">创建您的账户</Text>
      </View>

      {/* Form */}
      <View className="p-5">
        <FormFields
          formData={formData}
          updateFormData={updateFormData}
          onRegister={onRegister}
          loading={loading}
        />

        {/* Info Card */}
        <InfoCard />

        {/* Back Button */}
        <View className="mt-6">
          <TouchableOpacity
            className="items-center rounded-xl bg-gray-500 py-4"
            onPress={onBack}>
            <Text className="text-base font-semibold text-white">返回</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
