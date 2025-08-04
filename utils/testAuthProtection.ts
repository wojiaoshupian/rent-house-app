import { buildingService } from '../services/buildingService';
import { AuthGuard } from './authGuard';
import TokenManager from './tokenManager';
import { CreateBuildingRequest } from '../types/building';

/**
 * 认证保护测试工具
 */
export class AuthProtectionTester {
  
  /**
   * 测试未登录状态下的API调用
   */
  static async testUnauthenticatedAccess() {
    console.log('🧪 测试未登录状态下的API调用...');
    
    try {
      // 确保用户已登出
      await TokenManager.forceLogout();
      console.log('🚪 已强制登出，清除所有认证信息');
      
      // 检查认证状态
      const authStatus = await AuthGuard.getAuthStatus();
      console.log('📊 当前认证状态:', authStatus);
      
      // 尝试创建楼宇（应该失败）
      const testBuilding: CreateBuildingRequest = {
        buildingName: `未授权测试楼宇_${Date.now()}`,
        landlordName: '测试房东',
        electricityUnitPrice: 1.0,
        waterUnitPrice: 2.0,
        rentCollectionMethod: 'FIXED_MONTH_START'
      };
      
      console.log('🏗️ 尝试在未登录状态下创建楼宇...');
      
      buildingService.createBuilding(testBuilding).subscribe({
        next: (building) => {
          console.error('❌ 测试失败：未登录状态下竟然创建成功了！');
          console.error('🏢 创建的楼宇:', building);
        },
        error: (error) => {
          console.log('✅ 测试成功：未登录状态下正确拒绝了请求');
          console.log('📝 错误信息:', error.message);
          console.log('🔒 这是预期的行为，说明认证保护正常工作');
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 测试已登录状态下的API调用
   */
  static async testAuthenticatedAccess() {
    console.log('🧪 测试已登录状态下的API调用...');
    
    try {
      // 设置一个测试token（模拟登录状态）
      const testToken = 'test_token_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1小时后过期
      
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      console.log('🔑 已设置测试Token，模拟登录状态');
      
      // 检查认证状态
      const authStatus = await AuthGuard.getAuthStatus();
      console.log('📊 当前认证状态:', authStatus);
      
      // 尝试创建楼宇
      const testBuilding: CreateBuildingRequest = {
        buildingName: `已授权测试楼宇_${Date.now()}`,
        landlordName: '测试房东',
        electricityUnitPrice: 1.0,
        waterUnitPrice: 2.0,
        rentCollectionMethod: 'FIXED_MONTH_START'
      };
      
      console.log('🏗️ 尝试在已登录状态下创建楼宇...');
      console.log('⚠️ 注意：这需要真实的后端服务器支持');
      
      buildingService.createBuilding(testBuilding).subscribe({
        next: (building) => {
          console.log('✅ 测试成功：已登录状态下成功创建楼宇');
          console.log('🏢 创建的楼宇:', building);
        },
        error: (error) => {
          console.log('📝 请求被拒绝，错误信息:', error.message);
          
          if (error.message.includes('登录') || error.message.includes('认证')) {
            console.log('🔒 这可能是因为Token无效或后端服务器不可用');
          } else {
            console.log('🌐 这可能是网络错误或后端服务器问题');
          }
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 测试Token过期后的API调用
   */
  static async testExpiredTokenAccess() {
    console.log('🧪 测试Token过期后的API调用...');
    
    try {
      // 设置一个已过期的token
      const expiredToken = 'expired_token_' + Date.now();
      const pastTime = new Date(Date.now() - 60 * 1000).toISOString(); // 1分钟前过期
      
      await TokenManager.setTokenWithBackendExpiry(expiredToken, pastTime);
      console.log('⏰ 已设置过期Token');
      
      // 检查认证状态
      const authStatus = await AuthGuard.getAuthStatus();
      console.log('📊 当前认证状态:', authStatus);
      
      // 尝试创建楼宇
      const testBuilding: CreateBuildingRequest = {
        buildingName: `过期Token测试楼宇_${Date.now()}`,
        landlordName: '测试房东',
        electricityUnitPrice: 1.0,
        waterUnitPrice: 2.0,
        rentCollectionMethod: 'FIXED_MONTH_START'
      };
      
      console.log('🏗️ 尝试使用过期Token创建楼宇...');
      
      buildingService.createBuilding(testBuilding).subscribe({
        next: (building) => {
          console.error('❌ 测试失败：过期Token竟然创建成功了！');
          console.error('🏢 创建的楼宇:', building);
        },
        error: (error) => {
          console.log('✅ 测试成功：过期Token正确被拒绝了');
          console.log('📝 错误信息:', error.message);
          console.log('🔒 这是预期的行为，说明过期检查正常工作');
        }
      });
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
    }
  }

  /**
   * 测试认证守卫功能
   */
  static async testAuthGuard() {
    console.log('🧪 测试认证守卫功能...');
    
    try {
      // 测试未认证状态
      await TokenManager.forceLogout();
      
      console.log('1️⃣ 测试未认证状态的守卫检查...');
      const isAuth1 = await AuthGuard.isAuthenticated();
      console.log('认证状态:', isAuth1);
      
      const canProceed1 = await AuthGuard.requireAuth('测试操作');
      console.log('是否允许操作:', canProceed1);
      
      // 测试已认证状态
      const testToken = 'guard_test_token_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      console.log('2️⃣ 测试已认证状态的守卫检查...');
      const isAuth2 = await AuthGuard.isAuthenticated();
      console.log('认证状态:', isAuth2);
      
      const canProceed2 = await AuthGuard.requireAuth('测试操作');
      console.log('是否允许操作:', canProceed2);
      
      // 测试详细状态
      console.log('3️⃣ 获取详细认证状态...');
      const detailStatus = await AuthGuard.getAuthStatus();
      console.log('详细状态:', detailStatus);
      
    } catch (error) {
      console.error('❌ 认证守卫测试失败:', error);
    }
  }

  /**
   * 运行所有测试
   */
  static async runAllTests() {
    console.log('🚀 开始运行认证保护全套测试...');
    console.log('='.repeat(60));
    
    // 1. 测试未登录访问
    await this.testUnauthenticatedAccess();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 2. 测试已登录访问
    await this.testAuthenticatedAccess();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 3. 测试过期Token访问
    await this.testExpiredTokenAccess();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 4. 测试认证守卫
    await this.testAuthGuard();
    console.log('\n' + '='.repeat(60));
    
    console.log('🎉 所有认证保护测试完成！');
  }

  /**
   * 快速测试当前认证状态
   */
  static async quickTest() {
    console.log('⚡ 快速测试当前认证保护状态...');
    
    try {
      const authStatus = await AuthGuard.getAuthStatus();
      console.log('📊 当前认证状态:', authStatus);
      
      if (authStatus.isAuthenticated) {
        console.log('✅ 用户已认证，可以执行需要认证的操作');
      } else {
        console.log('🚫 用户未认证，无法执行需要认证的操作');
        console.log('💡 建议：请先登录后再试');
      }
      
    } catch (error) {
      console.error('❌ 快速测试失败:', error);
    }
  }
}

// 导出便捷的测试函数
export const testAuthProtection = {
  // 测试未登录访问
  unauthenticated: () => AuthProtectionTester.testUnauthenticatedAccess(),
  
  // 测试已登录访问
  authenticated: () => AuthProtectionTester.testAuthenticatedAccess(),
  
  // 测试过期Token
  expired: () => AuthProtectionTester.testExpiredTokenAccess(),
  
  // 测试认证守卫
  guard: () => AuthProtectionTester.testAuthGuard(),
  
  // 运行全部测试
  all: () => AuthProtectionTester.runAllTests(),
  
  // 快速测试
  quick: () => AuthProtectionTester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testAuthProtection = testAuthProtection;
  console.log('🛠️ 开发模式：认证保护测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testAuthProtection.quick()          // 快速测试当前状态');
  console.log('  - testAuthProtection.unauthenticated() // 测试未登录访问');
  console.log('  - testAuthProtection.authenticated()   // 测试已登录访问');
  console.log('  - testAuthProtection.expired()         // 测试过期Token');
  console.log('  - testAuthProtection.guard()           // 测试认证守卫');
  console.log('  - testAuthProtection.all()             // 运行全部测试');
}
