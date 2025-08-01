import React, { useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { buildingService } from '../../services/buildingService';
import { CreateBuildingRequest } from '../../types/building';
import { catchError, of } from 'rxjs';
import { BuildingForm } from './BuildingForm';
import { validateBuildingForm } from './validation';

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

  // 提交表单
  const handleSubmit = () => {
    if (!validateBuildingForm(formData)) return;

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
      <BuildingForm
        formData={formData}
        updateFormData={updateFormData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </View>
  );
};
