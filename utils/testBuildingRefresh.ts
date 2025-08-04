import { buildingService } from '../services/buildingService';
import { CreateBuildingRequest } from '../types/building';

/**
 * 楼宇刷新功能测试工具
 */
export class BuildingRefreshTester {
  
  /**
   * 测试删除后的数据刷新
   */
  static async testDeleteAndRefresh() {
    console.log('🧪 测试删除楼宇后的数据刷新...');
    
    try {
      // 1. 先获取当前楼宇列表
      console.log('1️⃣ 获取当前楼宇列表...');
      
      buildingService.getBuildingList().subscribe({
        next: (initialBuildings) => {
          console.log('📊 当前楼宇数量:', initialBuildings.length);
          
          if (initialBuildings.length === 0) {
            console.log('⚠️ 没有楼宇可以删除，先创建一个测试楼宇');
            this.createTestBuildingForDeletion();
            return;
          }
          
          // 2. 选择第一个楼宇进行删除
          const buildingToDelete = initialBuildings[0];
          console.log('🎯 选择删除楼宇:', buildingToDelete.buildingName, 'ID:', buildingToDelete.id);
          
          // 3. 执行删除操作
          console.log('2️⃣ 执行删除操作...');
          buildingService.deleteBuilding(buildingToDelete.id).subscribe({
            next: () => {
              console.log('✅ 删除成功');
              
              // 4. 立即重新获取列表验证删除结果
              console.log('3️⃣ 验证删除结果，重新获取列表...');
              setTimeout(() => {
                buildingService.getBuildingList().subscribe({
                  next: (updatedBuildings) => {
                    console.log('📊 删除后楼宇数量:', updatedBuildings.length);
                    
                    const isDeleted = !updatedBuildings.find(b => b.id === buildingToDelete.id);
                    if (isDeleted) {
                      console.log('✅ 删除验证成功：楼宇已从列表中移除');
                      console.log('📈 数量变化:', initialBuildings.length, '→', updatedBuildings.length);
                    } else {
                      console.log('❌ 删除验证失败：楼宇仍在列表中');
                    }
                  },
                  error: (error) => {
                    console.error('❌ 验证删除结果时获取列表失败:', error);
                  }
                });
              }, 1000);
            },
            error: (error) => {
              console.error('❌ 删除楼宇失败:', error);
            }
          });
        },
        error: (error) => {
          console.error('❌ 获取初始楼宇列表失败:', error);
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 创建测试楼宇用于删除测试
   */
  static createTestBuildingForDeletion() {
    console.log('🏗️ 创建测试楼宇用于删除测试...');
    
    const testBuilding: CreateBuildingRequest = {
      buildingName: `删除测试楼宇_${Date.now()}`,
      landlordName: '测试房东',
      electricityUnitPrice: 1.0,
      waterUnitPrice: 2.0,
      rentCollectionMethod: 'FIXED_MONTH_START'
    };
    
    buildingService.createBuilding(testBuilding).subscribe({
      next: (createdBuilding) => {
        console.log('✅ 测试楼宇创建成功:', createdBuilding.buildingName);
        console.log('🔄 等待2秒后开始删除测试...');
        
        setTimeout(() => {
          this.testDeleteAndRefresh();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ 创建测试楼宇失败:', error);
      }
    });
  }

  /**
   * 测试更新后的数据刷新
   */
  static async testUpdateAndRefresh() {
    console.log('🧪 测试更新楼宇后的数据刷新...');
    
    try {
      // 1. 获取楼宇列表
      buildingService.getBuildingList().subscribe({
        next: (buildings) => {
          if (buildings.length === 0) {
            console.log('⚠️ 没有楼宇可以更新');
            return;
          }
          
          const buildingToUpdate = buildings[0];
          console.log('🎯 选择更新楼宇:', buildingToUpdate.buildingName);
          
          // 2. 准备更新数据
          const updateData = {
            id: buildingToUpdate.id,
            buildingName: `${buildingToUpdate.buildingName}_已更新_${Date.now()}`,
            landlordName: buildingToUpdate.landlordName,
            electricityUnitPrice: buildingToUpdate.electricityUnitPrice + 0.1,
            waterUnitPrice: buildingToUpdate.waterUnitPrice + 0.1,
            hotWaterUnitPrice: buildingToUpdate.hotWaterUnitPrice,
            rentCollectionMethod: buildingToUpdate.rentCollectionMethod
          };
          
          console.log('🔄 执行更新操作...');
          
          // 3. 执行更新
          buildingService.updateBuilding(updateData).subscribe({
            next: (updatedBuilding) => {
              console.log('✅ 更新成功:', updatedBuilding.buildingName);
              
              // 4. 验证更新结果
              setTimeout(() => {
                console.log('🔍 验证更新结果...');
                buildingService.getBuildingList().subscribe({
                  next: (refreshedBuildings) => {
                    const updatedInList = refreshedBuildings.find(b => b.id === updatedBuilding.id);
                    if (updatedInList && updatedInList.buildingName === updatedBuilding.buildingName) {
                      console.log('✅ 更新验证成功：列表中的数据已更新');
                      console.log('📝 新名称:', updatedInList.buildingName);
                      console.log('⚡ 新电费:', updatedInList.electricityUnitPrice);
                    } else {
                      console.log('❌ 更新验证失败：列表中的数据未更新');
                    }
                  },
                  error: (error) => {
                    console.error('❌ 验证更新结果时获取列表失败:', error);
                  }
                });
              }, 1000);
            },
            error: (error) => {
              console.error('❌ 更新楼宇失败:', error);
            }
          });
        },
        error: (error) => {
          console.error('❌ 获取楼宇列表失败:', error);
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 测试列表刷新功能
   */
  static async testListRefresh() {
    console.log('🧪 测试楼宇列表刷新功能...');
    
    try {
      console.log('1️⃣ 第一次获取楼宇列表...');
      
      buildingService.getBuildingList().subscribe({
        next: (firstList) => {
          console.log('📊 第一次获取数量:', firstList.length);
          
          console.log('2️⃣ 等待2秒后再次获取...');
          setTimeout(() => {
            buildingService.getBuildingList().subscribe({
              next: (secondList) => {
                console.log('📊 第二次获取数量:', secondList.length);
                
                if (firstList.length === secondList.length) {
                  console.log('✅ 列表刷新正常：数量一致');
                  
                  // 比较列表内容
                  const firstIds = firstList.map(b => b.id).sort();
                  const secondIds = secondList.map(b => b.id).sort();
                  const idsMatch = JSON.stringify(firstIds) === JSON.stringify(secondIds);
                  
                  if (idsMatch) {
                    console.log('✅ 列表内容一致：刷新功能正常');
                  } else {
                    console.log('⚠️ 列表内容不一致：可能有数据变化');
                  }
                } else {
                  console.log('⚠️ 列表数量不一致：可能有数据变化');
                  console.log('📈 数量变化:', firstList.length, '→', secondList.length);
                }
              },
              error: (error) => {
                console.error('❌ 第二次获取列表失败:', error);
              }
            });
          }, 2000);
        },
        error: (error) => {
          console.error('❌ 第一次获取列表失败:', error);
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 运行所有刷新测试
   */
  static async runAllRefreshTests() {
    console.log('🚀 开始运行楼宇刷新功能全套测试...');
    console.log('='.repeat(60));
    
    // 1. 测试列表刷新
    await this.testListRefresh();
    
    // 2. 延迟测试更新刷新
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      this.testUpdateAndRefresh();
    }, 5000);
    
    // 3. 延迟测试删除刷新
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      this.testDeleteAndRefresh();
    }, 10000);
    
    console.log('\n🎉 所有刷新测试已启动，请查看后续日志');
  }
}

// 导出便捷的测试函数
export const testBuildingRefresh = {
  // 测试删除刷新
  delete: () => BuildingRefreshTester.testDeleteAndRefresh(),
  
  // 测试更新刷新
  update: () => BuildingRefreshTester.testUpdateAndRefresh(),
  
  // 测试列表刷新
  list: () => BuildingRefreshTester.testListRefresh(),
  
  // 运行全部测试
  all: () => BuildingRefreshTester.runAllRefreshTests()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testBuildingRefresh = testBuildingRefresh;
  console.log('🛠️ 开发模式：楼宇刷新测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testBuildingRefresh.delete()  // 测试删除后刷新');
  console.log('  - testBuildingRefresh.update()  // 测试更新后刷新');
  console.log('  - testBuildingRefresh.list()    // 测试列表刷新');
  console.log('  - testBuildingRefresh.all()     // 运行全部测试');
}
