import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CreateBuildingRequest } from '../../types/building';
import { BasicInfoSection } from './components/BasicInfoSection';
import { PricingSection } from './components/PricingSection';
import { CostSection } from './components/CostSection';
import { RentCollectionSection } from './components/RentCollectionSection';

interface BuildingFormProps {
  formData: CreateBuildingRequest;
  updateFormData: (field: keyof CreateBuildingRequest, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const BuildingForm: React.FC<BuildingFormProps> = ({
  formData,
  updateFormData,
  onSubmit,
  loading,
}) => {
  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">创建楼宇</Text>
        <Text className="text-gray-600">请填写楼宇的基本信息</Text>
      </View>

      {/* 基本信息 */}
      <BasicInfoSection formData={formData} updateFormData={updateFormData} />

      {/* 费用设置 */}
      <PricingSection formData={formData} updateFormData={updateFormData} />

      {/* 成本设置 */}
      <CostSection formData={formData} updateFormData={updateFormData} />

      {/* 收租方式 */}
      <RentCollectionSection formData={formData} updateFormData={updateFormData} />

      {/* 提交按钮 */}
      <TouchableOpacity
        className={`rounded-lg py-4 mb-8 ${
          loading ? 'bg-gray-400' : 'bg-blue-500'
        }`}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-semibold ml-2">创建中...</Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-center text-lg">创建楼宇</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
