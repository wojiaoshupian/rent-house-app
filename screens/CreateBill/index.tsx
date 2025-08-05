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
import { useNavigation } from '@react-navigation/native';
import { billService } from '../../services/billService';
import { roomService } from '../../services/roomService';
import { CreateBillRequest, BillType, BILL_TYPE_OPTIONS } from '../../types/bill';
import { Room } from '../../types/room';

interface CreateBillScreenProps {}

const CreateBillScreen: React.FC<CreateBillScreenProps> = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // 表单数据
  const [formData, setFormData] = useState<CreateBillRequest>({
    roomId: 0,
    billType: BillType.RENT,
    title: '',
    description: '',
    amount: 0,
    billPeriod: '',
    dueDate: '',
    notes: '',
    // 详细费用字段
    rent: 0,
    deposit: 0,
    electricityUsage: 0,
    waterUsage: 0,
    hotWaterUsage: 0,
    electricityAmount: 0,
    waterAmount: 0,
    hotWaterAmount: 0,
    otherFees: 0,
    otherFeesDescription: '',
  });

  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 加载房间列表
  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const roomList = await roomService.getRoomList().toPromise();
      setRooms(roomList || []);
    } catch (error: any) {
      console.error('加载房间列表失败:', error);
      Alert.alert('错误', '加载房间列表失败');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    loadRooms();
    
    // 设置默认的账单周期和到期日期
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // yyyy-MM
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5); // 下月5号
    
    setFormData(prev => ({
      ...prev,
      billPeriod: currentMonth,
      dueDate: nextMonth.toISOString().slice(0, 10), // yyyy-MM-dd
    }));
  }, []);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomId || formData.roomId === 0) {
      newErrors.roomId = '请选择房间';
    }

    if (!formData.title.trim()) {
      newErrors.title = '请输入账单标题';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '请输入有效的账单金额';
    }

    if (!formData.billPeriod.trim()) {
      newErrors.billPeriod = '请输入账单周期';
    } else if (!/^\d{4}-\d{2}$/.test(formData.billPeriod)) {
      newErrors.billPeriod = '账单周期格式应为 YYYY-MM';
    }

    if (!formData.dueDate.trim()) {
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
      setLoading(true);
      await billService.createBill(formData).toPromise();
      Alert.alert('成功', '账单创建成功！', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('创建账单失败:', error);
      Alert.alert('错误', error.message || '创建账单失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新表单数据
  const updateFormData = (field: keyof CreateBillRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 获取类型标签
  const getTypeLabel = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return `${option?.icon || '📄'} ${option?.label || type}`;
  };

  // 渲染房间选择器
  const renderRoomSelector = () => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">选择房间 *</Text>
      {loadingRooms ? (
        <View className="bg-gray-100 p-4 rounded-lg">
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              className={`mr-3 p-3 rounded-lg border ${
                formData.roomId === room.id
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => updateFormData('roomId', room.id)}
            >
              <Text className={`font-medium ${
                formData.roomId === room.id ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {room.roomNumber}
              </Text>
              <Text className="text-xs text-gray-500">{room.buildingName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {errors.roomId && <Text className="text-red-500 text-sm mt-1">{errors.roomId}</Text>}
    </View>
  );

  // 渲染账单类型选择器
  const renderBillTypeSelector = () => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">账单类型</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {BILL_TYPE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`mr-3 px-4 py-2 rounded-lg ${
              formData.billType === option.value
                ? 'bg-green-500'
                : 'bg-gray-200'
            }`}
            onPress={() => updateFormData('billType', option.value)}
          >
            <Text className={`text-sm ${
              formData.billType === option.value ? 'text-white' : 'text-gray-700'
            }`}>
              {option.icon} {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-6">创建新账单</Text>

          {renderRoomSelector()}
          {renderBillTypeSelector()}

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

          {/* 费用明细 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">费用明细</Text>

            {/* 房租 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">房租 (元)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入房租金额"
                value={formData.rent?.toString() || ''}
                onChangeText={(text) => updateFormData('rent', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>

            {/* 押金 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">押金 (元)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="请输入押金金额"
                value={formData.deposit?.toString() || ''}
                onChangeText={(text) => updateFormData('deposit', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>

            {/* 电费 */}
            <View className="mb-4">
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">用电量 (度)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="用电量"
                    value={formData.electricityUsage?.toString() || ''}
                    onChangeText={(text) => updateFormData('electricityUsage', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">电费金额 (元)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="电费金额"
                    value={formData.electricityAmount?.toString() || ''}
                    onChangeText={(text) => updateFormData('electricityAmount', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* 水费 */}
            <View className="mb-4">
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">用水量 (吨)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="用水量"
                    value={formData.waterUsage?.toString() || ''}
                    onChangeText={(text) => updateFormData('waterUsage', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">水费金额 (元)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="水费金额"
                    value={formData.waterAmount?.toString() || ''}
                    onChangeText={(text) => updateFormData('waterAmount', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* 热水费 */}
            <View className="mb-4">
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">热水用量 (吨)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="热水用量"
                    value={formData.hotWaterUsage?.toString() || ''}
                    onChangeText={(text) => updateFormData('hotWaterUsage', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">热水费金额 (元)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="热水费金额"
                    value={formData.hotWaterAmount?.toString() || ''}
                    onChangeText={(text) => updateFormData('hotWaterAmount', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* 其他费用 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">其他费用 (元)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                placeholder="其他费用金额"
                value={formData.otherFees?.toString() || ''}
                onChangeText={(text) => updateFormData('otherFees', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="其他费用说明"
                value={formData.otherFeesDescription || ''}
                onChangeText={(text) => updateFormData('otherFeesDescription', text)}
              />
            </View>
          </View>

          {/* 账单总金额 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">账单总金额 *</Text>
            <TextInput
              className={`border rounded-lg px-3 py-2 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入账单总金额"
              value={formData.amount.toString()}
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
            className={`py-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">创建账单</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateBillScreen;
