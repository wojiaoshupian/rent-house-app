import TokenManager from './tokenManager';

/**
 * Token管理器测试工具
 */
export class TokenManagerTester {
  
  /**
   * 测试设置和获取token
   */
  static async testSetAndGetToken() {
    console.log('🧪 测试设置和获取Token...');
    
    try {
      // 设置一个测试token，有效期1小时
      const testToken = 'test_token_' + Date.now();
      await TokenManager.setToken(testToken, 1);
      console.log('✅ Token设置成功');
      
      // 获取token
      const retrievedToken = await TokenManager.getToken();
      console.log('✅ Token获取成功:', retrievedToken);
      
      // 验证token是否一致
      if (retrievedToken === testToken) {
        console.log('✅ Token验证成功');
      } else {
        console.log('❌ Token验证失败');
      }
      
      // 检查token有效性
      const isValid = await TokenManager.isTokenValid();
      console.log('✅ Token有效性:', isValid);
      
      // 获取剩余时间
      const remainingTime = await TokenManager.getTokenRemainingTime();
      console.log('✅ Token剩余时间:', remainingTime, '分钟');
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 测试过期token
   */
  static async testExpiredToken() {
    console.log('🧪 测试过期Token...');
    
    try {
      // 设置一个立即过期的token（0.001小时 = 3.6秒）
      const expiredToken = 'expired_token_' + Date.now();
      await TokenManager.setToken(expiredToken, 0.001);
      console.log('✅ 过期Token设置成功');
      
      // 等待token过期
      console.log('⏳ 等待token过期...');
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // 尝试获取过期的token
      const retrievedToken = await TokenManager.getToken();
      console.log('🔍 尝试获取过期token:', retrievedToken);
      
      if (retrievedToken === null) {
        console.log('✅ 过期token正确被清除');
      } else {
        console.log('❌ 过期token未被清除');
      }
      
      // 检查登录状态
      const isLoggedIn = await TokenManager.isUserLoggedIn();
      console.log('✅ 登录状态:', isLoggedIn);
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 测试用户状态管理
   */
  static async testUserState() {
    console.log('🧪 测试用户状态管理...');
    
    try {
      // 设置token
      const testToken = 'state_test_token_' + Date.now();
      await TokenManager.setToken(testToken, 1);
      
      // 检查用户状态
      let userState = await TokenManager.getUserState();
      console.log('✅ 用户状态:', userState);
      
      // 检查登录状态
      let isLoggedIn = await TokenManager.isUserLoggedIn();
      console.log('✅ 登录状态:', isLoggedIn);
      
      // 强制登出
      await TokenManager.forceLogout();
      console.log('✅ 强制登出完成');
      
      // 再次检查状态
      userState = await TokenManager.getUserState();
      console.log('✅ 登出后用户状态:', userState);
      
      isLoggedIn = await TokenManager.isUserLoggedIn();
      console.log('✅ 登出后登录状态:', isLoggedIn);
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 测试token信息获取
   */
  static async testTokenInfo() {
    console.log('🧪 测试Token信息获取...');
    
    try {
      // 设置token
      const testToken = 'info_test_token_' + Date.now();
      await TokenManager.setToken(testToken, 2); // 2小时有效期
      
      // 获取token信息
      const tokenInfo = await TokenManager.getTokenInfo();
      console.log('✅ Token信息:', tokenInfo);
      
      // 验证信息完整性
      if (tokenInfo.hasToken && tokenInfo.isValid && tokenInfo.remainingMinutes > 0) {
        console.log('✅ Token信息验证成功');
      } else {
        console.log('❌ Token信息验证失败');
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 运行所有测试
   */
  static async runAllTests() {
    console.log('🚀 开始运行Token管理器全套测试...');
    console.log('='.repeat(50));
    
    // 1. 基本功能测试
    await this.testSetAndGetToken();
    console.log('\n' + '='.repeat(50));
    
    // 2. 过期token测试
    await this.testExpiredToken();
    console.log('\n' + '='.repeat(50));
    
    // 3. 用户状态测试
    await this.testUserState();
    console.log('\n' + '='.repeat(50));
    
    // 4. token信息测试
    await this.testTokenInfo();
    console.log('\n' + '='.repeat(50));
    
    console.log('🎉 所有测试完成！');
  }

  /**
   * 快速测试
   */
  static async quickTest() {
    console.log('⚡ 快速测试Token管理器...');
    
    try {
      // 获取当前状态
      const tokenInfo = await TokenManager.getTokenInfo();
      const isLoggedIn = await TokenManager.isUserLoggedIn();
      const userState = await TokenManager.getUserState();
      
      console.log('📊 当前状态:');
      console.log('  Token信息:', tokenInfo);
      console.log('  登录状态:', isLoggedIn);
      console.log('  用户状态:', userState);
      
    } catch (error) {
      console.error('❌ 快速测试失败:', error);
    }
  }

  /**
   * 清理测试数据
   */
  static async cleanup() {
    console.log('🧹 清理测试数据...');
    
    try {
      await TokenManager.forceLogout();
      console.log('✅ 测试数据清理完成');
    } catch (error) {
      console.error('❌ 清理失败:', error);
    }
  }
}

// 导出便捷的测试函数
export const testTokenManager = {
  // 基本测试
  basic: () => TokenManagerTester.testSetAndGetToken(),
  
  // 过期测试
  expired: () => TokenManagerTester.testExpiredToken(),
  
  // 状态测试
  state: () => TokenManagerTester.testUserState(),
  
  // 信息测试
  info: () => TokenManagerTester.testTokenInfo(),
  
  // 运行全部测试
  all: () => TokenManagerTester.runAllTests(),
  
  // 快速测试
  quick: () => TokenManagerTester.quickTest(),
  
  // 清理
  cleanup: () => TokenManagerTester.cleanup()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testTokenManager = testTokenManager;
  console.log('🛠️ 开发模式：Token管理器测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testTokenManager.quick()    // 快速测试当前状态');
  console.log('  - testTokenManager.basic()    // 测试基本功能');
  console.log('  - testTokenManager.expired()  // 测试过期处理');
  console.log('  - testTokenManager.state()    // 测试状态管理');
  console.log('  - testTokenManager.info()     // 测试信息获取');
  console.log('  - testTokenManager.all()      // 运行全部测试');
  console.log('  - testTokenManager.cleanup()  // 清理测试数据');
}
