import TokenManager from './tokenManager';
import { userService } from '../services/userService';

/**
 * 后端Token过期时间接入测试工具
 */
export class BackendTokenExpiryTester {
  
  /**
   * 测试后端过期时间的设置
   */
  static async testBackendExpiryTime() {
    console.log('🧪 测试后端Token过期时间接入...');
    
    try {
      // 模拟后端返回的过期时间（1小时后）
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const testToken = 'backend_expiry_test_token_' + Date.now();
      
      console.log('📅 模拟后端返回的过期时间:', futureTime);
      
      // 使用后端过期时间设置token
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      // 获取token信息验证
      const tokenInfo = await TokenManager.getTokenInfo();
      console.log('✅ Token信息验证:', tokenInfo);
      
      // 验证过期时间是否正确
      const expectedExpiry = new Date(futureTime).getTime();
      const actualExpiry = new Date(tokenInfo.expiryTime || '').getTime();
      
      if (Math.abs(expectedExpiry - actualExpiry) < 1000) { // 允许1秒误差
        console.log('✅ 后端过期时间设置正确');
      } else {
        console.log('❌ 后端过期时间设置错误');
        console.log('  期望:', new Date(expectedExpiry).toLocaleString());
        console.log('  实际:', new Date(actualExpiry).toLocaleString());
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 测试没有后端过期时间的情况
   */
  static async testNoBackendExpiryTime() {
    console.log('🧪 测试无后端过期时间的情况...');
    
    try {
      const testToken = 'no_expiry_test_token_' + Date.now();
      
      // 不提供过期时间
      await TokenManager.setTokenWithBackendExpiry(testToken);
      
      // 获取token信息
      const tokenInfo = await TokenManager.getTokenInfo();
      console.log('✅ Token信息（无后端过期时间）:', tokenInfo);
      
      // 验证是否使用了默认24小时
      const now = Date.now();
      const expectedExpiry = now + (24 * 60 * 60 * 1000);
      const actualExpiry = new Date(tokenInfo.expiryTime || '').getTime();
      const diffHours = Math.abs(expectedExpiry - actualExpiry) / (60 * 60 * 1000);
      
      if (diffHours < 0.1) { // 允许6分钟误差
        console.log('✅ 默认24小时过期时间设置正确');
      } else {
        console.log('❌ 默认过期时间设置错误，差异:', diffHours, '小时');
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  /**
   * 测试过期时间格式解析
   */
  static async testExpiryTimeFormats() {
    console.log('🧪 测试不同过期时间格式...');
    
    const testFormats = [
      // ISO 8601格式
      new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      // 简单日期格式
      new Date(Date.now() + 2 * 60 * 60 * 1000).toString(),
      // 时间戳字符串
      (Date.now() + 3 * 60 * 60 * 1000).toString(),
    ];

    for (let i = 0; i < testFormats.length; i++) {
      const format = testFormats[i];
      const testToken = `format_test_token_${i}_${Date.now()}`;
      
      try {
        console.log(`📅 测试格式 ${i + 1}:`, format);
        await TokenManager.setTokenWithBackendExpiry(testToken, format);
        
        const tokenInfo = await TokenManager.getTokenInfo();
        console.log(`✅ 格式 ${i + 1} 解析成功:`, tokenInfo.expiryTime);
        
      } catch (error) {
        console.error(`❌ 格式 ${i + 1} 解析失败:`, error);
      }
    }
  }

  /**
   * 测试登录接口的过期时间接入
   */
  static async testLoginWithBackendExpiry() {
    console.log('🧪 测试登录接口的后端过期时间接入...');
    console.log('⚠️ 注意：这需要真实的后端服务器支持');
    
    try {
      // 这里需要真实的登录凭据进行测试
      // 实际使用时需要替换为有效的测试账号
      const testLoginData = {
        username: 'test_user',
        password: 'test_password'
      };
      
      console.log('🔐 尝试登录以测试后端过期时间...');
      console.log('📝 登录数据:', testLoginData);
      console.log('💡 提示：请确保后端服务器正在运行并返回tokenExpiresAt字段');
      
      // 注意：这个测试需要真实的后端服务器
      // userService.login(testLoginData).subscribe({
      //   next: (loginResponse) => {
      //     console.log('✅ 登录成功，检查过期时间:', loginResponse.tokenExpiresAt);
      //     // 验证token是否正确设置
      //     TokenManager.getTokenInfo().then(info => {
      //       console.log('✅ Token信息:', info);
      //     });
      //   },
      //   error: (error) => {
      //     console.error('❌ 登录测试失败:', error);
      //   }
      // });
      
    } catch (error) {
      console.error('❌ 登录测试失败:', error);
    }
  }

  /**
   * 运行所有测试
   */
  static async runAllTests() {
    console.log('🚀 开始运行后端Token过期时间接入测试...');
    console.log('='.repeat(60));
    
    // 1. 测试后端过期时间设置
    await this.testBackendExpiryTime();
    console.log('\n' + '='.repeat(60));
    
    // 2. 测试无后端过期时间情况
    await this.testNoBackendExpiryTime();
    console.log('\n' + '='.repeat(60));
    
    // 3. 测试不同格式
    await this.testExpiryTimeFormats();
    console.log('\n' + '='.repeat(60));
    
    // 4. 测试登录接口
    await this.testLoginWithBackendExpiry();
    console.log('\n' + '='.repeat(60));
    
    console.log('🎉 所有后端过期时间测试完成！');
  }

  /**
   * 快速测试当前状态
   */
  static async quickTest() {
    console.log('⚡ 快速测试后端Token过期时间功能...');
    
    try {
      // 获取当前token信息
      const currentInfo = await TokenManager.getTokenInfo();
      console.log('📊 当前Token状态:', currentInfo);
      
      // 测试设置后端过期时间
      const futureTime = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30分钟后
      await TokenManager.setTokenWithBackendExpiry('quick_test_token', futureTime);
      
      const newInfo = await TokenManager.getTokenInfo();
      console.log('📊 设置后Token状态:', newInfo);
      
    } catch (error) {
      console.error('❌ 快速测试失败:', error);
    }
  }

  /**
   * 清理测试数据
   */
  static async cleanup() {
    console.log('🧹 清理后端过期时间测试数据...');
    
    try {
      await TokenManager.forceLogout();
      console.log('✅ 测试数据清理完成');
    } catch (error) {
      console.error('❌ 清理失败:', error);
    }
  }
}

// 导出便捷的测试函数
export const testBackendTokenExpiry = {
  // 后端过期时间测试
  backend: () => BackendTokenExpiryTester.testBackendExpiryTime(),
  
  // 无过期时间测试
  noExpiry: () => BackendTokenExpiryTester.testNoBackendExpiryTime(),
  
  // 格式测试
  formats: () => BackendTokenExpiryTester.testExpiryTimeFormats(),
  
  // 登录测试
  login: () => BackendTokenExpiryTester.testLoginWithBackendExpiry(),
  
  // 运行全部测试
  all: () => BackendTokenExpiryTester.runAllTests(),
  
  // 快速测试
  quick: () => BackendTokenExpiryTester.quickTest(),
  
  // 清理
  cleanup: () => BackendTokenExpiryTester.cleanup()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testBackendTokenExpiry = testBackendTokenExpiry;
  console.log('🛠️ 开发模式：后端Token过期时间测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testBackendTokenExpiry.quick()    // 快速测试');
  console.log('  - testBackendTokenExpiry.backend()  // 测试后端过期时间');
  console.log('  - testBackendTokenExpiry.noExpiry() // 测试无过期时间');
  console.log('  - testBackendTokenExpiry.formats()  // 测试不同格式');
  console.log('  - testBackendTokenExpiry.login()    // 测试登录接口');
  console.log('  - testBackendTokenExpiry.all()      // 运行全部测试');
  console.log('  - testBackendTokenExpiry.cleanup()  // 清理测试数据');
}
