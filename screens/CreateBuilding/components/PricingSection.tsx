import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CreateBuildingRequest } from '../../../types/building';

interface PricingSectionProps {
  formData: CreateBuildingRequest;
  updateFormData: (field: keyof CreateBuildingRequest, value: any) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">费用设置</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">电费单价 (元/度) *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.electricityUnitPrice.toString()}
          onChangeText={(text) => updateFormData('electricityUnitPrice', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">水费单价 (元/吨) *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.waterUnitPrice.toString()}
          onChangeText={(text) => updateFormData('waterUnitPrice', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">热水单价 (元/吨)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
          placeholder="0.00"
          value={formData.hotWaterUnitPrice?.toString() || ''}
          onChangeText={(text) => updateFormData('hotWaterUnitPrice', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};
