import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { userService, User, LoginResponse } from './userService';
import TokenManager from '../utils/tokenManager';

/**
 * 自动登录服务
 * 负责应用启动时的自动登录和Token刷新
 */
export class AutoLoginService {
  
  /**
   * 尝试自动登录
   * @returns Observable<LoginResponse | null> 登录结果或null（如果不需要自动登录）
   */
  static attemptAutoLogin(): Observable<LoginResponse | null> {
    console.log('🔄 开始尝试自动登录...');
    
    return new Observable(subscriber => {
      this.checkAutoLoginEligibility().then(canAutoLogin => {
        if (!canAutoLogin) {
          console.log('❌ 不满足自动登录条件');
          subscriber.next(null);
          subscriber.complete();
          return;
        }
        
        console.log('✅ 满足自动登录条件，开始执行...');
        
        // 执行自动登录
        this.performAutoLogin().subscribe({
          next: (result) => {
            subscriber.next(result);
            subscriber.complete();
          },
          error: (error) => {
            console.error('❌ 自动登录失败:', error);
            subscriber.next(null);
            subscriber.complete();
          }
        });
      }).catch(error => {
        console.error('❌ 检查自动登录条件失败:', error);
        subscriber.next(null);
        subscriber.complete();
      });
    });
  }

  /**
   * 检查是否满足自动登录条件
   */
  private static async checkAutoLoginEligibility(): Promise<boolean> {
    try {
      // 1. 检查是否有有效的Token
      const hasValidToken = await TokenManager.hasValidTokenForAutoLogin();
      if (!hasValidToken) {
        console.log('📝 自动登录检查：没有有效的Token');
        return false;
      }

      // 2. 检查Token是否需要刷新
      const shouldRefresh = await TokenManager.shouldRefreshToken();
      const remainingMinutes = await TokenManager.getTokenRemainingMinutes();
      
      console.log('📊 Token状态检查:');
      console.log('  - 有效Token:', hasValidToken);
      console.log('  - 需要刷新:', shouldRefresh);
      console.log('  - 剩余时间:', remainingMinutes, '分钟');

      // 如果Token有效且不需要刷新，可以直接使用
      if (hasValidToken && !shouldRefresh) {
        console.log('✅ Token状态良好，可以直接使用');
        return true;
      }

      // 如果Token需要刷新，也可以尝试自动登录
      if (hasValidToken && shouldRefresh) {
        console.log('⚠️ Token即将过期，需要刷新');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ 检查自动登录条件时发生错误:', error);
      return false;
    }
  }

  /**
   * 执行自动登录
   */
  private static performAutoLogin(): Observable<LoginResponse> {
    return new Observable(subscriber => {
      TokenManager.shouldRefreshToken().then(shouldRefresh => {
        if (shouldRefresh) {
          console.log('🔄 Token需要刷新，调用刷新接口...');
          
          // 需要刷新Token
          userService.refreshToken().subscribe({
            next: (refreshResult) => {
              console.log('✅ Token刷新成功');
              subscriber.next(refreshResult);
              subscriber.complete();
            },
            error: (error) => {
              console.error('❌ Token刷新失败:', error);
              // 刷新失败，尝试获取当前用户信息
              this.getCurrentUserInfo().subscribe({
                next: (userResult) => {
                  subscriber.next(userResult);
                  subscriber.complete();
                },
                error: (userError) => {
                  subscriber.error(userError);
                }
              });
            }
          });
        } else {
          console.log('🔑 Token状态良好，获取当前用户信息...');
          
          // Token状态良好，直接获取用户信息
          this.getCurrentUserInfo().subscribe({
            next: (userResult) => {
              subscriber.next(userResult);
              subscriber.complete();
            },
            error: (error) => {
              subscriber.error(error);
            }
          });
        }
      }).catch(error => {
        console.error('❌ 执行自动登录时发生错误:', error);
        subscriber.error(error);
      });
    });
  }

  /**
   * 获取当前用户信息
   */
  private static getCurrentUserInfo(): Observable<LoginResponse> {
    return userService.getCurrentUser().pipe(
      switchMap((user: User) => {
        console.log('✅ 获取当前用户信息成功:', user.username);
        
        // 构造LoginResponse格式
        return TokenManager.getToken().then(token => {
          const loginResponse: LoginResponse = {
            token: token || '',
            user: user
          };
          return loginResponse;
        });
      }),
      catchError((error) => {
        console.error('❌ 获取当前用户信息失败:', error);
        // 获取用户信息失败，可能Token已过期
        TokenManager.forceLogout();
        return throwError(error);
      })
    );
  }

  /**
   * 检查自动登录状态
   */
  static async checkAutoLoginStatus(): Promise<{
    canAutoLogin: boolean;
    hasValidToken: boolean;
    shouldRefresh: boolean;
    remainingMinutes: number;
    reason?: string;
  }> {
    try {
      const hasValidToken = await TokenManager.hasValidTokenForAutoLogin();
      const shouldRefresh = await TokenManager.shouldRefreshToken();
      const remainingMinutes = await TokenManager.getTokenRemainingMinutes();
      
      let canAutoLogin = false;
      let reason = '';
      
      if (!hasValidToken) {
        reason = '没有有效的Token';
      } else if (remainingMinutes <= 0) {
        reason = 'Token已过期';
      } else {
        canAutoLogin = true;
        reason = shouldRefresh ? 'Token需要刷新但可以自动登录' : 'Token状态良好';
      }
      
      return {
        canAutoLogin,
        hasValidToken,
        shouldRefresh,
        remainingMinutes,
        reason
      };
    } catch (error) {
      console.error('❌ 检查自动登录状态失败:', error);
      return {
        canAutoLogin: false,
        hasValidToken: false,
        shouldRefresh: false,
        remainingMinutes: 0,
        reason: '检查状态时发生错误'
      };
    }
  }

  /**
   * 强制刷新Token
   */
  static forceRefreshToken(): Observable<LoginResponse> {
    console.log('🔄 强制刷新Token...');
    
    return userService.refreshToken().pipe(
      catchError((error) => {
        console.error('❌ 强制刷新Token失败:', error);
        // 刷新失败，清除本地Token
        TokenManager.forceLogout();
        return throwError(error);
      })
    );
  }
}

// 导出便捷的自动登录函数
export const autoLogin = {
  // 尝试自动登录
  attempt: () => AutoLoginService.attemptAutoLogin(),
  
  // 检查自动登录状态
  checkStatus: () => AutoLoginService.checkAutoLoginStatus(),
  
  // 强制刷新Token
  forceRefresh: () => AutoLoginService.forceRefreshToken()
};

// 在开发环境下，将自动登录工具挂载到全局对象上
if (__DEV__) {
  (global as any).autoLogin = autoLogin;
  console.log('🛠️ 开发模式：自动登录工具已挂载到全局');
  console.log('💡 使用方法:');
  console.log('  - autoLogin.attempt()      // 尝试自动登录');
  console.log('  - autoLogin.checkStatus()  // 检查自动登录状态');
  console.log('  - autoLogin.forceRefresh() // 强制刷新Token');
}
