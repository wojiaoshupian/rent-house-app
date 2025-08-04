import { AutoLoginService } from '../services/autoLoginService';
import TokenManager from './tokenManager';

/**
 * 自动登录功能测试工具
 */
export class AutoLoginTester {
  
  /**
   * 测试自动登录状态检查
   */
  static async testAutoLoginStatus() {
    console.log('🧪 测试自动登录状态检查...');
    
    try {
      const status = await AutoLoginService.checkAutoLoginStatus();
      
      console.log('📊 自动登录状态检查结果:');
      console.log('  - 可以自动登录:', status.canAutoLogin);
      console.log('  - 有有效Token:', status.hasValidToken);
      console.log('  - 需要刷新:', status.shouldRefresh);
      console.log('  - 剩余时间:', status.remainingMinutes, '分钟');
      console.log('  - 原因:', status.reason);
      
      if (status.canAutoLogin) {
        console.log('✅ 满足自动登录条件');
      } else {
        console.log('❌ 不满足自动登录条件:', status.reason);
      }
      
    } catch (error) {
      console.error('❌ 测试自动登录状态失败:', error);
    }
  }

  /**
   * 测试自动登录尝试
   */
  static async testAutoLoginAttempt() {
    console.log('🧪 测试自动登录尝试...');
    
    try {
      AutoLoginService.attemptAutoLogin().subscribe({
        next: (result) => {
          if (result) {
            console.log('✅ 自动登录成功:');
            console.log('  - 用户:', result.user.username);
            console.log('  - Token:', result.token ? '已获取' : '未获取');
            console.log('  - 过期时间:', result.tokenExpiresAt || '未指定');
          } else {
            console.log('ℹ️ 未执行自动登录（不满足条件）');
          }
        },
        error: (error) => {
          console.error('❌ 自动登录失败:', error);
        },
        complete: () => {
          console.log('🏁 自动登录测试完成');
        }
      });
    } catch (error) {
      console.error('❌ 测试自动登录尝试失败:', error);
    }
  }

  /**
   * 测试Token刷新功能
   */
  static async testTokenRefresh() {
    console.log('🧪 测试Token刷新功能...');
    
    try {
      // 首先检查当前Token状态
      const tokenInfo = await TokenManager.getTokenInfo();
      console.log('📊 当前Token状态:', tokenInfo);
      
      if (!tokenInfo.hasToken) {
        console.log('⚠️ 没有Token，无法测试刷新功能');
        return;
      }
      
      console.log('🔄 尝试强制刷新Token...');
      
      AutoLoginService.forceRefreshToken().subscribe({
        next: (refreshResult) => {
          console.log('✅ Token刷新成功:');
          console.log('  - 用户:', refreshResult.user.username);
          console.log('  - 新Token:', refreshResult.token ? '已获取' : '未获取');
          console.log('  - 新过期时间:', refreshResult.tokenExpiresAt || '未指定');
          
          // 验证新Token状态
          setTimeout(async () => {
            const newTokenInfo = await TokenManager.getTokenInfo();
            console.log('📊 刷新后Token状态:', newTokenInfo);
          }, 1000);
        },
        error: (error) => {
          console.error('❌ Token刷新失败:', error);
          console.log('💡 这可能是因为:');
          console.log('  - 后端服务器不可用');
          console.log('  - 当前Token已完全过期');
          console.log('  - 刷新接口未实现');
        }
      });
    } catch (error) {
      console.error('❌ 测试Token刷新失败:', error);
    }
  }

  /**
   * 模拟Token即将过期的情况
   */
  static async testTokenNearExpiry() {
    console.log('🧪 模拟Token即将过期的情况...');
    
    try {
      // 创建一个即将过期的Token（5分钟后过期）
      const testToken = 'near_expiry_test_token_' + Date.now();
      const nearExpiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分钟后
      
      console.log('⏰ 设置即将过期的测试Token（5分钟后过期）');
      await TokenManager.setTokenWithBackendExpiry(testToken, nearExpiryTime);
      
      // 检查是否需要刷新
      const shouldRefresh = await TokenManager.shouldRefreshToken();
      console.log('🔍 是否需要刷新:', shouldRefresh);
      
      // 检查自动登录状态
      const status = await AutoLoginService.checkAutoLoginStatus();
      console.log('📊 自动登录状态:', status);
      
      if (status.shouldRefresh) {
        console.log('✅ 正确识别了需要刷新的Token');
      } else {
        console.log('❌ 未能正确识别需要刷新的Token');
      }
      
    } catch (error) {
      console.error('❌ 测试Token即将过期情况失败:', error);
    }
  }

  /**
   * 模拟Token已过期的情况
   */
  static async testTokenExpired() {
    console.log('🧪 模拟Token已过期的情况...');
    
    try {
      // 创建一个已过期的Token
      const testToken = 'expired_test_token_' + Date.now();
      const expiredTime = new Date(Date.now() - 60 * 1000).toISOString(); // 1分钟前过期
      
      console.log('⏰ 设置已过期的测试Token');
      await TokenManager.setTokenWithBackendExpiry(testToken, expiredTime);
      
      // 检查自动登录状态
      const status = await AutoLoginService.checkAutoLoginStatus();
      console.log('📊 自动登录状态:', status);
      
      if (!status.canAutoLogin && status.reason?.includes('过期')) {
        console.log('✅ 正确识别了过期的Token');
      } else {
        console.log('❌ 未能正确识别过期的Token');
      }
      
      // 尝试自动登录（应该失败）
      console.log('🔄 尝试使用过期Token自动登录...');
      AutoLoginService.attemptAutoLogin().subscribe({
        next: (result) => {
          if (result) {
            console.log('❌ 意外成功：过期Token竟然能自动登录');
          } else {
            console.log('✅ 正确行为：过期Token无法自动登录');
          }
        },
        error: (error) => {
          console.log('✅ 正确行为：过期Token自动登录失败');
        }
      });
      
    } catch (error) {
      console.error('❌ 测试Token过期情况失败:', error);
    }
  }

  /**
   * 测试应用启动时的自动登录流程
   */
  static async testAppStartupAutoLogin() {
    console.log('🧪 测试应用启动时的自动登录流程...');
    
    try {
      console.log('1️⃣ 检查当前Token状态...');
      const tokenInfo = await TokenManager.getTokenInfo();
      console.log('📊 Token状态:', tokenInfo);
      
      console.log('2️⃣ 检查自动登录条件...');
      const status = await AutoLoginService.checkAutoLoginStatus();
      console.log('📊 自动登录状态:', status);
      
      console.log('3️⃣ 尝试自动登录...');
      AutoLoginService.attemptAutoLogin().subscribe({
        next: (result) => {
          if (result) {
            console.log('✅ 应用启动自动登录成功');
            console.log('👤 用户:', result.user.username);
            console.log('🔑 Token状态: 已更新');
          } else {
            console.log('ℹ️ 应用启动未执行自动登录');
            console.log('💡 用户需要手动登录');
          }
        },
        error: (error) => {
          console.error('❌ 应用启动自动登录失败:', error);
          console.log('💡 这是正常情况，用户需要手动登录');
        },
        complete: () => {
          console.log('🏁 应用启动自动登录流程完成');
        }
      });
      
    } catch (error) {
      console.error('❌ 测试应用启动自动登录失败:', error);
    }
  }

  /**
   * 运行所有自动登录测试
   */
  static async runAllTests() {
    console.log('🚀 开始运行自动登录全套测试...');
    console.log('='.repeat(60));
    
    // 1. 测试状态检查
    await this.testAutoLoginStatus();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 2. 测试自动登录尝试
    await this.testAutoLoginAttempt();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 3. 测试Token即将过期
    await this.testTokenNearExpiry();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 4. 测试Token已过期
    await this.testTokenExpired();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n' + '='.repeat(60));
    
    // 5. 测试应用启动流程
    await this.testAppStartupAutoLogin();
    console.log('\n' + '='.repeat(60));
    
    console.log('🎉 所有自动登录测试完成！');
  }

  /**
   * 快速测试当前自动登录状态
   */
  static async quickTest() {
    console.log('⚡ 快速测试当前自动登录状态...');
    
    try {
      const status = await AutoLoginService.checkAutoLoginStatus();
      console.log('📊 当前状态:', status);
      
      if (status.canAutoLogin) {
        console.log('✅ 可以自动登录');
        console.log('💡 建议：应用启动时会自动登录');
      } else {
        console.log('❌ 无法自动登录:', status.reason);
        console.log('💡 建议：用户需要手动登录');
      }
      
    } catch (error) {
      console.error('❌ 快速测试失败:', error);
    }
  }
}

// 导出便捷的测试函数
export const testAutoLogin = {
  // 测试状态检查
  status: () => AutoLoginTester.testAutoLoginStatus(),
  
  // 测试自动登录尝试
  attempt: () => AutoLoginTester.testAutoLoginAttempt(),
  
  // 测试Token刷新
  refresh: () => AutoLoginTester.testTokenRefresh(),
  
  // 测试即将过期
  nearExpiry: () => AutoLoginTester.testTokenNearExpiry(),
  
  // 测试已过期
  expired: () => AutoLoginTester.testTokenExpired(),
  
  // 测试应用启动
  startup: () => AutoLoginTester.testAppStartupAutoLogin(),
  
  // 运行全部测试
  all: () => AutoLoginTester.runAllTests(),
  
  // 快速测试
  quick: () => AutoLoginTester.quickTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testAutoLogin = testAutoLogin;
  console.log('🛠️ 开发模式：自动登录测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testAutoLogin.quick()      // 快速测试当前状态');
  console.log('  - testAutoLogin.status()     // 测试状态检查');
  console.log('  - testAutoLogin.attempt()    // 测试自动登录尝试');
  console.log('  - testAutoLogin.refresh()    // 测试Token刷新');
  console.log('  - testAutoLogin.nearExpiry() // 测试即将过期');
  console.log('  - testAutoLogin.expired()    // 测试已过期');
  console.log('  - testAutoLogin.startup()    // 测试应用启动');
  console.log('  - testAutoLogin.all()        // 运行全部测试');
}
