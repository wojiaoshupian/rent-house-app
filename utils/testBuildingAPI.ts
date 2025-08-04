import { buildingService } from '../services/buildingService';
import { CreateBuildingRequest } from '../types/building';

/**
 * 测试楼宇API的工具函数
 */
export class BuildingAPITester {
  
  /**
   * 测试获取用户拥有的楼宇列表
   */
  static testGetBuildingList() {
    console.log('🧪 开始测试获取用户拥有的楼宇列表...');
    console.log('💡 注意：此接口需要用户登录并调用 /api/buildings/owned/{userId}');

    buildingService.getBuildingList().subscribe({
      next: (buildings) => {
        console.log('✅ 获取用户楼宇列表成功:');
        console.log('📊 用户拥有楼宇数量:', buildings.length);
        console.log('📋 楼宇列表:', buildings);

        if (buildings.length > 0) {
          console.log('🏢 第一个楼宇详情:');
          console.log('  - ID:', buildings[0].id);
          console.log('  - 名称:', buildings[0].buildingName);
          console.log('  - 房东:', buildings[0].landlordName);
          console.log('  - 电费:', buildings[0].electricityUnitPrice, '元/度');
          console.log('  - 水费:', buildings[0].waterUnitPrice, '元/吨');
          console.log('  - 创建者:', buildings[0].createdByUsername || '未知');
          console.log('  - 创建时间:', buildings[0].createdAt);
        } else {
          console.log('📝 当前用户没有拥有的楼宇');
          console.log('💡 提示：可以先创建一个楼宇进行测试');
        }
      },
      error: (error) => {
        console.error('❌ 获取用户楼宇列表失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });

        if (error.message?.includes('登录')) {
          console.log('💡 提示：请先登录后再测试');
        } else if (error.status === 404) {
          console.log('💡 提示：用户可能没有拥有的楼宇，或接口路径不正确');
        }
      }
    });
  }

  /**
   * 测试创建楼宇
   */
  static testCreateBuilding() {
    console.log('🧪 开始测试创建楼宇...');
    
    const testBuilding: CreateBuildingRequest = {
      buildingName: `测试楼宇_${Date.now()}`,
      landlordName: '测试房东',
      electricityUnitPrice: 1.2,
      waterUnitPrice: 3.5,
      hotWaterUnitPrice: 4.0,
      electricityCost: 0.8,
      waterCost: 2.0,
      hotWaterCost: 2.5,
      rentCollectionMethod: 'FIXED_MONTH_START'
    };

    buildingService.createBuilding(testBuilding).subscribe({
      next: (building) => {
        console.log('✅ 创建楼宇成功:');
        console.log('🏢 新建楼宇:', building);
        console.log('  - ID:', building.id);
        console.log('  - 名称:', building.buildingName);
        
        // 创建成功后，再次获取列表验证
        setTimeout(() => {
          console.log('🔄 验证创建结果，重新获取楼宇列表...');
          this.testGetBuildingList();
        }, 1000);
      },
      error: (error) => {
        console.error('❌ 创建楼宇失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
    });
  }

  /**
   * 测试更新楼宇
   */
  static testUpdateBuilding() {
    console.log('🧪 开始测试更新楼宇...');

    // 首先获取楼宇列表，找到第一个楼宇进行更新
    buildingService.getBuildingList().subscribe({
      next: (buildings) => {
        if (buildings.length === 0) {
          console.log('⚠️ 没有楼宇可以更新，请先创建楼宇');
          return;
        }

        const buildingToUpdate = buildings[0];
        console.log('🏢 准备更新楼宇:', buildingToUpdate.buildingName);

        const updateData = {
          id: buildingToUpdate.id,
          buildingName: `${buildingToUpdate.buildingName}_已更新_${Date.now()}`,
          landlordName: buildingToUpdate.landlordName,
          electricityUnitPrice: buildingToUpdate.electricityUnitPrice + 0.1,
          waterUnitPrice: buildingToUpdate.waterUnitPrice + 0.1,
          hotWaterUnitPrice: buildingToUpdate.hotWaterUnitPrice,
          rentCollectionMethod: buildingToUpdate.rentCollectionMethod
        };

        buildingService.updateBuilding(updateData).subscribe({
          next: (updatedBuilding) => {
            console.log('✅ 更新楼宇成功:');
            console.log('🏢 更新后的楼宇:', updatedBuilding);
            console.log('  - 新名称:', updatedBuilding.buildingName);
            console.log('  - 新电费:', updatedBuilding.electricityUnitPrice);
          },
          error: (error) => {
            console.error('❌ 更新楼宇失败:', error);
            console.error('错误详情:', {
              message: error.message,
              status: error.status,
              url: error.url
            });
          }
        });
      },
      error: (error) => {
        console.error('❌ 获取楼宇列表失败，无法进行更新测试:', error);
      }
    });
  }

  /**
   * 测试删除楼宇
   */
  static testDeleteBuilding() {
    console.log('🧪 开始测试删除楼宇...');

    // 首先创建一个测试楼宇，然后删除它
    const testBuilding = {
      buildingName: `待删除测试楼宇_${Date.now()}`,
      landlordName: '测试房东',
      electricityUnitPrice: 1.0,
      waterUnitPrice: 2.0,
      rentCollectionMethod: 'FIXED_MONTH_START' as const
    };

    buildingService.createBuilding(testBuilding).subscribe({
      next: (createdBuilding) => {
        console.log('✅ 创建测试楼宇成功:', createdBuilding.buildingName);
        console.log('🗑️ 准备删除楼宇 ID:', createdBuilding.id);

        // 等待1秒后删除
        setTimeout(() => {
          buildingService.deleteBuilding(createdBuilding.id).subscribe({
            next: () => {
              console.log('✅ 删除楼宇成功');
              console.log('🏢 已删除楼宇:', createdBuilding.buildingName);

              // 验证删除结果，重新获取列表
              setTimeout(() => {
                console.log('🔄 验证删除结果，重新获取楼宇列表...');
                this.testGetBuildingList();
              }, 1000);
            },
            error: (error) => {
              console.error('❌ 删除楼宇失败:', error);
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
        console.error('❌ 创建测试楼宇失败，无法进行删除测试:', error);
      }
    });
  }

  /**
   * 测试搜索楼宇
   */
  static testSearchBuildings(query: string = '测试') {
    console.log('🧪 开始测试搜索楼宇...', `关键词: "${query}"`);

    buildingService.searchBuildings(query).subscribe({
      next: (buildings) => {
        console.log('✅ 搜索楼宇成功:');
        console.log('📊 搜索结果数量:', buildings.length);
        console.log('📋 搜索结果:', buildings);
      },
      error: (error) => {
        console.error('❌ 搜索楼宇失败:', error);
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
    console.log('🚀 开始运行楼宇API全套测试...');
    console.log('='.repeat(50));

    // 1. 测试获取列表
    this.testGetBuildingList();

    // 2. 延迟测试创建（避免并发）
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testCreateBuilding();
    }, 2000);

    // 3. 延迟测试更新
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testUpdateBuilding();
    }, 4000);

    // 4. 延迟测试删除
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testDeleteBuilding();
    }, 6000);

    // 5. 延迟测试搜索
    setTimeout(() => {
      console.log('\n' + '='.repeat(50));
      this.testSearchBuildings();
    }, 8000);
  }

  /**
   * 测试根据用户ID获取楼宇
   */
  static testGetBuildingsByUserId(userId?: number) {
    console.log('🧪 测试根据用户ID获取楼宇...');

    if (!userId) {
      console.log('💡 未提供用户ID，尝试获取当前用户信息...');

      // 先获取当前用户信息
      import('../services/userService').then(({ userService }) => {
        userService.getCurrentUser().subscribe({
          next: (currentUser) => {
            console.log('👤 当前用户:', currentUser.username, 'ID:', currentUser.id);
            this.testGetBuildingsByUserId(currentUser.id);
          },
          error: (error) => {
            console.error('❌ 获取当前用户失败:', error);
            console.log('💡 请先登录或手动提供用户ID');
          }
        });
      });
      return;
    }

    console.log('🔍 获取用户ID为', userId, '的楼宇...');

    buildingService.getBuildingsByUserId(userId).subscribe({
      next: (buildings) => {
        console.log('✅ 根据用户ID获取楼宇成功:');
        console.log('📊 用户', userId, '拥有楼宇数量:', buildings.length);
        console.log('📋 楼宇列表:', buildings);

        if (buildings.length > 0) {
          buildings.forEach((building, index) => {
            console.log(`🏢 楼宇 ${index + 1}:`);
            console.log('  - ID:', building.id);
            console.log('  - 名称:', building.buildingName);
            console.log('  - 房东:', building.landlordName);
            console.log('  - 创建者ID:', building.createdBy);
          });
        } else {
          console.log('📝 用户', userId, '没有拥有的楼宇');
        }
      },
      error: (error) => {
        console.error('❌ 根据用户ID获取楼宇失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          url: error.url
        });
      }
    });
  }

  /**
   * 快速测试 - 只获取列表
   */
  static quickTest() {
    console.log('⚡ 快速测试 - 获取用户拥有的楼宇列表');
    this.testGetBuildingList();
  }
}

// 导出便捷的测试函数
export const testBuildingAPI = {
  // 获取用户拥有的楼宇列表
  getList: () => BuildingAPITester.testGetBuildingList(),

  // 根据用户ID获取楼宇
  getByUserId: (userId?: number) => BuildingAPITester.testGetBuildingsByUserId(userId),

  // 创建楼宇
  create: () => BuildingAPITester.testCreateBuilding(),

  // 更新楼宇
  update: () => BuildingAPITester.testUpdateBuilding(),

  // 删除楼宇
  delete: () => BuildingAPITester.testDeleteBuilding(),

  // 搜索楼宇
  search: (query?: string) => BuildingAPITester.testSearchBuildings(query),

  // 运行全部测试
  all: () => BuildingAPITester.runAllTests(),

  // 快速测试
  quick: () => BuildingAPITester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上，方便在控制台调用
if (__DEV__) {
  (global as any).testBuildingAPI = testBuildingAPI;
  console.log('🛠️ 开发模式：楼宇API测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testBuildingAPI.quick()           // 快速测试获取用户楼宇');
  console.log('  - testBuildingAPI.getList()         // 测试获取用户拥有的楼宇');
  console.log('  - testBuildingAPI.getByUserId(123)  // 测试根据用户ID获取楼宇');
  console.log('  - testBuildingAPI.create()          // 测试创建楼宇');
  console.log('  - testBuildingAPI.update()          // 测试更新楼宇');
  console.log('  - testBuildingAPI.delete()          // 测试删除楼宇');
  console.log('  - testBuildingAPI.search()          // 测试搜索楼宇');
  console.log('  - testBuildingAPI.all()             // 运行全部测试');
}
