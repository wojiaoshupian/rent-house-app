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
import { roomService } from '../../services/roomService';
import { buildingService } from '../../services/buildingService';
import { CreateRoomRequest } from '../../types/room';
import { Building } from '../../types/building';

type CreateRoomNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateRoom'>;

interface CreateRoomRouteParams {
  buildingId?: number;
}

export default function CreateRoomScreen() {
  const navigation = useNavigation<CreateRoomNavigationProp>();
  const route = useRoute();
  const params = route.params as CreateRoomRouteParams;

  // 表单状态
  const [formData, setFormData] = useState<CreateRoomRequest>({
    roomNumber: '',
    rent: 0,
    defaultDeposit: 0,
    electricityUnitPrice: 1.2,
    waterUnitPrice: 3.5,
    hotWaterUnitPrice: 6.0,
    buildingId: params?.buildingId || 0
  });

  // 页面状态
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);

  // 获取楼宇列表
  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = () => {
    setLoadingBuildings(true);
    buildingService.getBuildingList().subscribe({
      next: (buildingList) => {
        setBuildings(buildingList);
        console.log('✅ 获取楼宇列表成功，数量:', buildingList.length);
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败:', error);
        Alert.alert('获取楼宇列表失败', error.message || '请检查网络连接');
      },
      complete: () => {
        setLoadingBuildings(false);
      }
    });
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.roomNumber.trim()) {
      Alert.alert('验证失败', '请输入房间号');
      return false;
    }

    if (formData.rent <= 0) {
      Alert.alert('验证失败', '请输入有效的租金金额');
      return false;
    }

    if (formData.defaultDeposit < 0) {
      Alert.alert('验证失败', '押金不能为负数');
      return false;
    }

    if (formData.electricityUnitPrice <= 0) {
      Alert.alert('验证失败', '请输入有效的电费单价');
      return false;
    }

    if (formData.waterUnitPrice <= 0) {
      Alert.alert('验证失败', '请输入有效的水费单价');
      return false;
    }

    if (formData.buildingId <= 0) {
      Alert.alert('验证失败', '请选择楼宇');
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
    console.log('🏠 开始创建房间:', formData);

    roomService.createRoom(formData).subscribe({
      next: (room) => {
        console.log('✅ 房间创建成功:', room);
        Alert.alert(
          '创建成功',
          `房间"${room.roomNumber}"已创建成功`,
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
        console.error('❌ 创建房间失败:', error);
        Alert.alert('创建失败', error.message || '创建房间时发生错误，请重试');
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  // 获取选中楼宇的名称
  const getSelectedBuildingName = () => {
    const building = buildings.find(b => b.id === formData.buildingId);
    return building ? building.buildingName : '请选择楼宇';
  };

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
              创建房间
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              添加新的房间信息
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
          {/* 楼宇选择 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              所属楼宇 *
            </Text>
            <TouchableOpacity
              onPress={() => setShowBuildingPicker(!showBuildingPicker)}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9fafb'
              }}
            >
              <Text style={{ fontSize: 16, color: formData.buildingId ? '#374151' : '#9ca3af' }}>
                {loadingBuildings ? '加载中...' : getSelectedBuildingName()}
              </Text>
            </TouchableOpacity>

            {/* 楼宇选择器 */}
            {showBuildingPicker && (
              <View style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: 'white',
                maxHeight: 200
              }}>
                <ScrollView>
                  {buildings.map((building) => (
                    <TouchableOpacity
                      key={building.id}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, buildingId: building.id }));
                        setShowBuildingPicker(false);
                      }}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f3f4f6'
                      }}
                    >
                      <Text style={{ fontSize: 16, color: '#374151' }}>
                        {building.buildingName}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                        房东：{building.landlordName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* 房间号 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              房间号 *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.roomNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, roomNumber: text }))}
              placeholder="请输入房间号，如：101"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* 租金 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              月租金 (元) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.rent.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, rent: parseFloat(text) || 0 }))}
              placeholder="请输入月租金"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 押金 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              默认押金 (元) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.defaultDeposit.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, defaultDeposit: parseFloat(text) || 0 }))}
              placeholder="请输入默认押金"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 电费单价 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              电费单价 (元/度) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.electricityUnitPrice.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, electricityUnitPrice: parseFloat(text) || 0 }))}
              placeholder="请输入电费单价"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 水费单价 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              水费单价 (元/吨) *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.waterUnitPrice.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, waterUnitPrice: parseFloat(text) || 0 }))}
              placeholder="请输入水费单价"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 热水单价 */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              热水单价 (元/吨)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.hotWaterUnitPrice?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, hotWaterUnitPrice: parseFloat(text) || undefined }))}
              placeholder="请输入热水单价（可选）"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                创建房间
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
