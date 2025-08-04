import TokenManager from './tokenManager';
import { Alert } from 'react-native';

/**
 * 认证守卫工具
 * 用于检查用户认证状态并阻止未授权操作
 */
export class AuthGuard {
  
  /**
   * 检查用户是否已认证
   * @returns Promise<boolean> 是否已认证
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const isLoggedIn = await TokenManager.isUserLoggedIn();
      const hasValidToken = await TokenManager.isTokenValid();
      
      return isLoggedIn && hasValidToken;
    } catch (error) {
      console.error('❌ 认证状态检查失败:', error);
      return false;
    }
  }

  /**
   * 要求用户认证，如果未认证则显示提示
   * @param action 操作名称，用于错误提示
   * @returns Promise<boolean> 是否通过认证检查
   */
  static async requireAuth(action: string = '执行此操作'): Promise<boolean> {
    const isAuth = await this.isAuthenticated();
    
    if (!isAuth) {
      console.log(`🚫 用户未认证，无法${action}`);
      Alert.alert(
        '需要登录',
        `请先登录后再${action}`,
        [
          { text: '取消', style: 'cancel' },
          { text: '去登录', onPress: () => this.redirectToLogin() }
        ]
      );
      return false;
    }
    
    return true;
  }

  /**
   * 检查并执行需要认证的操作
   * @param operation 需要执行的操作
   * @param actionName 操作名称
   * @returns Promise<T | null> 操作结果或null（如果未认证）
   */
  static async withAuth<T>(
    operation: () => Promise<T>, 
    actionName: string = '执行操作'
  ): Promise<T | null> {
    const canProceed = await this.requireAuth(actionName);
    
    if (!canProceed) {
      return null;
    }
    
    try {
      return await operation();
    } catch (error: any) {
      // 如果是认证错误，清理状态
      if (error.response?.status === 401 || error.message?.includes('登录')) {
        await TokenManager.forceLogout();
        Alert.alert('登录已过期', '请重新登录后再试');
      }
      throw error;
    }
  }

  /**
   * 重定向到登录页面（这里只是示例，实际需要根据导航系统实现）
   */
  private static redirectToLogin() {
    console.log('🔄 重定向到登录页面');
    // 这里需要根据实际的导航系统来实现
    // 例如：navigation.navigate('Login');
  }

  /**
   * 获取认证状态详情
   */
  static async getAuthStatus(): Promise<{
    isAuthenticated: boolean;
    hasToken: boolean;
    tokenValid: boolean;
    userLoggedIn: boolean;
    tokenInfo?: any;
  }> {
    try {
      const hasToken = (await TokenManager.getToken()) !== null;
      const tokenValid = await TokenManager.isTokenValid();
      const userLoggedIn = await TokenManager.isUserLoggedIn();
      const tokenInfo = await TokenManager.getTokenInfo();
      
      return {
        isAuthenticated: hasToken && tokenValid && userLoggedIn,
        hasToken,
        tokenValid,
        userLoggedIn,
        tokenInfo
      };
    } catch (error) {
      console.error('❌ 获取认证状态失败:', error);
      return {
        isAuthenticated: false,
        hasToken: false,
        tokenValid: false,
        userLoggedIn: false
      };
    }
  }

  /**
   * 清理认证状态
   */
  static async clearAuth(): Promise<void> {
    try {
      await TokenManager.forceLogout();
      console.log('🧹 认证状态已清理');
    } catch (error) {
      console.error('❌ 清理认证状态失败:', error);
    }
  }
}

/**
 * 认证装饰器函数
 * 用于包装需要认证的函数
 */
export function requireAuth(actionName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const canProceed = await AuthGuard.requireAuth(actionName || propertyKey);
      
      if (!canProceed) {
        return null;
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// 导出便捷的认证检查函数
export const authGuard = {
  // 检查是否已认证
  check: () => AuthGuard.isAuthenticated(),
  
  // 要求认证
  require: (action?: string) => AuthGuard.requireAuth(action),
  
  // 带认证的操作
  withAuth: <T>(operation: () => Promise<T>, actionName?: string) => 
    AuthGuard.withAuth(operation, actionName),
  
  // 获取状态
  status: () => AuthGuard.getAuthStatus(),
  
  // 清理认证
  clear: () => AuthGuard.clearAuth()
};

// 在开发环境下，将认证工具挂载到全局对象上
if (__DEV__) {
  (global as any).authGuard = authGuard;
  console.log('🛠️ 开发模式：认证守卫工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - authGuard.check()           // 检查认证状态');
  console.log('  - authGuard.require("操作")   // 要求认证');
  console.log('  - authGuard.status()          // 获取详细状态');
  console.log('  - authGuard.clear()           // 清理认证状态');
}
