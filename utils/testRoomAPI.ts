import { roomService } from '../services/roomService';
import { buildingService } from '../services/buildingService';
import { CreateRoomRequest, UpdateRoomRequest, RoomStatus } from '../types/room';

/**
 * 房间API测试工具
 */
export class RoomAPITester {
  
  /**
   * 测试创建房间
   */
  static testCreateRoom() {
    console.log('🧪 开始测试创建房间...');
    console.log('💡 注意：此接口需要用户登录并调用 POST /api/rooms');
    
    // 首先获取楼宇列表，选择第一个楼宇
    buildingService.getBuildingList().subscribe({
      next: (buildings) => {
        if (buildings.length === 0) {
          console.log('⚠️ 没有楼宇可以创建房间，请先创建楼宇');
          return;
        }
        
        const building = buildings[0];
        console.log('🏢 选择楼宇:', building.buildingName, 'ID:', building.id);
        
        const testRoom: CreateRoomRequest = {
          roomNumber: `测试房间_${Date.now()}`,
          rent: 1500.00,
          defaultDeposit: 3000.00,
          electricityUnitPrice: 1.2,
          waterUnitPrice: 3.5,
          hotWaterUnitPrice: 6.0,
          buildingId: building.id
        };
        
        console.log('🏠 创建房间数据:', testRoom);
        
        roomService.createRoom(testRoom).subscribe({
          next: (room) => {
            console.log('✅ 房间创建成功:');
            console.log('  - ID:', room.id);
            console.log('  - 房间号:', room.roomNumber);
            console.log('  - 租金:', room.rent, '元/月');
            console.log('  - 押金:', room.defaultDeposit, '元');
            console.log('  - 电费:', room.electricityUnitPrice, '元/度');
            console.log('  - 水费:', room.waterUnitPrice, '元/吨');
            console.log('  - 热水费:', room.hotWaterUnitPrice, '元/吨');
            console.log('  - 楼宇ID:', room.buildingId);
            console.log('  - 创建时间:', room.createdAt);
          },
          error: (error) => {
            console.error('❌ 创建房间失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
            
            if (error.message?.includes('登录')) {
              console.log('💡 提示：请先登录后再测试');
            } else if (error.status === 409) {
              console.log('💡 提示：房间号可能已存在');
            }
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败，无法进行房间创建测试:', error);
      }
    });
  }

  /**
   * 测试获取房间列表
   */
  static testGetRoomList() {
    console.log('🧪 开始测试获取房间列表...');
    console.log('💡 注意：此接口需要用户登录并调用 GET /api/rooms');
    
    roomService.getRoomList().subscribe({
      next: (rooms) => {
        console.log('✅ 获取房间列表成功:');
        console.log('📊 房间数量:', rooms.length);
        console.log('📋 房间列表:', rooms);
        
        if (rooms.length > 0) {
          console.log('🏠 第一个房间详情:');
          const firstRoom = rooms[0];
          console.log('  - ID:', firstRoom.id);
          console.log('  - 房间号:', firstRoom.roomNumber);
          console.log('  - 租金:', firstRoom.rent, '元/月');
          console.log('  - 押金:', firstRoom.defaultDeposit, '元');
          console.log('  - 楼宇ID:', firstRoom.buildingId);
          console.log('  - 状态:', firstRoom.status || '未设置');
          console.log('  - 创建时间:', firstRoom.createdAt);
        } else {
          console.log('📝 当前没有房间');
          console.log('💡 提示：可以先创建一个房间进行测试');
        }
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
        
        if (error.message?.includes('登录')) {
          console.log('💡 提示：请先登录后再测试');
        }
      }
    });
  }

  /**
   * 测试根据楼宇ID获取房间
   */
  static testGetRoomsByBuildingId(buildingId?: number) {
    console.log('🧪 测试根据楼宇ID获取房间...');
    
    if (!buildingId) {
      console.log('💡 未提供楼宇ID，尝试获取第一个楼宇...');
      
      buildingService.getBuildingList().subscribe({
        next: (buildings) => {
          if (buildings.length === 0) {
            console.log('⚠️ 没有楼宇，无法测试');
            return;
          }
          
          const building = buildings[0];
          console.log('🏢 选择楼宇:', building.buildingName, 'ID:', building.id);
          this.testGetRoomsByBuildingId(building.id);
        },
        error: (error) => {
          console.error('❌ 获取楼宇列表失败:', error);
        }
      });
      return;
    }
    
    console.log('🔍 获取楼宇ID为', buildingId, '的房间...');
    
    roomService.getRoomsByBuildingId(buildingId).subscribe({
      next: (rooms) => {
        console.log('✅ 根据楼宇ID获取房间成功:');
        console.log('📊 楼宇', buildingId, '的房间数量:', rooms.length);
        console.log('📋 房间列表:', rooms);
        
        if (rooms.length > 0) {
          rooms.forEach((room, index) => {
            console.log(`🏠 房间 ${index + 1}:`);
            console.log('  - ID:', room.id);
            console.log('  - 房间号:', room.roomNumber);
            console.log('  - 租金:', room.rent, '元/月');
            console.log('  - 状态:', room.status || '未设置');
          });
        } else {
          console.log('📝 楼宇', buildingId, '没有房间');
        }
      },
      error: (error) => {
        console.error('❌ 根据楼宇ID获取房间失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
    });
  }

  /**
   * 测试更新房间
   */
  static testUpdateRoom() {
    console.log('🧪 开始测试更新房间...');
    
    // 首先获取房间列表，找到第一个房间进行更新
    roomService.getRoomList().subscribe({
      next: (rooms) => {
        if (rooms.length === 0) {
          console.log('⚠️ 没有房间可以更新，请先创建房间');
          return;
        }
        
        const roomToUpdate = rooms[0];
        console.log('🏠 准备更新房间:', roomToUpdate.roomNumber);
        
        const updateData: UpdateRoomRequest = {
          id: roomToUpdate.id,
          roomNumber: `${roomToUpdate.roomNumber}_已更新_${Date.now()}`,
          rent: roomToUpdate.rent + 100,
          electricityUnitPrice: roomToUpdate.electricityUnitPrice + 0.1,
          waterUnitPrice: roomToUpdate.waterUnitPrice + 0.1
        };
        
        roomService.updateRoom(updateData).subscribe({
          next: (updatedRoom) => {
            console.log('✅ 更新房间成功:');
            console.log('🏠 更新后的房间:', updatedRoom);
            console.log('  - 新房间号:', updatedRoom.roomNumber);
            console.log('  - 新租金:', updatedRoom.rent);
            console.log('  - 新电费:', updatedRoom.electricityUnitPrice);
          },
          error: (error) => {
            console.error('❌ 更新房间失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败，无法进行更新测试:', error);
      }
    });
  }

  /**
   * 测试删除房间
   */
  static testDeleteRoom() {
    console.log('🧪 开始测试删除房间...');
    
    // 首先创建一个测试房间，然后删除它
    buildingService.getBuildingList().subscribe({
      next: (buildings) => {
        if (buildings.length === 0) {
          console.log('⚠️ 没有楼宇，无法创建测试房间');
          return;
        }
        
        const building = buildings[0];
        const testRoom: CreateRoomRequest = {
          roomNumber: `待删除测试房间_${Date.now()}`,
          rent: 1000.00,
          defaultDeposit: 2000.00,
          electricityUnitPrice: 1.0,
          waterUnitPrice: 3.0,
          buildingId: building.id
        };
        
        roomService.createRoom(testRoom).subscribe({
          next: (createdRoom) => {
            console.log('✅ 创建测试房间成功:', createdRoom.roomNumber);
            console.log('🗑️ 准备删除房间 ID:', createdRoom.id);
            
            // 等待1秒后删除
            setTimeout(() => {
              roomService.deleteRoom(createdRoom.id).subscribe({
                next: () => {
                  console.log('✅ 删除房间成功');
                  console.log('🏠 已删除房间:', createdRoom.roomNumber);
                  
                  // 验证删除结果，重新获取列表
                  setTimeout(() => {
                    console.log('🔄 验证删除结果，重新获取房间列表...');
                    this.testGetRoomList();
                  }, 1000);
                },
                error: (error) => {
                  console.error('❌ 删除房间失败:', error);
                  console.error('错误详情:', {
                    message: error.message,
                    status: error.status,
                    url: error.url
                  });
                }
              });
            }, 1000);
          },
          error: (error) => {
            console.error('❌ 创建测试房间失败，无法进行删除测试:', error);
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败:', error);
      }
    });
  }

  /**
   * 测试搜索房间
   */
  static testSearchRooms(query: string = '测试') {
    console.log('🧪 开始测试搜索房间...', `关键词: "${query}"`);
    
    roomService.searchRooms(query).subscribe({
      next: (rooms) => {
        console.log('✅ 搜索房间成功:');
        console.log('📊 搜索结果数量:', rooms.length);
        console.log('📋 搜索结果:', rooms);
        
        if (rooms.length > 0) {
          rooms.forEach((room, index) => {
            console.log(`🏠 房间 ${index + 1}:`);
            console.log('  - 房间号:', room.roomNumber);
            console.log('  - 租金:', room.rent, '元/月');
            console.log('  - 楼宇ID:', room.buildingId);
          });
        } else {
          console.log('📝 没有找到匹配的房间');
        }
      },
      error: (error) => {
        console.error('❌ 搜索房间失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
    });
  }

  /**
   * 运行所有测试
   */
  static runAllTests() {
    console.log('🚀 开始运行房间API全套测试...');
    console.log('='.repeat(50));
    
    // 1. 测试获取列表
    this.testGetRoomList();
    
    // 2. 延迟测试创建（避免并发）
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testCreateRoom();
    }, 2000);
    
    // 3. 延迟测试更新
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testUpdateRoom();
    }, 4000);
    
    // 4. 延迟测试删除
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testDeleteRoom();
    }, 6000);
    
    // 5. 延迟测试搜索
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testSearchRooms();
    }, 8000);
  }

  /**
   * 快速测试 - 只获取列表
   */
  static quickTest() {
    console.log('⚡ 快速测试 - 获取房间列表');
    this.testGetRoomList();
  }
}

// 导出便捷的测试函数
export const testRoomAPI = {
  // 获取房间列表
  getList: () => RoomAPITester.testGetRoomList(),

  // 根据楼宇ID获取房间
  getByBuildingId: (buildingId?: number) => RoomAPITester.testGetRoomsByBuildingId(buildingId),

  // 创建房间
  create: () => RoomAPITester.testCreateRoom(),

  // 更新房间
  update: () => RoomAPITester.testUpdateRoom(),

  // 删除房间
  delete: () => RoomAPITester.testDeleteRoom(),

  // 搜索房间
  search: (query?: string) => RoomAPITester.testSearchRooms(query),

  // 运行全部测试
  all: () => RoomAPITester.runAllTests(),

  // 快速测试
  quick: () => RoomAPITester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testRoomAPI = testRoomAPI;
  console.log('🛠️ 开发模式：房间API测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testRoomAPI.quick()           // 快速测试获取列表');
  console.log('  - testRoomAPI.getList()         // 测试获取房间列表');
  console.log('  - testRoomAPI.getByBuildingId() // 测试根据楼宇ID获取房间');
  console.log('  - testRoomAPI.create()          // 测试创建房间');
  console.log('  - testRoomAPI.update()          // 测试更新房间');
  console.log('  - testRoomAPI.delete()          // 测试删除房间');
  console.log('  - testRoomAPI.search()          // 测试搜索房间');
  console.log('  - testRoomAPI.all()             // 运行全部测试');
}
