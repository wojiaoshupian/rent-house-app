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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
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

  // 监听页面焦点变化，当从编辑页面返回时刷新数据
  useFocusEffect(
    React.useCallback(() => {
      // 当页面获得焦点时刷新数据
      fetchReadings();
    }, [selectedRoomId, selectedBuildingId])
  );

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
    Alert.alert(
      '确认删除',
      `确定要删除房间"${reading.roomNumber}"在${reading.readingDate}的抄表记录吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            utilityReadingService.deleteUtilityReading(reading.id).subscribe({
              next: () => {
                console.log('✅ 删除抄表记录成功');
                Alert.alert('删除成功', '抄表记录已删除');
                fetchReadings(); // 重新获取列表
              },
              error: (error) => {
                console.error('❌ 删除抄表记录失败:', error);

                // 优先显示接口返回的错误信息
                let errorMessage = '删除抄表记录时发生错误';

                if (error.message) {
                  errorMessage = error.message;
                } else if (error.data?.message) {
                  errorMessage = error.data.message;
                } else if (error.response?.data?.message) {
                  errorMessage = error.response.data.message;
                }

                Alert.alert('删除失败', errorMessage);
              }
            });
          }
        }
      ]
    );
  };

  // 确认抄表记录
  const handleConfirmReading = (reading: UtilityReading) => {
    utilityReadingService.confirmUtilityReading(reading.id).subscribe({
      next: (confirmedReading) => {
        console.log('✅ 确认抄表记录成功');
        Alert.alert('确认成功', '抄表记录已确认');
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

        Alert.alert('确认失败', errorMessage);
      }
    });
  };

  // 争议标记功能已移除

  // 获取读数状态显示文本和颜色
  const getReadingStatusDisplay = (status?: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.PENDING:
        return { text: '待确认', color: '#F59E0B' };
      case ReadingStatus.CONFIRMED:
        return { text: '已确认', color: '#10B981' };
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
        className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      >
        {/* 头部信息 */}
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-lg font-bold text-gray-800">
              房间 {reading.roomNumber || room?.roomNumber}
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              {reading.readingDate} • {getReadingTypeText(reading.readingType)}抄表
            </Text>
          </View>
          <View style={{
            backgroundColor: statusDisplay.color,
          }} className="px-2 py-1 rounded-xl">
            <Text className="text-white text-xs font-semibold">
              {statusDisplay.text}
            </Text>
          </View>
        </View>

        {/* 读数信息 */}
        <View className="mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">
              ⚡ 电表: {reading?.electricityReading} 度
            </Text>
            <Text className="text-sm text-gray-500">
              💧 水表: {reading?.waterReading} 吨
            </Text>
            <Text>
              {reading?.hotWaterReading && (
                <Text className="text-sm text-gray-500">
                  🔥 热水: {reading?.hotWaterReading} 吨
                </Text>
              )}
            </Text>

          </View>

          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-400">
              抄表人: {reading.meterReader}
            </Text>
            <Text className="text-xs text-gray-400">
              {reading.createdAt ? new Date(reading?.createdAt).toLocaleString() : ''}
            </Text>
          </View>
        </View>

        {/* 备注 */}
        {reading.notes && (
          <View className="mb-3">
            <Text className="text-xs text-gray-500 italic">
              备注: {reading.notes}
            </Text>
          </View>
        )}

        {/* 操作按钮 */}
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-blue-500 px-3 py-1.5 rounded flex-1 mr-1.5"
            onPress={() => navigation.navigate('UtilityReadingDetail', { readingId: reading.id })}
          >
            <Text className="text-white text-xs font-semibold text-center">
              查看详情
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 px-3 py-1.5 rounded flex-1 mr-1.5"
            onPress={() => navigation.navigate('EditUtilityReading', { readingId: reading.id })}
          >
            <Text className="text-white text-xs font-semibold text-center">
              编辑
            </Text>
          </TouchableOpacity>

          {reading.readingStatus === ReadingStatus.PENDING && (
            <TouchableOpacity
              className="bg-amber-500 px-3 py-1.5 rounded flex-1 mr-1.5"
              onPress={() => handleConfirmReading(reading)}
            >
              <Text className="text-white text-xs font-semibold text-center">
                确认
              </Text>
            </TouchableOpacity>
          )}

          {/* 争议按钮已移除 */}

          <TouchableOpacity
            className="bg-red-500 px-3 py-1.5 rounded flex-1"
            onPress={() => handleDeleteReading(reading)}
          >
            <Text className="text-white text-xs font-semibold text-center">
              删除
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-5 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              抄表记录
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {getFilterDisplayText()} - 共 {readings.length} 条记录
            </Text>
          </View>
          <View className="flex-row space-x-2 gap-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-sm">返回</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => fetchReadings(true)}
              disabled={refreshing}
              className={`px-3 py-2 rounded-lg ${refreshing ? 'bg-gray-400' : 'bg-green-500'}`}
            >
              <Text className="text-white font-semibold text-sm">
                {refreshing ? '刷新中...' : '🔄 刷新'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CreateUtilityReading', { roomId: selectedRoomId })}
              className="bg-cyan-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-sm">+ 新建</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>





      {/* 筛选器 */}
      <View className="bg-white px-5 py-3 border-b border-gray-100">
        {/* 楼宇筛选 */}
        <TouchableOpacity
          onPress={() => setShowBuildingFilter(!showBuildingFilter)}
          className="flex-row items-center justify-between py-2 mb-2"
        >
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-700 mr-2">
              🏢 筛选楼宇
            </Text>
            <Text className="text-sm text-gray-500">
              {getSelectedBuildingName()}
            </Text>
          </View>
          <Text className="text-base text-gray-500">
            {showBuildingFilter ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* 楼宇筛选器 */}
        {showBuildingFilter && (
          <View className="mb-3 border border-gray-300 rounded-lg bg-gray-50 max-h-48">
            <ScrollView>
              {/* 全部楼宇选项 */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedBuildingId(undefined);
                  setSelectedRoomId(undefined); // 清除房间筛选
                  setShowBuildingFilter(false);
                }}
                className={`p-3 border-b border-gray-200 ${!selectedBuildingId ? 'bg-sky-100' : 'bg-transparent'}`}
              >
                <Text className={`text-base ${!selectedBuildingId ? 'text-sky-700 font-semibold' : 'text-gray-700'}`}>
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
                  className={`p-3 border-b border-gray-200 ${selectedBuildingId === building.id ? 'bg-sky-100' : 'bg-transparent'}`}
                >
                  <Text className={`text-base ${selectedBuildingId === building.id ? 'text-sky-700 font-semibold' : 'text-gray-700'}`}>
                    🏢 {building.buildingName}
                  </Text>
                  <Text className={`text-xs mt-0.5 ${selectedBuildingId === building.id ? 'text-sky-700' : 'text-gray-500'}`}>
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
          className="flex-row items-center justify-between py-2"
        >
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-700 mr-2">
              🏠 筛选房间
            </Text>
            <Text className="text-sm text-gray-500">
              {getSelectedRoomName()}
            </Text>
          </View>
          <Text className="text-base text-gray-500">
            {showRoomFilter ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* 房间筛选器 */}
        {showRoomFilter && (
          <View className="mt-2 border border-gray-300 rounded-lg bg-gray-50 max-h-48">
            <ScrollView>
              {/* 全部房间选项 */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedRoomId(undefined);
                  setShowRoomFilter(false);
                }}
                className={`p-3 border-b border-gray-200 ${!selectedRoomId ? 'bg-sky-100' : 'bg-transparent'}`}
              >
                <Text className={`text-base ${!selectedRoomId ? 'text-sky-700 font-semibold' : 'text-gray-700'}`}>
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
                  className={`p-3 border-b border-gray-200 ${selectedRoomId === room.id ? 'bg-sky-100' : 'bg-transparent'}`}
                >
                  <Text className={`text-base ${selectedRoomId === room.id ? 'text-sky-700 font-semibold' : 'text-gray-700'}`}>
                    🏠 房间 {room.roomNumber}
                  </Text>
                  <Text className={`text-xs mt-0.5 ${selectedRoomId === room.id ? 'text-sky-700' : 'text-gray-500'}`}>
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
        className="flex-1 p-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 加载状态 */}
        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#06B6D4" />
            <Text className="mt-3 text-gray-500">加载抄表记录中...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <Text className="text-red-600 text-base font-semibold">
              获取抄表记录失败
            </Text>
            <Text className="text-red-600 mt-1">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchReadings()}
              className="bg-red-600 px-4 py-2 rounded self-start mt-3"
            >
              <Text className="text-white font-semibold">重试</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 抄表记录列表 */}
        {!loading && !error && (
          <>
            {readings.length > 0 ? (
              readings.map(renderReadingCard)
            ) : (
              <View className="bg-white rounded-xl p-10 items-center shadow-sm">
                <Text className="text-5xl mb-4">📊</Text>
                <Text className="text-lg font-semibold text-gray-700 mb-2">
                  暂无抄表记录
                </Text>
                <Text className="text-sm text-gray-500 text-center mb-5">
                  {selectedRoomId ? '该房间暂无抄表记录' : '暂无抄表记录'}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateUtilityReading', { roomId: selectedRoomId })}
                  className="bg-cyan-500 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-semibold">创建第一条抄表记录</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* 底部间距 */}
        <View className="h-5" />
      </ScrollView>
    </View>
  );
}
