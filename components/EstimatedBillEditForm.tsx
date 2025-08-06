import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { EstimatedBill } from '../types/bill';

interface EstimatedBillEditFormProps {
  bill: EstimatedBill;
  visible: boolean;
  onClose: () => void;
  onSave: (updateData: any) => void;
}

export const EstimatedBillEditForm: React.FC<EstimatedBillEditFormProps> = ({
  bill,
  visible,
  onClose,
  onSave
}) => {
  // 表单状态
  const [formData, setFormData] = useState({
    rent: bill.rent.toString(),
    deposit: (bill.deposit || 0).toString(),
    electricityUsage: bill.electricityUsage.toString(),
    waterUsage: bill.waterUsage.toString(),
    hotWaterUsage: bill.hotWaterUsage.toString(),
    otherFees: (bill.otherFees || 0).toString(),
    otherFeesDescription: bill.otherFeesDescription || '',
    billStatus: bill.billStatus,
    notes: bill.notes || ''
  });

  // 状态选项 - 只保留已生成和已确认
  const statusOptions = [
    { label: '已生成', value: 'GENERATED' },
    { label: '已确认', value: 'CONFIRMED' }
  ];

  // 更新表单数据
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 验证表单数据
  const validateForm = () => {
    const errors: string[] = [];

    // 验证数字字段
    const numberFields = ['rent', 'deposit', 'electricityUsage', 'waterUsage', 'hotWaterUsage', 'otherFees'];
    numberFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value && isNaN(parseFloat(value))) {
        errors.push(`${getFieldLabel(field)}必须是有效数字`);
      } else if (value && parseFloat(value) < 0) {
        errors.push(`${getFieldLabel(field)}不能为负数`);
      }
    });

    return errors;
  };

  // 获取字段标签
  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      rent: '房租',
      deposit: '押金',
      electricityUsage: '电费用量',
      waterUsage: '水费用量',
      hotWaterUsage: '热水用量',
      otherFees: '杂项费用',
      otherFeesDescription: '杂项说明',
      billStatus: '账单状态',
      notes: '备注'
    };
    return labels[field] || field;
  };

  // 保存表单
  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      Alert.alert('输入错误', errors.join('\n'));
      return;
    }

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
    if (formData.billStatus !== bill.billStatus) {
      updateData.billStatus = formData.billStatus;
    }

    onSave(updateData);
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      rent: bill.rent.toString(),
      deposit: (bill.deposit || 0).toString(),
      electricityUsage: bill.electricityUsage.toString(),
      waterUsage: bill.waterUsage.toString(),
      hotWaterUsage: bill.hotWaterUsage.toString(),
      otherFees: (bill.otherFees || 0).toString(),
      otherFeesDescription: bill.otherFeesDescription || '',
      billStatus: bill.billStatus,
      notes: bill.notes || ''
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          {/* 标题栏 */}
          <View style={{
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>取消</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
              编辑预估账单
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: '600' }}>保存</Text>
            </TouchableOpacity>
          </View>

          {/* 账单信息 */}
          <View style={{
            backgroundColor: 'white',
            marginTop: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5'
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
              房间"{bill.roomNumber}" - {bill.billMonth}
            </Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
              {bill.buildingName} | 当前总金额：¥{bill.totalAmount.toFixed(2)}
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* 基础费用 */}
            <View style={{ backgroundColor: 'white', marginTop: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}>
                💰 基础费用
              </Text>
              
              {/* 房租 */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>房租金额</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
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
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>押金金额</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
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
            <View style={{ backgroundColor: 'white', marginTop: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}>
                ⚡ 用量费用
              </Text>
              
              {/* 电费用量 */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
                  电费用量 (¥{bill.electricityUnitPrice.toFixed(2)}/度)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.electricityUsage}
                  onChangeText={(value) => updateFormData('electricityUsage', value)}
                  placeholder="请输入用电量(度)"
                  keyboardType="numeric"
                />
              </View>

              {/* 水费用量 */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
                  水费用量 (¥{bill.waterUnitPrice.toFixed(2)}/吨)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.waterUsage}
                  onChangeText={(value) => updateFormData('waterUsage', value)}
                  placeholder="请输入用水量(吨)"
                  keyboardType="numeric"
                />
              </View>

              {/* 热水用量 */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
                  热水用量 (¥{bill.hotWaterUnitPrice.toFixed(2)}/吨)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    backgroundColor: '#fafafa'
                  }}
                  value={formData.hotWaterUsage}
                  onChangeText={(value) => updateFormData('hotWaterUsage', value)}
                  placeholder="请输入热水用量(吨)"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* 杂项费用 */}
            <View style={{ backgroundColor: 'white', marginTop: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}>
                🏷️ 杂项费用
              </Text>

              {/* 杂项费用金额 */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>杂项费用金额</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
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
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>杂项费用说明</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    backgroundColor: '#fafafa',
                    minHeight: 80
                  }}
                  value={formData.otherFeesDescription}
                  onChangeText={(value) => updateFormData('otherFeesDescription', value)}
                  placeholder="例如：网络费100元 + 清洁费50元"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* 账单状态 */}
            <View style={{ backgroundColor: 'white', marginTop: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}>
                📋 账单状态
              </Text>

              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
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
                        color: formData.billStatus === option.value ? 'white' : '#333',
                        fontSize: 14,
                        fontWeight: formData.billStatus === option.value ? '600' : 'normal'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* 备注信息 */}
            <View style={{ backgroundColor: 'white', marginTop: 8, marginBottom: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}>
                📝 备注信息
              </Text>

              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    backgroundColor: '#fafafa',
                    minHeight: 100
                  }}
                  value={formData.notes}
                  onChangeText={(value) => updateFormData('notes', value)}
                  placeholder="请输入备注信息..."
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* 操作按钮 */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f0f0f0',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginBottom: 12
                }}
                onPress={handleReset}
              >
                <Text style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#666',
                  fontWeight: '600'
                }}>
                  🔄 重置为原始值
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
