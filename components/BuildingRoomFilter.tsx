import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { buildingService } from '../services/buildingService';
import { roomService } from '../services/roomService';
import { Building } from '../types/building';
import { Room } from '../types/room';

interface BuildingRoomFilterProps {
  selectedBuildingId?: number;
  selectedRoomId?: number;
  onBuildingChange: (buildingId?: number) => void;
  onRoomChange: (roomId?: number) => void;
  showRoomFilter?: boolean;
  style?: any;
}

export default function BuildingRoomFilter({
  selectedBuildingId,
  selectedRoomId,
  onBuildingChange,
  onRoomChange,
  showRoomFilter = true,
  style
}: BuildingRoomFilterProps) {
  // 状态管理
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);
  const [showRoomFilterDropdown, setShowRoomFilterDropdown] = useState(false);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchBuildings();
  }, []);

  // 当选择楼宇时，获取该楼宇下的房间
  useEffect(() => {
    if (selectedBuildingId) {
      fetchRoomsByBuilding(selectedBuildingId);
    } else {
      fetchAllRooms();
    }
  }, [selectedBuildingId]);

  // 获取楼宇列表
  const fetchBuildings = () => {
    buildingService.getBuildingList().subscribe({
      next: (buildingList) => {
        setBuildings(buildingList);
        console.log('✅ 筛选器获取楼宇列表成功，数量:', buildingList.length);
      },
      error: (error) => {
        console.error('❌ 筛选器获取楼宇列表失败:', error);
      }
    });
  };

  // 获取所有房间
  const fetchAllRooms = () => {
    roomService.getRoomList().subscribe({
      next: (roomList) => {
        setRooms(roomList);
        console.log('✅ 筛选器获取所有房间成功，数量:', roomList.length);
      },
      error: (error) => {
        console.error('❌ 筛选器获取房间列表失败:', error);
      }
    });
  };

  // 根据楼宇获取房间
  const fetchRoomsByBuilding = (buildingId: number) => {
    roomService.getRoomList({ buildingId }).subscribe({
      next: (roomList) => {
        setRooms(roomList);
        console.log('✅ 筛选器获取楼宇房间成功，数量:', roomList.length);
      },
      error: (error) => {
        console.error('❌ 筛选器获取楼宇房间失败:', error);
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
    if (!selectedRoomId) return '全部房间';
    const room = rooms.find(r => r.id === selectedRoomId);
    return room ? `房间 ${room.roomNumber}` : '未知房间';
  };

  // 处理楼宇选择
  const handleBuildingSelect = (buildingId?: number) => {
    onBuildingChange(buildingId);
    if (selectedRoomId) {
      onRoomChange(undefined); // 清除房间筛选
    }
    setShowBuildingFilter(false);
  };

  // 处理房间选择
  const handleRoomSelect = (roomId?: number) => {
    onRoomChange(roomId);
    setShowRoomFilterDropdown(false);
  };

  return (
    <View style={[{
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6'
    }, style]}>
      {/* 楼宇筛选 */}
      <TouchableOpacity
        onPress={() => setShowBuildingFilter(!showBuildingFilter)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
          marginBottom: showRoomFilter ? 8 : 0
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
          marginBottom: showRoomFilter ? 12 : 0,
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 8,
          backgroundColor: '#f9fafb',
          maxHeight: 200
        }}>
          <ScrollView>
            {/* 全部楼宇选项 */}
            <TouchableOpacity
              onPress={() => handleBuildingSelect(undefined)}
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
                onPress={() => handleBuildingSelect(building.id)}
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
      {showRoomFilter && (
        <>
          <TouchableOpacity
            onPress={() => setShowRoomFilterDropdown(!showRoomFilterDropdown)}
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
              {showRoomFilterDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {/* 房间筛选器 */}
          {showRoomFilterDropdown && (
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
                  onPress={() => handleRoomSelect(undefined)}
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
                    onPress={() => handleRoomSelect(room.id)}
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
        </>
      )}
    </View>
  );
}
