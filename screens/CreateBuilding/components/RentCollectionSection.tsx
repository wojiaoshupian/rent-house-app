import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreateBuildingRequest, RENT_COLLECTION_METHODS } from '../../../types/building';

interface RentCollectionSectionProps {
  formData: CreateBuildingRequest;
  updateFormData: (field: keyof CreateBuildingRequest, value: any) => void;
}

export const RentCollectionSection: React.FC<RentCollectionSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">收租方式</Text>
      
      {RENT_COLLECTION_METHODS.map((method) => (
        <TouchableOpacity
          key={method.value}
          className={`flex-row items-center p-3 rounded-lg mb-2 ${
            formData.rentCollectionMethod === method.value
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
          onPress={() => updateFormData('rentCollectionMethod', method.value)}
        >
          <View
            className={`w-5 h-5 rounded-full border-2 mr-3 ${
              formData.rentCollectionMethod === method.value
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}
          >
            {formData.rentCollectionMethod === method.value && (
              <View className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
            )}
          </View>
          <Text className="text-gray-800">{method.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
