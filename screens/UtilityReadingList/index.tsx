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
import { utilityReadingService } from '../../services/utilityReadingService';
import { roomService } from '../../services/roomService';
import { buildingService } from '../../services/buildingService';
import { UtilityReading, ReadingStatus, ReadingType } from '../../types/utilityReading';
import { Room } from '../../types/room';
import { Building } from '../../types/building';
import { catchError, of } from 'rxjs';

type UtilityReadingListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UtilityReadingList'>;

interface UtilityReadingListRouteParams {
  roomId?: number;
  buildingId?: number;
}

export default function UtilityReadingListScreen() {
  const navigation = useNavigation<UtilityReadingListNavigationProp>();
  const route = useRoute();
  const params = route.params as UtilityReadingListRouteParams;

  // 状态管理
  const [readings, setReadings] = useState<UtilityReading[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(params?.roomId);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>(params?.buildingId);
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);
  const [showRoomFilter, setShowRoomFilter] = useState(false);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchBuildings();
    fetchRooms();
    fetchReadings();
  }, [selectedRoomId, selectedBuildingId]);

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
  const fetchRooms = () => {
    const params = selectedBuildingId ? { buildingId: selectedBuildingId } : undefined;
    roomService.getRoomList(params).subscribe({
      next: (roomList) => {
        setRooms(roomList);
        console.log('✅ 获取房间列表成功，数量:', roomList.length);
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败:', error);
      }
    });
  };

  // 获取抄表记录列表
  const fetchReadings = (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    // 构建筛选参数
    const params: any = {};
    if (selectedRoomId) {
      params.roomId = selectedRoomId;
    } else if (selectedBuildingId) {
      params.buildingId = selectedBuildingId;
    }

    utilityReadingService.getUtilityReadingList(params).pipe(
      catchError((error) => {
        console.error('获取抄表记录列表失败:', error);
        setError(error.message || '获取抄表记录列表失败');
        return of([]);
      })
    ).subscribe({
      next: (readingList) => {
        setReadings(readingList);
        console.log('✅ 获取抄表记录列表成功，数量:', readingList.length);
      },
      complete: () => {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  // 下拉刷新
  const onRefresh = () => {
    fetchReadings(true);
  };

  // 删除抄表记录
  const handleDeleteReading = (reading: UtilityReading) => {
    // Alert.alert(
    //   '确认删除',
    //   `确定要删除房间"${reading.roomNumber}"在${reading.readingDate}的抄表记录吗？此操作不可恢复。`,
    //   [
    //     { text: '取消', style: 'cancel' },
    //     {
    //       text: '删除',
    //       style: 'destructive',
    //       onPress: () => {
    //         utilityReadingService.deleteUtilityReading(reading.id).subscribe({
    //           next: () => {
    //             console.log('✅ 删除抄表记录成功');
    //             Alert.alert('删除成功', '抄表记录已删除');
    //             fetchReadings(); // 重新获取列表
    //           },
    //           error: (error) => {
    //             console.error('❌ 删除抄表记录失败:', error);

    //             // 优先显示接口返回的错误信息
    //             let errorMessage = '删除抄表记录时发生错误';

    //             if (error.message) {
    //               errorMessage = error.message;
    //             } else if (error.data?.message) {
    //               errorMessage = error.data.message;
    //             } else if (error.response?.data?.message) {
    //               errorMessage = error.response.data.message;
    //             }

    //             Alert.alert('删除失败', errorMessage);
    //           }
    //         });
    //       }
    //     }
    //   ]
    // );
  };

  // 确认抄表记录
  const handleConfirmReading = (reading: UtilityReading) => {
    utilityReadingService.confirmUtilityReading(reading.id).subscribe({
      next: (confirmedReading) => {
        console.log('✅ 确认抄表记录成功');
        // Alert.alert('确认成功', '抄表记录已确认');
        fetchReadings(); // 重新获取列表
      },
      error: (error) => {
        console.error('❌ 确认抄表记录失败:', error);

        // 优先显示接口返回的错误信息
        let errorMessage = '确认抄表记录时发生错误';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        // Alert.alert('确认失败', errorMessage);
      }
    });
  };

  // 争议抄表记录
  const handleDisputeReading = (reading: UtilityReading) => {
    // Alert.alert(
    //   '标记争议',
    //   `确定要将房间"${reading.roomNumber}"在${reading.readingDate}的抄表记录标记为有争议吗？`,
    //   [
    //     { text: '取消', style: 'cancel' },
    //     {
    //       text: '确定',
    //       onPress: () => {
    //         utilityReadingService.disputeUtilityReading(reading.id, '用户标记为争议').subscribe({
    //           next: (disputedReading) => {
    //             console.log('✅ 标记争议成功');
    //             Alert.alert('标记成功', '抄表记录已标记为有争议');
    //             fetchReadings(); // 重新获取列表
    //           },
    //           error: (error) => {
    //             console.error('❌ 标记争议失败:', error);

    //             // 优先显示接口返回的错误信息
    //             let errorMessage = '标记争议时发生错误';

    //             if (error.message) {
    //               errorMessage = error.message;
    //             } else if (error.data?.message) {
    //               errorMessage = error.data.message;
    //             } else if (error.response?.data?.message) {
    //               errorMessage = error.response.data.message;
    //             }

    //             Alert.alert('标记失败', errorMessage);
    //           }
    //         });
    //       }
    //     }
    //   ]
    // );
  };

  // 获取读数状态显示文本和颜色
  const getReadingStatusDisplay = (status?: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.PENDING:
        return { text: '待确认', color: '#F59E0B' };
      case ReadingStatus.CONFIRMED:
        return { text: '已确认', color: '#10B981' };
      case ReadingStatus.DISPUTED:
        return { text: '有争议', color: '#EF4444' };
      default:
        return { text: '未知', color: '#6B7280' };
    }
  };

  // 获取抄表类型显示文本
  const getReadingTypeText = (type?: ReadingType) => {
    switch (type) {
      case ReadingType.MANUAL:
        return '手动';
      case ReadingType.AUTO:
        return '自动';
      case ReadingType.ESTIMATED:
        return '估算';
      default:
        return '未知';
    }
  };

  // 获取选中楼宇的名称
  const getSelectedBuildingName = () => {
    if (!selectedBuildingId) return '全部楼宇';
    const building = buildings.find(b => b.id === selectedBuildingId);
    return building ? building.buildingName : '未知楼宇';
  };

  // 获取选中房间的名称
  const getSelectedRoomName = () => {
    if (!selectedRoomId) return '全部房间';
    const room = rooms.find(r => r.id === selectedRoomId);
    return room ? `房间 ${room.roomNumber}` : '未知房间';
  };

  // 获取筛选条件显示文本
  const getFilterDisplayText = () => {
    if (selectedRoomId) {
      return getSelectedRoomName();
    } else if (selectedBuildingId) {
      return getSelectedBuildingName();
    } else {
      return '全部记录';
    }
  };

  // 渲染抄表记录卡片
  const renderReadingCard = (reading: UtilityReading) => {
    const statusDisplay = getReadingStatusDisplay(reading.readingStatus);
    const room = rooms.find(r => r.id === reading.roomId);

    return (
      <View
        key={reading.id}
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
        {/* 头部信息 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
              房间 {reading.roomNumber || room?.roomNumber}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>
              {reading.readingDate} • {getReadingTypeText(reading.readingType)}抄表
            </Text>
          </View>
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

        {/* 读数信息 */}
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              ⚡ 电表: {reading?.electricityReading} 度
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              💧 水表: {reading?.waterReading} 吨
            </Text>
            <Text>
              {reading?.hotWaterReading && (
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  🔥 热水: {reading?.hotWaterReading} 吨
                </Text>
              )}
            </Text>

          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af' }}>
              抄表人: {reading.meterReader}
            </Text>
            <Text style={{ fontSize: 12, color: '#9ca3af' }}>
              {reading.createdAt ? new Date(reading?.createdAt).toLocaleString() : ''}
            </Text>
          </View>
        </View>

        {/* 备注 */}
        {reading.notes && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
              备注: {reading.notes}
            </Text>
          </View>
        )}

        {/* 操作按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3b82f6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flex: 1,
              marginRight: 6
            }}
            onPress={() => navigation.navigate('UtilityReadingDetail', { readingId: reading.id })}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
              查看详情
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#10b981',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flex: 1,
              marginRight: 6
            }}
            onPress={() => navigation.navigate('EditUtilityReading', { readingId: reading.id })}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
              编辑
            </Text>
          </TouchableOpacity>

          {reading.readingStatus === ReadingStatus.PENDING && (
            <TouchableOpacity
              style={{
                backgroundColor: '#f59e0b',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flex: 1,
                marginRight: 6
              }}
              onPress={() => handleConfirmReading(reading)}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                确认
              </Text>
            </TouchableOpacity>
          )}

          {reading.readingStatus === ReadingStatus.CONFIRMED && (
            <TouchableOpacity
              style={{
                backgroundColor: '#ef4444',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flex: 1,
                marginRight: 6
              }}
              onPress={() => handleDisputeReading(reading)}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                争议
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#ef4444',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flex: 1
            }}
            onPress={() => handleDeleteReading(reading)}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
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
              抄表记录
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              {getFilterDisplayText()} - 共 {readings.length} 条记录
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
              onPress={() => fetchReadings(true)}
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
              onPress={() => navigation.navigate('CreateUtilityReading', { roomId: selectedRoomId })}
              style={{
                backgroundColor: '#06B6D4',
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
        {/* 楼宇筛选 */}
        <TouchableOpacity
          onPress={() => setShowBuildingFilter(!showBuildingFilter)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8,
            marginBottom: 8
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
            marginBottom: 12,
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
                  setSelectedRoomId(undefined); // 清除房间筛选
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
                    setSelectedRoomId(undefined); // 清除房间筛选
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

        {/* 房间筛选 */}
        <TouchableOpacity
          onPress={() => setShowRoomFilter(!showRoomFilter)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginRight: 8 }}>
              🏠 筛选房间
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              {getSelectedRoomName()}
            </Text>
          </View>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            {showRoomFilter ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* 房间筛选器 */}
        {showRoomFilter && (
          <View style={{
            marginTop: 8,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            maxHeight: 200
          }}>
            <ScrollView>
              {/* 全部房间选项 */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedRoomId(undefined);
                  setShowRoomFilter(false);
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb',
                  backgroundColor: !selectedRoomId ? '#e0f2fe' : 'transparent'
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: !selectedRoomId ? '#0369a1' : '#374151',
                  fontWeight: !selectedRoomId ? '600' : 'normal'
                }}>
                  🏘️ 全部房间
                </Text>
              </TouchableOpacity>

              {/* 房间列表 */}
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  onPress={() => {
                    setSelectedRoomId(room.id);
                    setShowRoomFilter(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                    backgroundColor: selectedRoomId === room.id ? '#e0f2fe' : 'transparent'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: selectedRoomId === room.id ? '#0369a1' : '#374151',
                    fontWeight: selectedRoomId === room.id ? '600' : 'normal'
                  }}>
                    🏠 房间 {room.roomNumber}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: selectedRoomId === room.id ? '#0369a1' : '#6b7280',
                    marginTop: 2
                  }}>
                    租金：¥{room.rent}/月
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
            <ActivityIndicator size="large" color="#06B6D4" />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>加载抄表记录中...</Text>
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
              获取抄表记录失败
            </Text>
            <Text style={{ color: '#dc2626', marginTop: 4 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchReadings()}
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

        {/* 抄表记录列表 */}
        {!loading && !error && (
          <>
            {readings.length > 0 ? (
              readings.map(renderReadingCard)
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
                <Text style={{ fontSize: 48, marginBottom: 16 }}>📊</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  暂无抄表记录
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
                  {selectedRoomId ? '该房间暂无抄表记录' : '暂无抄表记录'}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateUtilityReading', { roomId: selectedRoomId })}
                  style={{
                    backgroundColor: '#06B6D4',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>创建第一条抄表记录</Text>
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
