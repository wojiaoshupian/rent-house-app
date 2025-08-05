import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { billService } from '../../services/billService';
import { EstimatedBill } from '../../types/bill';
import { catchError, of } from 'rxjs';

interface EstimatedBillEditScreenProps {
  route: {
    params: {
      billId: number;
    };
  };
}

const EstimatedBillEditScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billId } = route.params as { billId: number };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bill, setBill] = useState<EstimatedBill | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    rent: '',
    deposit: '',
    electricityUsage: '',
    waterUsage: '',
    hotWaterUsage: '',
    otherFees: '',
    otherFeesDescription: '',
    billStatus: '',
    notes: ''
  });

  // 状态选项
  const statusOptions = [
    { label: '已生成', value: 'GENERATED' },
    { label: '已确认', value: 'CONFIRMED' },
    { label: '已发送', value: 'SENT' },
    { label: '已支付', value: 'PAID' },
    { label: '已逾期', value: 'OVERDUE' },
    { label: '已取消', value: 'CANCELLED' }
  ];

  // 加载账单数据
  useEffect(() => {
    loadBillData();
  }, [billId]);

  const loadBillData = async () => {
    try {
      setLoading(true);
      // 这里需要实现获取单个账单的方法，暂时使用列表方法
      const response = await billService.getEstimatedBills({ page: 0, size: 100 }).toPromise();
      const foundBill = response?.data.find(b => b.id === billId);
      
      if (foundBill) {
        setBill(foundBill);
        setFormData({
          rent: foundBill.rent.toString(),
          deposit: (foundBill.deposit || 0).toString(),
          electricityUsage: foundBill.electricityUsage.toString(),
          waterUsage: foundBill.waterUsage.toString(),
          hotWaterUsage: foundBill.hotWaterUsage.toString(),
          otherFees: (foundBill.otherFees || 0).toString(),
          otherFeesDescription: foundBill.otherFeesDescription || '',
          billStatus: foundBill.billStatus,
          notes: foundBill.notes || ''
        });
      } else {
        Alert.alert('错误', '未找到指定的预估账单');
        navigation.goBack();
      }
    } catch (error) {
      console.error('加载账单数据失败:', error);
      Alert.alert('加载失败', '无法加载账单数据，请重试');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // 更新表单数据
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 验证表单
  const validateForm = () => {
    const errors: string[] = [];

    // 验证必填字段
    if (!formData.rent.trim()) {
      errors.push('房租金额不能为空');
    }

    // 验证数字字段
    const numberFields = ['rent', 'deposit', 'electricityUsage', 'waterUsage', 'hotWaterUsage', 'otherFees'];
    numberFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value.trim() && isNaN(parseFloat(value))) {
        errors.push(`${getFieldLabel(field)}必须是有效数字`);
      } else if (value.trim() && parseFloat(value) < 0) {
        errors.push(`${getFieldLabel(field)}不能为负数`);
      }
    });

    return errors;
  };

  // 获取字段标签
  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      rent: '房租金额',
      deposit: '押金金额',
      electricityUsage: '电费用量',
      waterUsage: '水费用量',
      hotWaterUsage: '热水用量',
      otherFees: '杂项费用'
    };
    return labels[field] || field;
  };

  // 保存账单
  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      Alert.alert('输入错误', errors.join('\n'));
      return;
    }

    try {
      setSaving(true);

      // 构造更新数据
      const updateData: any = {};
      
      // 处理数字字段
      const numberFields = ['rent', 'deposit', 'electricityUsage', 'waterUsage', 'hotWaterUsage', 'otherFees'];
      numberFields.forEach(field => {
        const value = formData[field as keyof typeof formData];
        if (value.trim()) {
          updateData[field] = parseFloat(value);
        }
      });

      // 处理字符串字段
      if (formData.otherFeesDescription.trim()) {
        updateData.otherFeesDescription = formData.otherFeesDescription.trim();
      }
      if (formData.notes.trim()) {
        updateData.notes = formData.notes.trim();
      }
      if (formData.billStatus !== bill?.billStatus) {
        updateData.billStatus = formData.billStatus;
      }

      await billService.updateEstimatedBill(billId, updateData).toPromise();
      
      Alert.alert('保存成功', '预估账单已更新', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('保存失败:', error);
      Alert.alert('保存失败', error.message || '保存预估账单失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>加载中...</Text>
      </View>
    );
  }

  if (!bill) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>账单数据加载失败</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* 标题栏 */}
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'ios' ? 44 : 20,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e5e5',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>← 返回</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
            编辑预估账单
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={{ 
              color: saving ? '#ccc' : '#007AFF', 
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              {saving ? '保存中...' : '保存'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* 账单标题 */}
          <View style={{ margin: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              编辑预估账单
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>
              房间 {bill.roomNumber} - {bill.billMonth}
            </Text>
          </View>

          {/* 房间信息卡片 */}
          <View style={{
            backgroundColor: '#e3f2fd',
            marginHorizontal: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#2196f3'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, marginRight: 8 }}>🏠</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1976d2' }}>房间信息</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
              房间 {bill.roomNumber}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              楼宇：{bill.buildingName}
            </Text>
          </View>

          {/* 表单字段 */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            {/* 基础费用 */}
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                💰 基础费用
              </Text>

              {/* 房租 */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  房租金额 <Text style={{ color: '#ff4444' }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.rent}
                  onChangeText={(value) => updateFormData('rent', value)}
                  placeholder="请输入房租金额"
                  keyboardType="numeric"
                />
              </View>

              {/* 押金 */}
              <View>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  押金金额
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.deposit}
                  onChangeText={(value) => updateFormData('deposit', value)}
                  placeholder="请输入押金金额"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* 用量费用 */}
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                ⚡ 用量费用
              </Text>

              {/* 电费用量 */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  电费用量 (度) <Text style={{ color: '#ff4444' }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.electricityUsage}
                  onChangeText={(value) => updateFormData('electricityUsage', value)}
                  placeholder="请输入电费用量"
                  keyboardType="numeric"
                />
              </View>

              {/* 水费用量 */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  水费用量 (吨) <Text style={{ color: '#ff4444' }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.waterUsage}
                  onChangeText={(value) => updateFormData('waterUsage', value)}
                  placeholder="请输入水费用量"
                  keyboardType="numeric"
                />
              </View>

              {/* 热水用量 */}
              <View>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  热水用量 (吨)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.hotWaterUsage}
                  onChangeText={(value) => updateFormData('hotWaterUsage', value)}
                  placeholder="请输入热水用量"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* 杂项费用 */}
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                🏷️ 杂项费用
              </Text>

              {/* 杂项费用金额 */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  杂项费用金额
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.otherFees}
                  onChangeText={(value) => updateFormData('otherFees', value)}
                  placeholder="请输入杂项费用金额"
                  keyboardType="numeric"
                />
              </View>

              {/* 杂项费用说明 */}
              <View>
                <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  杂项费用说明
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#fafafa',
                    minHeight: 80,
                    textAlignVertical: 'top'
                  }}
                  value={formData.otherFeesDescription}
                  onChangeText={(value) => updateFormData('otherFeesDescription', value)}
                  placeholder="请输入杂项费用说明（如：网络费100元 + 清洁费50元）"
                  multiline
                />
              </View>
            </View>

            {/* 账单状态 */}
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                📋 账单状态
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: formData.billStatus === option.value ? '#007AFF' : '#ddd',
                      backgroundColor: formData.billStatus === option.value ? '#007AFF' : 'white'
                    }}
                    onPress={() => updateFormData('billStatus', option.value)}
                  >
                    <Text style={{
                      color: formData.billStatus === option.value ? 'white' : '#666',
                      fontSize: 14,
                      fontWeight: formData.billStatus === option.value ? '600' : 'normal'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 备注信息 */}
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                📝 备注信息
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#fafafa',
                  minHeight: 100,
                  textAlignVertical: 'top'
                }}
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                placeholder="请输入备注信息..."
                multiline
              />
            </View>

            {/* 重置按钮 */}
            <TouchableOpacity
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#dee2e6'
              }}
              onPress={loadBillData}
            >
              <Text style={{ color: '#6c757d', fontSize: 16, fontWeight: '600' }}>
                🔄 重置为原始值
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EstimatedBillEditScreen;
