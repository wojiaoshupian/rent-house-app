import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CreateBuildingRequest } from '../../../types/building';

interface BasicInfoSectionProps {
  formData: CreateBuildingRequest;
  updateFormData: (field: keyof CreateBuildingRequest, value: any) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">基本信息</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">楼宇名称 *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="请输入楼宇名称"
          value={formData.buildingName}
          onChangeText={(text) => updateFormData('buildingName', text)}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">房东名称 *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="请输入房东名称"
          value={formData.landlordName}
          onChangeText={(text) => updateFormData('landlordName', text)}
        />
      </View>
    </View>
  );
};
