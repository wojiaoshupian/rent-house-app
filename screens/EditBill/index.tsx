import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { billService } from '../../services/billService';
import { BillDetail, UpdateBillRequest, BillType, BillStatus, BILL_TYPE_OPTIONS, BILL_STATUS_OPTIONS } from '../../types/bill';

interface EditBillScreenProps {}

const EditBillScreen: React.FC<EditBillScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billId } = route.params as { billId: number };
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bill, setBill] = useState<BillDetail | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState<UpdateBillRequest>({
    id: billId,
    title: '',
    description: '',
    amount: 0,
    billPeriod: '',
    dueDate: '',
    status: BillStatus.PENDING,
    notes: '',
  });

  // 详细费用数据
  const [detailedFees, setDetailedFees] = useState({
    rent: '',
    deposit: '',
    electricityUsage: '',
    waterUsage: '',
    hotWaterUsage: '',
    otherFees: '',
    otherFeesDescription: '',
  });

  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 加载账单详情
  const loadBillDetail = async () => {
    try {
      setLoading(true);
      const billDetail = await billService.getBillDetail(billId).toPromise();
      setBill(billDetail);
      
      // 填充表单数据
      setFormData({
        id: billDetail.id,
        title: billDetail.title,
        description: billDetail.description || '',
        amount: billDetail.amount,
        billPeriod: billDetail.billPeriod,
        dueDate: billDetail.dueDate,
        status: billDetail.status,
        notes: billDetail.notes || '',
      });

      // 填充详细费用数据（如果存在）
      setDetailedFees({
        rent: (billDetail as any).rent?.toString() || '',
        deposit: (billDetail as any).deposit?.toString() || '',
        electricityUsage: (billDetail as any).electricityUsage?.toString() || '',
        waterUsage: (billDetail as any).waterUsage?.toString() || '',
        hotWaterUsage: (billDetail as any).hotWaterUsage?.toString() || '',
        otherFees: (billDetail as any).otherFees?.toString() || '',
        otherFeesDescription: (billDetail as any).otherFeesDescription || '',
      });
    } catch (error: any) {
      console.error('加载账单详情失败:', error);
      Alert.alert('错误', error.message || '加载账单详情失败');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillDetail();
  }, [billId]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = '请输入账单标题';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '请输入有效的账单金额';
    }

    if (!formData.billPeriod?.trim()) {
      newErrors.billPeriod = '请输入账单周期';
    } else if (!/^\d{4}-\d{2}$/.test(formData.billPeriod)) {
      newErrors.billPeriod = '账单周期格式应为 YYYY-MM';
    }

    if (!formData.dueDate?.trim()) {
      newErrors.dueDate = '请选择到期日期';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dueDate)) {
      newErrors.dueDate = '到期日期格式应为 YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('验证失败', '请检查表单输入');
      return;
    }

    try {
      setSaving(true);

      // 合并基础表单数据和详细费用数据
      const updateData = {
        ...formData,
        rent: detailedFees.rent ? parseFloat(detailedFees.rent) : undefined,
        deposit: detailedFees.deposit ? parseFloat(detailedFees.deposit) : undefined,
        electricityUsage: detailedFees.electricityUsage ? parseFloat(detailedFees.electricityUsage) : undefined,
        waterUsage: detailedFees.waterUsage ? parseFloat(detailedFees.waterUsage) : undefined,
        hotWaterUsage: detailedFees.hotWaterUsage ? parseFloat(detailedFees.hotWaterUsage) : undefined,
        otherFees: detailedFees.otherFees ? parseFloat(detailedFees.otherFees) : undefined,
        otherFeesDescription: detailedFees.otherFeesDescription || undefined,
        billStatus: formData.status, // 映射 status 到 billStatus
      };

      await billService.updateBill(updateData as any).toPromise();
      Alert.alert('成功', '账单更新成功！', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('更新账单失败:', error);
      Alert.alert('错误', error.message || '更新账单失败');
    } finally {
      setSaving(false);
    }
  };

  // 更新表单数据
  const updateFormData = (field: keyof UpdateBillRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 更新详细费用数据
  const updateDetailedFees = (field: keyof typeof detailedFees, value: string) => {
    setDetailedFees(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: BillStatus) => {
    const option = BILL_STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || status;
  };

  // 渲染状态选择器
  const renderStatusSelector = () => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">账单状态</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {BILL_STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`mr-3 px-4 py-2 rounded-lg ${
              formData.status === option.value
                ? 'bg-blue-500'
                : 'bg-gray-200'
            }`}
            onPress={() => updateFormData('status', option.value)}
          >
            <Text className={`text-sm ${
              formData.status === option.value ? 'text-white' : 'text-gray-700'
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">加载账单信息中...</Text>
      </View>
    );
  }

  if (!bill) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">账单不存在</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-6">编辑账单</Text>

          {/* 账单标题 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">账单标题 *</Text>
            <TextInput
              className={`border rounded-lg px-3 py-2 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入账单标题"
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
            />
            {errors.title && <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>}
          </View>

          {/* 账单金额 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">账单金额 *</Text>
            <TextInput
              className={`border rounded-lg px-3 py-2 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入账单金额"
              value={formData.amount?.toString() || ''}
              onChangeText={(text) => updateFormData('amount', parseFloat(text) || 0)}
              keyboardType="numeric"
            />
            {errors.amount && <Text className="text-red-500 text-sm mt-1">{errors.amount}</Text>}
          </View>

          {/* 账单周期 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">账单周期 *</Text>
            <TextInput
              className={`border rounded-lg px-3 py-2 ${
                errors.billPeriod ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="YYYY-MM (如: 2024-01)"
              value={formData.billPeriod}
              onChangeText={(text) => updateFormData('billPeriod', text)}
            />
            {errors.billPeriod && <Text className="text-red-500 text-sm mt-1">{errors.billPeriod}</Text>}
          </View>

          {/* 到期日期 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">到期日期 *</Text>
            <TextInput
              className={`border rounded-lg px-3 py-2 ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="YYYY-MM-DD (如: 2024-01-05)"
              value={formData.dueDate}
              onChangeText={(text) => updateFormData('dueDate', text)}
            />
            {errors.dueDate && <Text className="text-red-500 text-sm mt-1">{errors.dueDate}</Text>}
          </View>

          {renderStatusSelector()}

          {/* 详细费用信息 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">详细费用信息</Text>

            {/* 房租金额 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">房租金额</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入房租金额"
                value={detailedFees.rent}
                onChangeText={(text) => updateDetailedFees('rent', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 押金金额 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">押金金额</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入押金金额"
                value={detailedFees.deposit}
                onChangeText={(text) => updateDetailedFees('deposit', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 电费用量 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">电费用量</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入电费用量"
                value={detailedFees.electricityUsage}
                onChangeText={(text) => updateDetailedFees('electricityUsage', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 水费用量 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">水费用量</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入水费用量"
                value={detailedFees.waterUsage}
                onChangeText={(text) => updateDetailedFees('waterUsage', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 热水费用量 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">热水费用量</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入热水费用量"
                value={detailedFees.hotWaterUsage}
                onChangeText={(text) => updateDetailedFees('hotWaterUsage', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 其他费用金额 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">其他费用金额</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入其他费用金额"
                value={detailedFees.otherFees}
                onChangeText={(text) => updateDetailedFees('otherFees', text)}
                keyboardType="numeric"
              />
            </View>

            {/* 其他费用说明 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">其他费用说明</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入其他费用说明"
                value={detailedFees.otherFeesDescription}
                onChangeText={(text) => updateDetailedFees('otherFeesDescription', text)}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          {/* 账单描述 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">账单描述</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="请输入账单描述（可选）"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 备注 */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">备注</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="请输入备注信息（可选）"
              value={formData.notes}
              onChangeText={(text) => updateFormData('notes', text)}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            className={`py-3 rounded-lg ${saving ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">保存更改</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditBillScreen;
