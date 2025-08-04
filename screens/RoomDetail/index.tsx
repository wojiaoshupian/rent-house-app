import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { roomService } from '../../services/roomService';
import { RoomDetail, RoomStatus } from '../../types/room';

type RoomDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoomDetail'>;

interface RoomDetailRouteParams {
  roomId: number;
}

export default function RoomDetailScreen() {
  const navigation = useNavigation<RoomDetailNavigationProp>();
  const route = useRoute();
  const params = route.params as RoomDetailRouteParams;

  // 状态管理
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 组件挂载时获取房间详情
  useEffect(() => {
    if (params.roomId) {
      fetchRoomDetail();
    }
  }, [params.roomId]);

  // 获取房间详情
  const fetchRoomDetail = () => {
    setLoading(true);
    setError(null);

    roomService.getRoomDetail(params.roomId).subscribe({
      next: (roomDetail) => {
        setRoom(roomDetail);
        console.log('✅ 获取房间详情成功:', roomDetail);
      },
      error: (error) => {
        console.error('❌ 获取房间详情失败:', error);
        setError(error.message || '获取房间详情失败');
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  // 获取房间状态显示文本和颜色
  const getRoomStatusDisplay = (status?: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return { text: '可租', color: '#10B981' };
      case RoomStatus.OCCUPIED:
        return { text: '已租', color: '#EF4444' };
      case RoomStatus.MAINTENANCE:
        return { text: '维修中', color: '#F59E0B' };
      case RoomStatus.RESERVED:
        return { text: '预定', color: '#8B5CF6' };
      default:
        return { text: '未知', color: '#6B7280' };
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>加载房间详情中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#dc2626', marginBottom: 8, textAlign: 'center' }}>
          获取房间详情失败
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#6b7280',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>返回</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={fetchRoomDetail}
            style={{
              backgroundColor: '#3b82f6',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🏠</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151' }}>
          房间不存在
        </Text>
      </View>
    );
  }

  const statusDisplay = getRoomStatusDisplay(room.status);

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
              房间 {room.roomNumber}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              房间详细信息
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
        {/* 房间基本信息卡片 */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
              基本信息
            </Text>
            <View style={{
              backgroundColor: statusDisplay.color,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16
            }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                {statusDisplay.text}
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>房间号</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{room.roomNumber}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>月租金</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{room.rent}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>押金</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{room.defaultDeposit}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>电费单价</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{room.electricityUnitPrice}/度</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>水费单价</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{room.waterUnitPrice}/吨</Text>
            </View>

            {room.hotWaterUnitPrice && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>热水单价</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{room.hotWaterUnitPrice}/吨</Text>
              </View>
            )}
          </View>
        </View>

        {/* 楼宇信息卡片 */}
        {room.building && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
              楼宇信息
            </Text>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>楼宇名称</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{room.building.buildingName}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>房东</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{room.building.landlordName}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 操作按钮 */}
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
            操作
          </Text>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#10b981',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                编辑房间信息
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#f59e0b',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                更改房间状态
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#ef4444',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={() => {
                Alert.alert(
                  '确认删除',
                  `确定要删除房间"${room.roomNumber}"吗？此操作不可恢复。`,
                  [
                    { text: '取消', style: 'cancel' },
                    {
                      text: '删除',
                      style: 'destructive',
                      onPress: () => {
                        // TODO: 实现删除功能
                        Alert.alert('提示', '删除功能待实现');
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                删除房间
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
