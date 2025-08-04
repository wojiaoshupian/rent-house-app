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
import { buildingService } from '../../services/buildingService';
import { CreateUtilityReadingRequest, ReadingType, UtilityReading } from '../../types/utilityReading';
import { Room } from '../../types/room';
import { Building } from '../../types/building';

type CreateUtilityReadingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateUtilityReading'>;

interface CreateUtilityReadingRouteParams {
  roomId?: number;
}

export default function CreateUtilityReadingScreen() {
  const navigation = useNavigation<CreateUtilityReadingNavigationProp>();
  const route = useRoute();
  const params = route.params as CreateUtilityReadingRouteParams;

  // 表单状态
  const [formData, setFormData] = useState<CreateUtilityReadingRequest>({
    roomId: params?.roomId || 0,
    readingDate: new Date().toISOString().split('T')[0], // 今天的日期
    electricityReading: 0,
    waterReading: 0,
    hotWaterReading: 0,
    meterReader: '',
    readingType: ReadingType.MANUAL,
    notes: ''
  });

  // 页面状态
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [latestReading, setLatestReading] = useState<UtilityReading | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>();
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);

  // 获取楼宇和房间列表
  useEffect(() => {
    fetchBuildings();
    fetchRooms();
  }, []);

  // 当楼宇筛选变化时，重新获取房间列表
  useEffect(() => {
    fetchRooms();
  }, [selectedBuildingId]);

  // 当选择房间时，获取最新抄表记录
  useEffect(() => {
    if (formData.roomId > 0) {
      fetchLatestReading();
      fetchRoomDetail();
    }
  }, [formData.roomId]);

  // 获取楼宇列表
  const fetchBuildings = () => {
    buildingService.getBuildingList().subscribe({
      next: (buildingList) => {
        setBuildings(buildingList);
        console.log('✅ 获取楼宇列表成功，数量:', buildingList.length);
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败:', error);
      }
    });
  };

  const fetchRooms = () => {
    setLoadingRooms(true);
    const params = selectedBuildingId ? { buildingId: selectedBuildingId } : undefined;
    roomService.getRoomList(params).subscribe({
      next: (roomList) => {
        setRooms(roomList);
        console.log('✅ 获取房间列表成功，数量:', roomList.length);

        // 如果当前选中的房间不在新的房间列表中，清除选择
        if (formData.roomId && !roomList.find(r => r.id === formData.roomId)) {
          setFormData(prev => ({ ...prev, roomId: 0 }));
          setSelectedRoom(null);
          setLatestReading(null);
        }
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败:', error);
        Alert.alert('获取房间列表失败', error.message || '请检查网络连接');
      },
      complete: () => {
        setLoadingRooms(false);
      }
    });
  };

  const fetchRoomDetail = () => {
    if (formData.roomId <= 0) return;

    roomService.getRoomDetail(formData.roomId).subscribe({
      next: (room) => {
        setSelectedRoom(room);
        console.log('✅ 获取房间详情成功:', room);
      },
      error: (error) => {
        console.error('❌ 获取房间详情失败:', error);
      }
    });
  };

  const fetchLatestReading = () => {
    if (formData.roomId <= 0) return;

    utilityReadingService.getLatestUtilityReading(formData.roomId).subscribe({
      next: (reading) => {
        setLatestReading(reading);
        console.log('✅ 获取最新抄表记录成功:', reading);
      },
      error: (error) => {
        console.error('❌ 获取最新抄表记录失败:', error);
        setLatestReading(null);
      }
    });
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (formData.roomId <= 0) {
      Alert.alert('验证失败', '请选择房间');
      return false;
    }

    if (!formData.readingDate) {
      Alert.alert('验证失败', '请选择抄表日期');
      return false;
    }

    if (formData.electricityReading < 0) {
      Alert.alert('验证失败', '电表读数不能为负数');
      return false;
    }

    if (formData.waterReading < 0) {
      Alert.alert('验证失败', '水表读数不能为负数');
      return false;
    }

    if (!formData.meterReader.trim()) {
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
    console.log('📊 开始创建抄表记录:', formData);

    utilityReadingService.createUtilityReading(formData).subscribe({
      next: (reading) => {
        console.log('✅ 抄表记录创建成功:', reading);
        Alert.alert(
          '创建成功',
          `房间"${selectedRoom?.roomNumber}"的抄表记录已创建成功`,
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
        console.error('❌ 创建抄表记录失败:', error);
        console.error('❌ 错误详情:', JSON.stringify(error, null, 2));

        // 优先显示接口返回的错误信息
        let errorMessage = '创建抄表记录时发生错误，请重试';

        // 按优先级提取错误信息
        if (error.message && error.message !== 'Network Error') {
          errorMessage = error.message;
          console.log('💡 使用 error.message:', errorMessage);
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
          console.log('💡 使用 error.response.data.message:', errorMessage);
        } else if (error.data?.message) {
          errorMessage = error.data.message;
          console.log('💡 使用 error.data.message:', errorMessage);
        }

        // 根据错误状态码提供更具体的提示
        const status = error.status || error.response?.status;
        if (status === 400) {
          // 400错误通常是业务逻辑错误，直接显示接口返回的消息
          console.log('💡 业务逻辑错误 (400):', errorMessage);
        } else if (status === 401) {
          errorMessage = '登录已过期，请重新登录后再试';
        } else if (status === 403) {
          errorMessage = '权限不足，无法创建抄表记录';
        } else if (status === 409) {
          errorMessage = errorMessage || '该房间在指定日期已有抄表记录';
        }

        Alert.alert('创建失败', errorMessage);
        setLoading(false); // 错误时也要停止loading
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  // 获取选中楼宇的名称
  const getSelectedBuildingName = () => {
    if (!selectedBuildingId) return '全部楼宇';
    const building = buildings.find(b => b.id === selectedBuildingId);
    return building ? building.buildingName : '未知楼宇';
  };

  // 获取选中房间的名称
  const getSelectedRoomName = () => {
    const room = rooms.find(r => r.id === formData.roomId);
    return room ? `房间 ${room.roomNumber}` : '请选择房间';
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
              抄水电表
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              {getSelectedBuildingName()} - 共 {rooms.length} 个房间可选
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

      {/* 筛选器 */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6'
      }}>
        <TouchableOpacity
          onPress={() => setShowBuildingFilter(!showBuildingFilter)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginRight: 8 }}>
              🏢 筛选楼宇
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              {getSelectedBuildingName()}
            </Text>
          </View>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            {showBuildingFilter ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* 楼宇筛选器 */}
        {showBuildingFilter && (
          <View style={{
            marginTop: 8,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            maxHeight: 200
          }}>
            <ScrollView>
              {/* 全部楼宇选项 */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedBuildingId(undefined);
                  setShowBuildingFilter(false);
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb',
                  backgroundColor: !selectedBuildingId ? '#e0f2fe' : 'transparent'
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: !selectedBuildingId ? '#0369a1' : '#374151',
                  fontWeight: !selectedBuildingId ? '600' : 'normal'
                }}>
                  🏘️ 全部楼宇
                </Text>
              </TouchableOpacity>

              {/* 楼宇列表 */}
              {buildings.map((building) => (
                <TouchableOpacity
                  key={building.id}
                  onPress={() => {
                    setSelectedBuildingId(building.id);
                    setShowBuildingFilter(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                    backgroundColor: selectedBuildingId === building.id ? '#e0f2fe' : 'transparent'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: selectedBuildingId === building.id ? '#0369a1' : '#374151',
                    fontWeight: selectedBuildingId === building.id ? '600' : 'normal'
                  }}>
                    🏢 {building.buildingName}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: selectedBuildingId === building.id ? '#0369a1' : '#6b7280',
                    marginTop: 2
                  }}>
                    房东：{building.landlordName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
          {/* 房间选择 */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
              选择房间 *
            </Text>
            <TouchableOpacity
              onPress={() => setShowRoomPicker(!showRoomPicker)}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9fafb'
              }}
            >
              <Text style={{ fontSize: 16, color: formData.roomId ? '#374151' : '#9ca3af' }}>
                {loadingRooms ? '加载中...' : getSelectedRoomName()}
              </Text>
            </TouchableOpacity>

            {/* 房间选择器 */}
            {showRoomPicker && (
              <View style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: 'white',
                maxHeight: 200
              }}>
                <ScrollView>
                  {rooms.map((room) => (
                    <TouchableOpacity
                      key={room.id}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, roomId: room.id }));
                        setShowRoomPicker(false);
                      }}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f3f4f6'
                      }}
                    >
                      <Text style={{ fontSize: 16, color: '#374151' }}>
                        房间 {room.roomNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* 上次抄表记录显示 */}
          {latestReading && (
            <View style={{
              backgroundColor: '#f0f9ff',
              borderColor: '#0ea5e9',
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#0369a1', marginBottom: 8 }}>
                📊 上次抄表记录 ({latestReading.readingDate})
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: '#0369a1' }}>
                  电表: {latestReading.electricityReading} 度
                </Text>
                <Text style={{ fontSize: 12, color: '#0369a1' }}>
                  水表: {latestReading.waterReading} 吨
                </Text>
                {latestReading.hotWaterReading && (
                  <Text style={{ fontSize: 12, color: '#0369a1' }}>
                    热水: {latestReading.hotWaterReading} 吨
                  </Text>
                )}
              </View>
            </View>
          )}

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
              value={formData.electricityReading.toString()}
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
              value={formData.waterReading.toString()}
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
              value={formData.meterReader}
              onChangeText={(text) => setFormData(prev => ({ ...prev, meterReader: text }))}
              placeholder="请输入抄表人姓名"
              placeholderTextColor="#9ca3af"
            />
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
              value={formData.notes}
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
              backgroundColor: loading ? '#9ca3af' : '#06B6D4',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                📊 提交抄表记录
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