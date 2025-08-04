import { buildingService } from '../services/buildingService';
import { roomService } from '../services/roomService';
import { utilityReadingService } from '../services/utilityReadingService';

/**
 * 筛选功能测试工具
 */
export class FilterFunctionalityTester {
  
  /**
   * 测试楼宇筛选功能
   */
  static testBuildingFilter() {
    console.log('🧪 开始测试楼宇筛选功能...');
    console.log('💡 注意：此测试需要用户登录并有楼宇数据');
    
    // 1. 获取楼宇列表
    buildingService.getBuildingList().subscribe({
      next: (buildings) => {
        console.log('✅ 获取楼宇列表成功:');
        console.log('🏢 楼宇数量:', buildings.length);
        
        if (buildings.length === 0) {
          console.log('⚠️ 没有楼宇数据，无法测试筛选功能');
          return;
        }
        
        buildings.forEach((building, index) => {
          console.log(`🏢 楼宇 ${index + 1}: ${building.buildingName} (ID: ${building.id})`);
        });
        
        // 2. 测试按楼宇筛选房间
        const firstBuilding = buildings[0];
        console.log(`\n🔍 测试按楼宇筛选房间 - 楼宇: ${firstBuilding.buildingName}`);
        
        roomService.getRoomList({ buildingId: firstBuilding.id }).subscribe({
          next: (rooms) => {
            console.log('✅ 按楼宇筛选房间成功:');
            console.log(`🏠 楼宇"${firstBuilding.buildingName}"下的房间数量:`, rooms.length);
            
            rooms.forEach((room, index) => {
              console.log(`  房间 ${index + 1}: ${room.roomNumber} (租金: ¥${room.rent})`);
            });
            
            // 3. 测试按楼宇筛选抄表记录
            if (rooms.length > 0) {
              console.log(`\n📊 测试按楼宇筛选抄表记录 - 楼宇: ${firstBuilding.buildingName}`);
              
              utilityReadingService.getUtilityReadingList({ buildingId: firstBuilding.id }).subscribe({
                next: (readings) => {
                  console.log('✅ 按楼宇筛选抄表记录成功:');
                  console.log(`📊 楼宇"${firstBuilding.buildingName}"下的抄表记录数量:`, readings.length);
                  
                  readings.forEach((reading, index) => {
                    console.log(`  记录 ${index + 1}: 房间${reading.roomNumber} - ${reading.readingDate}`);
                  });
                },
                error: (error) => {
                  console.error('❌ 按楼宇筛选抄表记录失败:', error);
                }
              });
            }
          },
          error: (error) => {
            console.error('❌ 按楼宇筛选房间失败:', error);
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败:', error);
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
   * 测试房间筛选功能
   */
  static testRoomFilter() {
    console.log('🧪 开始测试房间筛选功能...');
    console.log('💡 注意：此测试需要用户登录并有房间数据');
    
    // 1. 获取房间列表
    roomService.getRoomList().subscribe({
      next: (rooms) => {
        console.log('✅ 获取房间列表成功:');
        console.log('🏠 房间数量:', rooms.length);
        
        if (rooms.length === 0) {
          console.log('⚠️ 没有房间数据，无法测试筛选功能');
          return;
        }
        
        rooms.slice(0, 5).forEach((room, index) => {
          console.log(`🏠 房间 ${index + 1}: ${room.roomNumber} (楼宇: ${room.buildingName || '未知'})`);
        });
        
        // 2. 测试按房间筛选抄表记录
        const firstRoom = rooms[0];
        console.log(`\n📊 测试按房间筛选抄表记录 - 房间: ${firstRoom.roomNumber}`);
        
        utilityReadingService.getUtilityReadingList({ roomId: firstRoom.id }).subscribe({
          next: (readings) => {
            console.log('✅ 按房间筛选抄表记录成功:');
            console.log(`📊 房间"${firstRoom.roomNumber}"的抄表记录数量:`, readings.length);
            
            readings.forEach((reading, index) => {
              console.log(`  记录 ${index + 1}: ${reading.readingDate} - 电表:${reading.electricityReading}度, 水表:${reading.waterReading}吨`);
            });
          },
          error: (error) => {
            console.error('❌ 按房间筛选抄表记录失败:', error);
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败:', error);
      }
    });
  }

  /**
   * 测试筛选联动功能
   */
  static testFilterLinkage() {
    console.log('🧪 开始测试筛选联动功能...');
    console.log('💡 测试楼宇筛选对房间列表的影响');
    
    // 1. 获取所有房间
    roomService.getRoomList().subscribe({
      next: (allRooms) => {
        console.log('✅ 获取所有房间成功:');
        console.log('🏠 总房间数量:', allRooms.length);
        
        // 2. 获取楼宇列表
        buildingService.getBuildingList().subscribe({
          next: (buildings) => {
            if (buildings.length === 0) {
              console.log('⚠️ 没有楼宇数据，无法测试联动功能');
              return;
            }
            
            const firstBuilding = buildings[0];
            console.log(`\n🔍 测试楼宇筛选联动 - 选择楼宇: ${firstBuilding.buildingName}`);
            
            // 3. 按楼宇筛选房间
            roomService.getRoomList({ buildingId: firstBuilding.id }).subscribe({
              next: (filteredRooms) => {
                console.log('✅ 楼宇筛选联动测试成功:');
                console.log(`🏠 楼宇"${firstBuilding.buildingName}"下的房间数量:`, filteredRooms.length);
                console.log(`📊 筛选比例: ${((filteredRooms.length / allRooms.length) * 100).toFixed(1)}%`);
                
                // 4. 验证筛选结果
                const isCorrectFilter = filteredRooms.every(room => 
                  room.buildingId === firstBuilding.id || room.buildingName === firstBuilding.buildingName
                );
                
                if (isCorrectFilter) {
                  console.log('✅ 筛选结果正确：所有房间都属于选中楼宇');
                } else {
                  console.log('❌ 筛选结果错误：存在不属于选中楼宇的房间');
                }
              },
              error: (error) => {
                console.error('❌ 楼宇筛选联动测试失败:', error);
              }
            });
          },
          error: (error) => {
            console.error('❌ 获取楼宇列表失败:', error);
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取所有房间失败:', error);
      }
    });
  }

  /**
   * 测试筛选性能
   */
  static testFilterPerformance() {
    console.log('🧪 开始测试筛选性能...');
    
    const startTime = Date.now();
    
    // 并发测试多个筛选操作
    Promise.all([
      new Promise(resolve => {
        buildingService.getBuildingList().subscribe({
          next: (buildings) => resolve(buildings.length),
          error: () => resolve(0)
        });
      }),
      new Promise(resolve => {
        roomService.getRoomList().subscribe({
          next: (rooms) => resolve(rooms.length),
          error: () => resolve(0)
        });
      }),
      new Promise(resolve => {
        utilityReadingService.getUtilityReadingList().subscribe({
          next: (readings) => resolve(readings.length),
          error: () => resolve(0)
        });
      })
    ]).then((results) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('✅ 筛选性能测试完成:');
      console.log(`⏱️ 总耗时: ${duration}ms`);
      console.log(`🏢 楼宇数量: ${results[0]}`);
      console.log(`🏠 房间数量: ${results[1]}`);
      console.log(`📊 抄表记录数量: ${results[2]}`);
      console.log(`📈 平均响应时间: ${(duration / 3).toFixed(1)}ms`);
      
      if (duration < 3000) {
        console.log('🚀 性能良好：响应时间在可接受范围内');
      } else {
        console.log('⚠️ 性能警告：响应时间较长，可能需要优化');
      }
    });
  }

  /**
   * 运行所有筛选功能测试
   */
  static runAllTests() {
    console.log('🚀 开始运行筛选功能全套测试...');
    console.log('='.repeat(50));
    
    // 1. 测试楼宇筛选
    this.testBuildingFilter();
    
    // 2. 延迟测试房间筛选
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testRoomFilter();
    }, 3000);
    
    // 3. 延迟测试筛选联动
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testFilterLinkage();
    }, 6000);
    
    // 4. 延迟测试性能
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testFilterPerformance();
    }, 9000);
  }

  /**
   * 快速测试 - 只测试基本筛选功能
   */
  static quickTest() {
    console.log('⚡ 快速测试 - 筛选功能基本验证');
    this.testBuildingFilter();
  }
}

// 导出便捷的测试函数
export const testFilterFunctionality = {
  // 测试楼宇筛选
  building: () => FilterFunctionalityTester.testBuildingFilter(),

  // 测试房间筛选
  room: () => FilterFunctionalityTester.testRoomFilter(),

  // 测试筛选联动
  linkage: () => FilterFunctionalityTester.testFilterLinkage(),

  // 测试筛选性能
  performance: () => FilterFunctionalityTester.testFilterPerformance(),

  // 运行全部测试
  all: () => FilterFunctionalityTester.runAllTests(),

  // 快速测试
  quick: () => FilterFunctionalityTester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testFilterFunctionality = testFilterFunctionality;
  console.log('🛠️ 开发模式：筛选功能测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testFilterFunctionality.quick()       // 快速测试筛选功能');
  console.log('  - testFilterFunctionality.building()    // 测试楼宇筛选');
  console.log('  - testFilterFunctionality.room()        // 测试房间筛选');
  console.log('  - testFilterFunctionality.linkage()     // 测试筛选联动');
  console.log('  - testFilterFunctionality.performance() // 测试筛选性能');
  console.log('  - testFilterFunctionality.all()         // 运行全部测试');
}
