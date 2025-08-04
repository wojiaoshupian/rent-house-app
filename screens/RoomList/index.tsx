import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { roomService } from '../../services/roomService';
import { buildingService } from '../../services/buildingService';
import { Room, RoomStatus } from '../../types/room';
import { Building } from '../../types/building';
import { catchError, of } from 'rxjs';

type RoomListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoomList'>;

interface RoomListRouteParams {
  buildingId?: number;
}

export default function RoomListScreen() {
  const navigation = useNavigation<RoomListNavigationProp>();
  const route = useRoute();
  const params = route.params as RoomListRouteParams;

  // 状态管理
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>(params?.buildingId);
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchBuildings();
    fetchRooms();
  }, [selectedBuildingId]);

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

  // 获取房间列表
  const fetchRooms = (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const params = selectedBuildingId ? { buildingId: selectedBuildingId } : undefined;

    roomService.getRoomList(params).pipe(
      catchError((error) => {
        console.error('获取房间列表失败:', error);
        setError(error.message || '获取房间列表失败');
        return of([]);
      })
    ).subscribe({
      next: (roomList) => {
        setRooms(roomList);
        console.log('✅ 获取房间列表成功，数量:', roomList.length);
      },
      complete: () => {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  // 下拉刷新
  const onRefresh = () => {
    fetchRooms(true);
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

  // 获取选中楼宇的名称
  const getSelectedBuildingName = () => {
    if (!selectedBuildingId) return '全部楼宇';
    const building = buildings.find(b => b.id === selectedBuildingId);
    return building ? building.buildingName : '未知楼宇';
  };

  // 渲染房间卡片
  const renderRoomCard = (room: Room) => {
    const statusDisplay = getRoomStatusDisplay(room.status);
    const building = buildings.find(b => b.id === room.buildingId);

    return (
      <View
        key={room.id}
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}
      >
        {/* 房间号和状态 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
            房间 {room.roomNumber}
          </Text>
          <View style={{
            backgroundColor: statusDisplay.color,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
              {statusDisplay.text}
            </Text>
          </View>
        </View>

        {/* 楼宇信息 */}
        {building && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              🏢 {building.buildingName} - {building.landlordName}
            </Text>
          </View>
        )}

        {/* 租金信息 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 16, color: '#374151', fontWeight: '600' }}>
            💰 租金: ¥{room.rent}/月
          </Text>
        </View>

        {/* 押金信息 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            🏦 押金: ¥{room.defaultDeposit}
          </Text>
        </View>

        {/* 水电费信息 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            ⚡ 电费: ¥{room.electricityUnitPrice}/度
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            💧 水费: ¥{room.waterUnitPrice}/吨
          </Text>
          {room.hotWaterUnitPrice && (
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              🔥 热水: ¥{room.hotWaterUnitPrice}/吨
            </Text>
          )}
        </View>

        {/* 操作按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3b82f6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
              marginRight: 8
            }}
            onPress={() => navigation.navigate('RoomDetail', { roomId: room.id })}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              查看详情
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#10b981',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
              marginRight: 8
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              编辑
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#ef4444',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              删除
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
              房间管理
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              {getSelectedBuildingName()} - 共 {rooms.length} 个房间
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#6b7280',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>返回</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fetchRooms(true)}
              disabled={refreshing}
              style={{
                backgroundColor: refreshing ? '#9ca3af' : '#10b981',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                {refreshing ? '刷新中...' : '🔄 刷新'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CreateRoom', { buildingId: selectedBuildingId })}
              style={{
                backgroundColor: '#3b82f6',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>+ 新建</Text>
            </TouchableOpacity>
          </View>
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

      {/* 内容区域 */}
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 加载状态 */}
        {loading && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>加载房间列表中...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <View style={{
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16
          }}>
            <Text style={{ color: '#dc2626', fontSize: 16, fontWeight: '600' }}>
              获取房间列表失败
            </Text>
            <Text style={{ color: '#dc2626', marginTop: 4 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchRooms()}
              style={{
                backgroundColor: '#dc2626',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
                marginTop: 12,
                alignSelf: 'flex-start'
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>重试</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 房间列表 */}
        {!loading && !error && (
          <>
            {rooms.length > 0 ? (
              rooms.map(renderRoomCard)
            ) : (
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 40,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🏠</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  暂无房间
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
                  {selectedBuildingId ? '该楼宇下暂无房间' : '暂无房间数据'}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateRoom', { buildingId: selectedBuildingId })}
                  style={{
                    backgroundColor: '#3b82f6',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>创建第一个房间</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* 底部间距 */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
