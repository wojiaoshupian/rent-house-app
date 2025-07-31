import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { buildingService } from '../services/buildingService';
import { CreateBuildingRequest, RENT_COLLECTION_METHODS } from '../types/building';
import { catchError, of } from 'rxjs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateBuildingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState<CreateBuildingRequest>({
    buildingName: '',
    landlordName: '',
    electricityUnitPrice: 0,
    waterUnitPrice: 0,
    hotWaterUnitPrice: 0,
    electricityCost: 0,
    waterCost: 0,
    hotWaterCost: 0,
    rentCollectionMethod: 'FIXED_MONTH_START',
  });

  // 更新表单数据
  const updateFormData = (field: keyof CreateBuildingRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.buildingName.trim()) {
      Alert.alert('验证失败', '请输入楼宇名称');
      return false;
    }
    if (!formData.landlordName.trim()) {
      Alert.alert('验证失败', '请输入房东名称');
      return false;
    }
    if (formData.electricityUnitPrice <= 0) {
      Alert.alert('验证失败', '电费单价必须大于0');
      return false;
    }
    if (formData.waterUnitPrice <= 0) {
      Alert.alert('验证失败', '水费单价必须大于0');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);

    // 处理可选字段，如果为0则设为undefined
    const submitData: CreateBuildingRequest = {
      ...formData,
      hotWaterUnitPrice: formData.hotWaterUnitPrice || undefined,
      electricityCost: formData.electricityCost || undefined,
      waterCost: formData.waterCost || undefined,
      hotWaterCost: formData.hotWaterCost || undefined,
    };

    buildingService
      .createBuilding(submitData)
      .pipe(
        catchError((error) => {
          console.error('创建楼宇失败:', error);
          const errorMessage = error.message || '创建楼宇失败，请重试';
          Alert.alert('创建失败', errorMessage);
          return of(null);
        })
      )
      .subscribe({
        next: (building) => {
          setLoading(false);
          if (building) {
            Alert.alert('创建成功', `楼宇 "${building.buildingName}" 创建成功！`, [
              {
                text: '确定',
                onPress: () => navigation.goBack(),
              },
            ]);
          }
        },
        error: (error) => {
          console.error('RxJS错误:', error);
          setLoading(false);
          Alert.alert('错误', '网络请求失败，请检查网络连接');
        },
      });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">创建楼宇</Text>
          <Text className="text-gray-600">请填写楼宇的基本信息</Text>
        </View>

        {/* 基本信息 */}
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

        {/* 费用设置 */}
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

        {/* 成本设置 */}
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

        {/* 收租方式 */}
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

        {/* 提交按钮 */}
        <TouchableOpacity
          className={`rounded-lg py-4 mb-8 ${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
          onPress={handleSubmit}
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
    </View>
  );
};
