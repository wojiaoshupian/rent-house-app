import { utilityReadingService } from '../services/utilityReadingService';
import { roomService } from '../services/roomService';
import { CreateUtilityReadingRequest, ReadingType, ReadingStatus } from '../types/utilityReading';

/**
 * 抄水电表API测试工具
 */
export class UtilityReadingAPITester {
  
  /**
   * 测试创建抄表记录
   */
  static testCreateUtilityReading() {
    console.log('🧪 开始测试创建抄表记录...');
    console.log('💡 注意：此接口需要用户登录并调用 POST /api/utility-readings');
    
    // 首先获取房间列表，选择第一个房间
    roomService.getRoomList().subscribe({
      next: (rooms) => {
        if (rooms.length === 0) {
          console.log('⚠️ 没有房间可以创建抄表记录，请先创建房间');
          return;
        }
        
        const room = rooms[0];
        console.log('🏠 选择房间:', room.roomNumber, 'ID:', room.id);
        
        const testReading: CreateUtilityReadingRequest = {
          roomId: room.id,
          readingDate: new Date().toISOString().split('T')[0], // 今天
          electricityReading: Math.floor(Math.random() * 1000) + 1000, // 1000-2000度
          waterReading: Math.floor(Math.random() * 50) + 50, // 50-100吨
          hotWaterReading: Math.floor(Math.random() * 20) + 10, // 10-30吨
          meterReader: '测试抄表员',
          readingType: ReadingType.MANUAL,
          notes: `测试抄表记录 - ${new Date().toLocaleString()}`
        };
        
        console.log('📊 创建抄表记录数据:', testReading);
        
        utilityReadingService.createUtilityReading(testReading).subscribe({
          next: (reading) => {
            console.log('✅ 抄表记录创建成功:');
            console.log('  - ID:', reading.id);
            console.log('  - 房间ID:', reading.roomId);
            console.log('  - 抄表日期:', reading.readingDate);
            console.log('  - 电表读数:', reading.electricityReading, '度');
            console.log('  - 水表读数:', reading.waterReading, '吨');
            console.log('  - 热水读数:', reading.hotWaterReading, '吨');
            console.log('  - 抄表人:', reading.meterReader);
            console.log('  - 抄表类型:', reading.readingType);
            console.log('  - 状态:', reading.readingStatus);
            console.log('  - 创建时间:', reading.createdAt);
          },
          error: (error) => {
            console.error('❌ 创建抄表记录失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
            
            if (error.message?.includes('登录')) {
              console.log('💡 提示：请先登录后再测试');
            } else if (error.status === 409) {
              console.log('💡 提示：该房间在此日期可能已有抄表记录');
            }
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败，无法进行抄表记录创建测试:', error);
      }
    });
  }

  /**
   * 测试获取抄表记录列表
   */
  static testGetUtilityReadingList() {
    console.log('🧪 开始测试获取抄表记录列表...');
    console.log('💡 注意：此接口需要用户登录并调用 GET /api/utility-readings');
    
    utilityReadingService.getUtilityReadingList().subscribe({
      next: (readings) => {
        console.log('✅ 获取抄表记录列表成功:');
        console.log('📊 记录数量:', readings.length);
        console.log('📋 抄表记录列表:', readings);
        
        if (readings.length > 0) {
          console.log('📊 第一条抄表记录详情:');
          const firstReading = readings[0];
          console.log('  - ID:', firstReading.id);
          console.log('  - 房间号:', firstReading.roomNumber);
          console.log('  - 楼宇:', firstReading.buildingName);
          console.log('  - 抄表日期:', firstReading.readingDate);
          console.log('  - 电表读数:', firstReading.electricityReading, '度');
          console.log('  - 水表读数:', firstReading.waterReading, '吨');
          console.log('  - 抄表人:', firstReading.meterReader);
          console.log('  - 状态:', firstReading.readingStatus);
          console.log('  - 创建时间:', firstReading.createdAt);
        } else {
          console.log('📝 当前没有抄表记录');
          console.log('💡 提示：可以先创建一个抄表记录进行测试');
        }
      },
      error: (error) => {
        console.error('❌ 获取抄表记录列表失败:', error);
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
   * 测试根据房间ID获取抄表记录
   */
  static testGetUtilityReadingsByRoomId(roomId?: number) {
    console.log('🧪 测试根据房间ID获取抄表记录...');
    
    if (!roomId) {
      console.log('💡 未提供房间ID，尝试获取第一个房间...');
      
      roomService.getRoomList().subscribe({
        next: (rooms) => {
          if (rooms.length === 0) {
            console.log('⚠️ 没有房间，无法测试');
            return;
          }
          
          const room = rooms[0];
          console.log('🏠 选择房间:', room.roomNumber, 'ID:', room.id);
          this.testGetUtilityReadingsByRoomId(room.id);
        },
        error: (error) => {
          console.error('❌ 获取房间列表失败:', error);
        }
      });
      return;
    }
    
    console.log('🔍 获取房间ID为', roomId, '的抄表记录...');
    
    utilityReadingService.getUtilityReadingsByRoomId(roomId).subscribe({
      next: (readings) => {
        console.log('✅ 根据房间ID获取抄表记录成功:');
        console.log('📊 房间', roomId, '的抄表记录数量:', readings.length);
        console.log('📋 抄表记录列表:', readings);
        
        if (readings.length > 0) {
          readings.forEach((reading, index) => {
            console.log(`📊 抄表记录 ${index + 1}:`);
            console.log('  - 抄表日期:', reading.readingDate);
            console.log('  - 电表读数:', reading.electricityReading, '度');
            console.log('  - 水表读数:', reading.waterReading, '吨');
            console.log('  - 抄表人:', reading.meterReader);
            console.log('  - 状态:', reading.readingStatus);
          });
        } else {
          console.log('📝 房间', roomId, '没有抄表记录');
        }
      },
      error: (error) => {
        console.error('❌ 根据房间ID获取抄表记录失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
    });
  }

  /**
   * 测试获取最新抄表记录
   */
  static testGetLatestUtilityReading() {
    console.log('🧪 开始测试获取最新抄表记录...');
    
    // 首先获取房间列表，选择第一个房间
    roomService.getRoomList().subscribe({
      next: (rooms) => {
        if (rooms.length === 0) {
          console.log('⚠️ 没有房间，无法测试');
          return;
        }
        
        const room = rooms[0];
        console.log('🏠 选择房间:', room.roomNumber, 'ID:', room.id);
        
        utilityReadingService.getLatestUtilityReading(room.id).subscribe({
          next: (reading) => {
            if (reading) {
              console.log('✅ 获取最新抄表记录成功:');
              console.log('📊 最新抄表记录:', reading);
              console.log('  - 抄表日期:', reading.readingDate);
              console.log('  - 电表读数:', reading.electricityReading, '度');
              console.log('  - 水表读数:', reading.waterReading, '吨');
              console.log('  - 抄表人:', reading.meterReader);
              console.log('  - 状态:', reading.readingStatus);
            } else {
              console.log('📝 房间', room.id, '暂无抄表记录');
            }
          },
          error: (error) => {
            console.error('❌ 获取最新抄表记录失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取房间列表失败:', error);
      }
    });
  }

  /**
   * 测试更新抄表记录
   */
  static testUpdateUtilityReading() {
    console.log('🧪 开始测试更新抄表记录...');
    
    // 首先获取抄表记录列表，找到第一个记录进行更新
    utilityReadingService.getUtilityReadingList().subscribe({
      next: (readings) => {
        if (readings.length === 0) {
          console.log('⚠️ 没有抄表记录可以更新，请先创建抄表记录');
          return;
        }
        
        const readingToUpdate = readings[0];
        console.log('📊 准备更新抄表记录:', readingToUpdate.id);
        
        const updateData = {
          id: readingToUpdate.id,
          electricityReading: readingToUpdate.electricityReading + 10,
          waterReading: readingToUpdate.waterReading + 5,
          notes: `已更新 - ${new Date().toLocaleString()}`
        };
        
        utilityReadingService.updateUtilityReading(updateData).subscribe({
          next: (updatedReading) => {
            console.log('✅ 更新抄表记录成功:');
            console.log('📊 更新后的抄表记录:', updatedReading);
            console.log('  - 新电表读数:', updatedReading.electricityReading);
            console.log('  - 新水表读数:', updatedReading.waterReading);
            console.log('  - 新备注:', updatedReading.notes);
          },
          error: (error) => {
            console.error('❌ 更新抄表记录失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取抄表记录列表失败，无法进行更新测试:', error);
      }
    });
  }

  /**
   * 测试确认抄表记录
   */
  static testConfirmUtilityReading() {
    console.log('🧪 开始测试确认抄表记录...');
    
    // 首先获取抄表记录列表，找到待确认的记录
    utilityReadingService.getUtilityReadingList().subscribe({
      next: (readings) => {
        if (readings.length === 0) {
          console.log('⚠️ 没有抄表记录，请先创建抄表记录');
          return;
        }
        
        // 找到第一个待确认的记录，或者使用第一个记录
        const readingToConfirm = readings.find(r => r.readingStatus === ReadingStatus.PENDING) || readings[0];
        console.log('📊 准备确认抄表记录:', readingToConfirm.id, '当前状态:', readingToConfirm.readingStatus);
        
        utilityReadingService.confirmUtilityReading(readingToConfirm.id).subscribe({
          next: (confirmedReading) => {
            console.log('✅ 确认抄表记录成功:');
            console.log('📊 确认后的抄表记录:', confirmedReading);
            console.log('  - 新状态:', confirmedReading.readingStatus);
            console.log('  - 更新时间:', confirmedReading.updatedAt);
          },
          error: (error) => {
            console.error('❌ 确认抄表记录失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取抄表记录列表失败，无法进行确认测试:', error);
      }
    });
  }

  /**
   * 运行所有测试
   */
  static runAllTests() {
    console.log('🚀 开始运行抄表API全套测试...');
    console.log('='.repeat(50));
    
    // 1. 测试获取列表
    this.testGetUtilityReadingList();
    
    // 2. 延迟测试创建（避免并发）
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testCreateUtilityReading();
    }, 2000);
    
    // 3. 延迟测试获取最新记录
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testGetLatestUtilityReading();
    }, 4000);
    
    // 4. 延迟测试更新
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testUpdateUtilityReading();
    }, 6000);
    
    // 5. 延迟测试确认
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testConfirmUtilityReading();
    }, 8000);
  }

  /**
   * 快速测试 - 只获取列表
   */
  static quickTest() {
    console.log('⚡ 快速测试 - 获取抄表记录列表');
    this.testGetUtilityReadingList();
  }
}

// 导出便捷的测试函数
export const testUtilityReadingAPI = {
  // 获取抄表记录列表
  getList: () => UtilityReadingAPITester.testGetUtilityReadingList(),

  // 根据房间ID获取抄表记录
  getByRoomId: (roomId?: number) => UtilityReadingAPITester.testGetUtilityReadingsByRoomId(roomId),

  // 获取最新抄表记录
  getLatest: () => UtilityReadingAPITester.testGetLatestUtilityReading(),

  // 创建抄表记录
  create: () => UtilityReadingAPITester.testCreateUtilityReading(),

  // 更新抄表记录
  update: () => UtilityReadingAPITester.testUpdateUtilityReading(),

  // 确认抄表记录
  confirm: () => UtilityReadingAPITester.testConfirmUtilityReading(),

  // 运行全部测试
  all: () => UtilityReadingAPITester.runAllTests(),

  // 快速测试
  quick: () => UtilityReadingAPITester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testUtilityReadingAPI = testUtilityReadingAPI;
  console.log('🛠️ 开发模式：抄表API测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testUtilityReadingAPI.quick()        // 快速测试获取列表');
  console.log('  - testUtilityReadingAPI.getList()      // 测试获取抄表记录列表');
  console.log('  - testUtilityReadingAPI.getByRoomId()  // 测试根据房间ID获取记录');
  console.log('  - testUtilityReadingAPI.getLatest()    // 测试获取最新记录');
  console.log('  - testUtilityReadingAPI.create()       // 测试创建抄表记录');
  console.log('  - testUtilityReadingAPI.update()       // 测试更新抄表记录');
  console.log('  - testUtilityReadingAPI.confirm()      // 测试确认抄表记录');
  console.log('  - testUtilityReadingAPI.all()          // 运行全部测试');
}
