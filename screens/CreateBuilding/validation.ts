import { Alert } from 'react-native';
import { CreateBuildingRequest } from '../../types/building';

export const validateBuildingForm = (formData: CreateBuildingRequest): boolean => {
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
