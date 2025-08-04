import TokenManager from './tokenManager';

/**
 * Token状态更新延迟测试工具
 */
export class TokenDelayTester {
  
  /**
   * 测试Token设置后的状态更新延迟
   */
  static async testTokenSetDelay() {
    console.log('🧪 测试Token设置后的状态更新延迟...');
    
    try {
      // 记录开始时间
      const startTime = Date.now();
      console.log('⏰ 开始时间:', new Date(startTime).toLocaleTimeString());
      
      // 设置一个测试Token
      const testToken = 'delay_test_token_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1小时后过期
      
      console.log('🔑 设置测试Token...');
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      const setTime = Date.now();
      console.log('✅ Token设置完成，耗时:', setTime - startTime, 'ms');
      
      // 立即检查Token状态
      console.log('🔍 立即检查Token状态...');
      const immediateInfo = await TokenManager.getTokenInfo();
      const immediateCheckTime = Date.now();
      
      console.log('📊 立即检查结果:');
      console.log('  - 有Token:', immediateInfo.hasToken);
      console.log('  - Token有效:', immediateInfo.isValid);
      console.log('  - 剩余时间:', immediateInfo.remainingMinutes, '分钟');
      console.log('  - 检查耗时:', immediateCheckTime - setTime, 'ms');
      
      // 延迟检查Token状态
      console.log('⏳ 1秒后再次检查Token状态...');
      setTimeout(async () => {
        const delayedInfo = await TokenManager.getTokenInfo();
        const delayedCheckTime = Date.now();
        
        console.log('📊 延迟检查结果:');
        console.log('  - 有Token:', delayedInfo.hasToken);
        console.log('  - Token有效:', delayedInfo.isValid);
        console.log('  - 剩余时间:', delayedInfo.remainingMinutes, '分钟');
        console.log('  - 总耗时:', delayedCheckTime - startTime, 'ms');
        
        // 比较两次检查结果
        if (immediateInfo.hasToken === delayedInfo.hasToken && 
            immediateInfo.isValid === delayedInfo.isValid) {
          console.log('✅ Token状态一致，无延迟问题');
        } else {
          console.log('❌ Token状态不一致，存在延迟问题');
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ 测试Token设置延迟失败:', error);
    }
  }

  /**
   * 测试Token删除后的状态更新延迟
   */
  static async testTokenRemoveDelay() {
    console.log('🧪 测试Token删除后的状态更新延迟...');
    
    try {
      // 先设置一个Token
      const testToken = 'remove_delay_test_token_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      console.log('🔑 先设置一个测试Token...');
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      // 确认Token已设置
      const beforeInfo = await TokenManager.getTokenInfo();
      console.log('📊 删除前Token状态:', beforeInfo.hasToken, beforeInfo.isValid);
      
      // 记录删除开始时间
      const startTime = Date.now();
      console.log('⏰ 开始删除时间:', new Date(startTime).toLocaleTimeString());
      
      // 删除Token
      console.log('🗑️ 删除Token...');
      await TokenManager.removeToken();
      
      const removeTime = Date.now();
      console.log('✅ Token删除完成，耗时:', removeTime - startTime, 'ms');
      
      // 立即检查Token状态
      console.log('🔍 立即检查Token状态...');
      const immediateInfo = await TokenManager.getTokenInfo();
      const immediateCheckTime = Date.now();
      
      console.log('📊 立即检查结果:');
      console.log('  - 有Token:', immediateInfo.hasToken);
      console.log('  - Token有效:', immediateInfo.isValid);
      console.log('  - 检查耗时:', immediateCheckTime - removeTime, 'ms');
      
      // 延迟检查Token状态
      console.log('⏳ 1秒后再次检查Token状态...');
      setTimeout(async () => {
        const delayedInfo = await TokenManager.getTokenInfo();
        const delayedCheckTime = Date.now();
        
        console.log('📊 延迟检查结果:');
        console.log('  - 有Token:', delayedInfo.hasToken);
        console.log('  - Token有效:', delayedInfo.isValid);
        console.log('  - 总耗时:', delayedCheckTime - startTime, 'ms');
        
        // 验证删除是否成功
        if (!immediateInfo.hasToken && !delayedInfo.hasToken) {
          console.log('✅ Token删除成功，无延迟问题');
        } else {
          console.log('❌ Token删除存在延迟问题');
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ 测试Token删除延迟失败:', error);
    }
  }

  /**
   * 测试Token状态监听器的响应速度
   */
  static async testTokenListenerDelay() {
    console.log('🧪 测试Token状态监听器的响应速度...');
    
    try {
      let listenerCallCount = 0;
      let firstCallTime = 0;
      let lastCallTime = 0;
      
      // 添加监听器
      const removeListener = TokenManager.addListener(() => {
        listenerCallCount++;
        const callTime = Date.now();
        
        if (listenerCallCount === 1) {
          firstCallTime = callTime;
          console.log('🔔 监听器首次调用，时间:', new Date(callTime).toLocaleTimeString());
        }
        
        lastCallTime = callTime;
        console.log(`🔔 监听器第${listenerCallCount}次调用`);
      });
      
      console.log('📡 已添加Token状态监听器');
      
      // 设置Token触发监听器
      const startTime = Date.now();
      console.log('⏰ 开始设置Token，时间:', new Date(startTime).toLocaleTimeString());
      
      const testToken = 'listener_delay_test_token_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      const setCompleteTime = Date.now();
      console.log('✅ Token设置完成，耗时:', setCompleteTime - startTime, 'ms');
      
      // 等待监听器响应
      setTimeout(() => {
        console.log('📊 监听器响应统计:');
        console.log('  - 调用次数:', listenerCallCount);
        
        if (listenerCallCount > 0) {
          console.log('  - 首次响应延迟:', firstCallTime - setCompleteTime, 'ms');
          console.log('  - 最后响应时间:', new Date(lastCallTime).toLocaleTimeString());
          
          if (firstCallTime - setCompleteTime < 100) {
            console.log('✅ 监听器响应速度良好（<100ms）');
          } else {
            console.log('⚠️ 监听器响应有延迟（>100ms）');
          }
        } else {
          console.log('❌ 监听器未响应');
        }
        
        // 清理监听器
        removeListener();
        console.log('🧹 已移除测试监听器');
      }, 2000);
      
    } catch (error) {
      console.error('❌ 测试监听器延迟失败:', error);
    }
  }

  /**
   * 测试多次快速Token操作的延迟
   */
  static async testRapidTokenOperations() {
    console.log('🧪 测试多次快速Token操作的延迟...');
    
    try {
      const operations = [];
      const startTime = Date.now();
      
      console.log('🚀 开始快速Token操作测试...');
      
      // 快速执行多个Token操作
      for (let i = 0; i < 5; i++) {
        const operationStart = Date.now();
        
        // 设置Token
        const testToken = `rapid_test_token_${i}_${Date.now()}`;
        const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        
        await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
        
        // 立即检查状态
        const tokenInfo = await TokenManager.getTokenInfo();
        
        const operationEnd = Date.now();
        const operationTime = operationEnd - operationStart;
        
        operations.push({
          index: i,
          token: testToken,
          hasToken: tokenInfo.hasToken,
          isValid: tokenInfo.isValid,
          duration: operationTime
        });
        
        console.log(`✅ 操作 ${i + 1} 完成，耗时: ${operationTime}ms`);
        
        // 短暂延迟避免过于频繁
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const totalTime = Date.now() - startTime;
      
      console.log('📊 快速操作测试结果:');
      console.log('  - 总操作数:', operations.length);
      console.log('  - 总耗时:', totalTime, 'ms');
      console.log('  - 平均耗时:', Math.round(totalTime / operations.length), 'ms');
      
      // 检查操作一致性
      const allSuccessful = operations.every(op => op.hasToken && op.isValid);
      if (allSuccessful) {
        console.log('✅ 所有快速操作都成功，无延迟问题');
      } else {
        console.log('❌ 部分快速操作失败，可能存在延迟问题');
        operations.forEach(op => {
          if (!op.hasToken || !op.isValid) {
            console.log(`  - 操作 ${op.index + 1} 失败:`, op);
          }
        });
      }
      
    } catch (error) {
      console.error('❌ 测试快速Token操作失败:', error);
    }
  }

  /**
   * 运行所有延迟测试
   */
  static async runAllDelayTests() {
    console.log('🚀 开始运行Token状态更新延迟全套测试...');
    console.log('='.repeat(60));
    
    // 1. 测试Token设置延迟
    await this.testTokenSetDelay();
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('\n' + '='.repeat(60));
    
    // 2. 测试Token删除延迟
    await this.testTokenRemoveDelay();
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('\n' + '='.repeat(60));
    
    // 3. 测试监听器延迟
    await this.testTokenListenerDelay();
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('\n' + '='.repeat(60));
    
    // 4. 测试快速操作延迟
    await this.testRapidTokenOperations();
    console.log('\n' + '='.repeat(60));
    
    console.log('🎉 所有Token延迟测试完成！');
  }

  /**
   * 快速测试当前Token状态更新速度
   */
  static async quickDelayTest() {
    console.log('⚡ 快速测试Token状态更新速度...');
    
    try {
      const startTime = Date.now();
      
      // 设置Token
      const testToken = 'quick_delay_test_' + Date.now();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      await TokenManager.setTokenWithBackendExpiry(testToken, futureTime);
      
      // 立即检查状态
      const tokenInfo = await TokenManager.getTokenInfo();
      
      const totalTime = Date.now() - startTime;
      
      console.log('📊 快速测试结果:');
      console.log('  - 总耗时:', totalTime, 'ms');
      console.log('  - Token状态:', tokenInfo.hasToken ? '✅ 有效' : '❌ 无效');
      
      if (totalTime < 100) {
        console.log('✅ Token状态更新速度良好（<100ms）');
      } else if (totalTime < 500) {
        console.log('⚠️ Token状态更新速度一般（100-500ms）');
      } else {
        console.log('❌ Token状态更新速度较慢（>500ms）');
      }
      
    } catch (error) {
      console.error('❌ 快速延迟测试失败:', error);
    }
  }
}

// 导出便捷的测试函数
export const testTokenDelay = {
  // 测试Token设置延迟
  set: () => TokenDelayTester.testTokenSetDelay(),
  
  // 测试Token删除延迟
  remove: () => TokenDelayTester.testTokenRemoveDelay(),
  
  // 测试监听器延迟
  listener: () => TokenDelayTester.testTokenListenerDelay(),
  
  // 测试快速操作延迟
  rapid: () => TokenDelayTester.testRapidTokenOperations(),
  
  // 运行全部测试
  all: () => TokenDelayTester.runAllDelayTests(),
  
  // 快速测试
  quick: () => TokenDelayTester.quickDelayTest()
};

// 在开发环境下，将测试函数挂载到全局对象上
if (__DEV__) {
  (global as any).testTokenDelay = testTokenDelay;
  console.log('🛠️ 开发模式：Token延迟测试工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - testTokenDelay.quick()    // 快速测试更新速度');
  console.log('  - testTokenDelay.set()      // 测试Token设置延迟');
  console.log('  - testTokenDelay.remove()   // 测试Token删除延迟');
  console.log('  - testTokenDelay.listener() // 测试监听器延迟');
  console.log('  - testTokenDelay.rapid()    // 测试快速操作延迟');
  console.log('  - testTokenDelay.all()      // 运行全部测试');
}
