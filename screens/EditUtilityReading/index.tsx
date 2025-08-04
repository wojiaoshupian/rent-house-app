import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { utilityReadingService } from '../../services/utilityReadingService';
import { roomService } from '../../services/roomService';
import { UpdateUtilityReadingRequest, ReadingType, UtilityReading, ReadingStatus } from '../../types/utilityReading';
import { Room } from '../../types/room';

type EditUtilityReadingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditUtilityReading'>;

interface EditUtilityReadingRouteParams {
  readingId: number;
}

export default function EditUtilityReadingScreen() {
  const navigation = useNavigation<EditUtilityReadingNavigationProp>();
  const route = useRoute();
  const params = route.params as EditUtilityReadingRouteParams;

  // 表单状态
  const [formData, setFormData] = useState<UpdateUtilityReadingRequest>({
    id: params.readingId,
    readingDate: '',
    electricityReading: 0,
    waterReading: 0,
    hotWaterReading: 0,
    meterReader: '',
    readingType: ReadingType.MANUAL,
    readingStatus: ReadingStatus.PENDING,
    notes: ''
  });

  // 页面状态
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [originalReading, setOriginalReading] = useState<UtilityReading | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showReadingTypePicker, setShowReadingTypePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  // 组件挂载时获取抄表记录详情
  useEffect(() => {
    if (params.readingId) {
      fetchReadingDetail();
    }
  }, [params.readingId]);

  const fetchReadingDetail = () => {
    setLoadingData(true);
    utilityReadingService.getUtilityReadingDetail(params.readingId).subscribe({
      next: (reading) => {
        setOriginalReading(reading);
        setFormData({
          id: reading.id,
          readingDate: reading.readingDate,
          electricityReading: reading.electricityReading,
          waterReading: reading.waterReading,
          hotWaterReading: reading.hotWaterReading,
          meterReader: reading.meterReader,
          readingType: reading.readingType,
          readingStatus: reading.readingStatus,
          notes: reading.notes || ''
        });
        
        // 获取房间详情
        if (reading.roomId) {
          fetchRoomDetail(reading.roomId);
        }
        
        console.log('✅ 获取抄表记录详情成功:', reading);
      },
      error: (error) => {
        console.error('❌ 获取抄表记录详情失败:', error);
        Alert.alert('获取失败', error.message || '获取抄表记录详情失败');
        navigation.goBack();
      },
      complete: () => {
        setLoadingData(false);
      }
    });
  };

  const fetchRoomDetail = (roomId: number) => {
    roomService.getRoomDetail(roomId).subscribe({
      next: (room) => {
        setSelectedRoom(room);
        console.log('✅ 获取房间详情成功:', room);
      },
      error: (error) => {
        console.error('❌ 获取房间详情失败:', error);
      }
    });
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.readingDate) {
      Alert.alert('验证失败', '请选择抄表日期');
      return false;
    }

    if (formData.electricityReading! < 0) {
      Alert.alert('验证失败', '电表读数不能为负数');
      return false;
    }

    if (formData.waterReading! < 0) {
      Alert.alert('验证失败', '水表读数不能为负数');
      return false;
    }

    if (formData.hotWaterReading && formData.hotWaterReading < 0) {
      Alert.alert('验证失败', '热水表读数不能为负数');
      return false;
    }

    if (!formData.meterReader?.trim()) {
      Alert.alert('验证失败', '请输入抄表人姓名');
      return false;
    }

    return true;
  };

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('🔄 开始更新抄表记录:', formData);

    utilityReadingService.updateUtilityReading(formData).subscribe({
      next: (reading) => {
        console.log('✅ 抄表记录更新成功:', reading);
        Alert.alert(
          '更新成功',
          `房间"${selectedRoom?.roomNumber}"的抄表记录已更新成功`,
          [
            {
              text: '确定',
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      },
      error: (error) => {
        console.error('❌ 更新抄表记录失败:', error);

        // 优先显示接口返回的错误信息
        let errorMessage = '更新抄表记录时发生错误，请重试';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        // 根据错误状态码提供更具体的提示
        if (error.status === 400) {
          console.log('💡 业务逻辑错误:', errorMessage);
        } else if (error.status === 401) {
          errorMessage = '登录已过期，请重新登录后再试';
        } else if (error.status === 403) {
          errorMessage = '权限不足，无法更新抄表记录';
        } else if (error.status === 404) {
          errorMessage = '抄表记录不存在或已被删除';
        } else if (error.status === 409) {
          errorMessage = errorMessage || '该房间在指定日期已有抄表记录';
        }

        Alert.alert('更新失败', errorMessage);
        setLoading(false); // 错误时也要停止loading
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  // 获取抄表类型显示文本
  const getReadingTypeText = (type: ReadingType) => {
    switch (type) {
      case ReadingType.MANUAL:
        return '手动抄表';
      case ReadingType.AUTO:
        return '自动抄表';
      case ReadingType.ESTIMATED:
        return '估算读数';
      default:
        return '未知类型';
    }
  };

  // 获取读数状态显示文本
  const getReadingStatusText = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.PENDING:
        return '待确认';
      case ReadingStatus.CONFIRMED:
        return '已确认';
      case ReadingStatus.DISPUTED:
        return '有争议';
      default:
        return '未知状态';
    }
  };

  if (loadingData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#06B6D4" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>加载抄表记录中...</Text>
      </View>
    );
  }

  if (!originalReading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#dc2626' }}>
          抄表记录不存在
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
              编辑抄表记录
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              房间 {selectedRoom?.roomNumber} - {originalReading.readingDate}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#6b7280',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>返回</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* 表单卡片 */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          {/* 房间信息显示 */}
          <View style={{
            backgroundColor: '#f0f9ff',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#0369a1', marginBottom: 4 }}>
              📍 房间信息
            </Text>
            <Text style={{ fontSize: 16, color: '#0369a1' }}>
              房间 {selectedRoom?.roomNumber}
            </Text>
            {selectedRoom?.buildingName && (
              <Text style={{ fontSize: 12, color: '#0369a1', marginTop: 2 }}>
                楼宇: {selectedRoom.buildingName}
              </Text>
            )}
          </View>

          {/* 抄表日期 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              抄表日期 *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.readingDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, readingDate: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* 电表读数 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              电表读数 (度) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.electricityReading?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, electricityReading: parseFloat(text) || 0 }))}
              placeholder="请输入电表读数"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 水表读数 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              水表读数 (吨) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.waterReading?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, waterReading: parseFloat(text) || 0 }))}
              placeholder="请输入水表读数"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 热水表读数 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              热水表读数 (吨)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.hotWaterReading?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, hotWaterReading: parseFloat(text) || undefined }))}
              placeholder="请输入热水表读数（可选）"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 抄表人 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              抄表人 *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.meterReader || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, meterReader: text }))}
              placeholder="请输入抄表人姓名"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* 抄表类型 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              抄表类型 *
            </Text>
            <TouchableOpacity
              onPress={() => setShowReadingTypePicker(!showReadingTypePicker)}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9fafb'
              }}
            >
              <Text style={{ fontSize: 16, color: '#374151' }}>
                {getReadingTypeText(formData.readingType!)}
              </Text>
            </TouchableOpacity>

            {/* 抄表类型选择器 */}
            {showReadingTypePicker && (
              <View style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: 'white'
              }}>
                {Object.values(ReadingType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, readingType: type }));
                      setShowReadingTypePicker(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f3f4f6'
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#374151' }}>
                      {getReadingTypeText(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 记录状态 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              记录状态 *
            </Text>
            <TouchableOpacity
              onPress={() => setShowStatusPicker(!showStatusPicker)}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9fafb'
              }}
            >
              <Text style={{ fontSize: 16, color: '#374151' }}>
                {getReadingStatusText(formData.readingStatus!)}
              </Text>
            </TouchableOpacity>

            {/* 状态选择器 */}
            {showStatusPicker && (
              <View style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: 'white'
              }}>
                {Object.values(ReadingStatus).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, readingStatus: status }));
                      setShowStatusPicker(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f3f4f6'
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#374151' }}>
                      {getReadingStatusText(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 备注 */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              备注
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                height: 80,
                textAlignVertical: 'top'
              }}
              value={formData.notes || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="请输入备注信息（可选）"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                🔄 更新抄表记录
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
