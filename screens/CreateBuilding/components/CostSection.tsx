import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CreateBuildingRequest } from '../../../types/building';

interface CostSectionProps {
  formData: CreateBuildingRequest;
  updateFormData: (field: keyof CreateBuildingRequest, value: any) => void;
}

export const CostSection: React.FC<CostSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">成本设置（可选）</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">电费成本 (元/度)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.electricityCost?.toString() || ''}
          onChangeText={(text) => updateFormData('electricityCost', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">水费成本 (元/吨)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.waterCost?.toString() || ''}
          onChangeText={(text) => updateFormData('waterCost', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">热水费成本 (元/吨)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.hotWaterCost?.toString() || ''}
          onChangeText={(text) => updateFormData('hotWaterCost', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};
