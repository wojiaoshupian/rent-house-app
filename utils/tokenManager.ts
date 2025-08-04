import AsyncStorage from '@react-native-async-storage/async-storage';

// Token状态变化监听器类型
type TokenChangeListener = () => void;

// Token 管理类
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const USER_STATE_KEY = 'user_state';

interface TokenData {
  token: string;
  expiryTime: number;
  issuedAt: number;
}

interface UserState {
  isLoggedIn: boolean;
  lastActivity: number;
}

class TokenManager {
  // Token状态变化监听器列表
  private static listeners: TokenChangeListener[] = [];

  /**
   * 添加Token状态变化监听器
   */
  static addListener(listener: TokenChangeListener): () => void {
    this.listeners.push(listener);

    // 返回移除监听器的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 通知所有监听器Token状态已变化
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('❌ Token状态监听器执行失败:', error);
      }
    });
  }

  /**
   * 设置Token，同时记录过期时间
   * @param token JWT token
   * @param expiryHours token有效期（小时），默认24小时
   */
  static async setToken(token: string, expiryHours: number = 24): Promise<void> {
    try {
      const now = Date.now();
      const expiryTime = now + (expiryHours * 60 * 60 * 1000); // 转换为毫秒

      const tokenData: TokenData = {
        token,
        expiryTime,
        issuedAt: now
      };

      // 保存token数据
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));

      // 更新用户状态为已登录
      await this.setUserState({ isLoggedIn: true, lastActivity: now });

      console.log('✅ Token 设置成功');
      console.log('📅 过期时间:', new Date(expiryTime).toLocaleString());

      // 通知监听器Token状态已变化
      this.notifyListeners();
    } catch (error) {
      console.error('❌ 保存 token 失败:', error);
    }
  }

  /**
   * 设置Token（使用后端返回的过期时间）
   * @param token JWT token
   * @param tokenExpiresAt 后端返回的过期时间字符串（ISO格式）
   */
  static async setTokenWithBackendExpiry(token: string, tokenExpiresAt?: string): Promise<void> {
    try {
      const now = Date.now();
      let expiryTime: number;

      if (tokenExpiresAt) {
        // 使用后端返回的过期时间
        expiryTime = new Date(tokenExpiresAt).getTime();
        console.log('🔗 使用后端返回的过期时间:', tokenExpiresAt);
      } else {
        // 如果后端没有返回过期时间，使用默认24小时
        expiryTime = now + (24 * 60 * 60 * 1000);
        console.log('⚠️ 后端未返回过期时间，使用默认24小时');
      }

      const tokenData: TokenData = {
        token,
        expiryTime,
        issuedAt: now
      };

      // 保存token数据
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));

      // 更新用户状态为已登录
      await this.setUserState({ isLoggedIn: true, lastActivity: now });

      console.log('✅ Token 设置成功（后端过期时间）');
      console.log('📅 过期时间:', new Date(expiryTime).toLocaleString());
      console.log('⏱️ 剩余时间:', Math.round((expiryTime - now) / (60 * 1000)), '分钟');

      // 通知监听器Token状态已变化
      this.notifyListeners();
    } catch (error) {
      console.error('❌ 保存 token 失败:', error);
    }
  }

  /**
   * 获取Token，自动检查是否过期
   * @returns 有效的token或null
   */
  static async getToken(): Promise<string | null> {
    try {
      const tokenDataStr = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) {
        console.log('🔍 未找到保存的token');
        await this.handleNoToken();
        return null;
      }

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      const now = Date.now();

      // 检查token是否过期
      if (now > tokenData.expiryTime) {
        console.log('⏰ Token已过期，自动清除');
        await this.clearExpiredToken();
        return null;
      }

      // 更新最后活动时间
      await this.updateLastActivity();

      console.log('✅ Token有效，剩余时间:', Math.round((tokenData.expiryTime - now) / (60 * 1000)), '分钟');
      return tokenData.token;
    } catch (error) {
      console.error('❌ 获取 token 失败:', error);
      // 如果解析失败，可能是旧格式的token，清除它
      await this.removeToken();
      return null;
    }
  }

  /**
   * 手动移除Token
   */
  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
      await this.setUserState({ isLoggedIn: false, lastActivity: Date.now() });
      console.log('🗑️ Token已手动移除');

      // 通知监听器Token状态已变化
      this.notifyListeners();
    } catch (error) {
      console.error('❌ 删除 token 失败:', error);
    }
  }

  /**
   * 检查Token是否有效（不获取token内容）
   */
  static async isTokenValid(): Promise<boolean> {
    try {
      const tokenDataStr = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) return false;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      const now = Date.now();

      if (now > tokenData.expiryTime) {
        await this.clearExpiredToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ 检查token有效性失败:', error);
      return false;
    }
  }

  /**
   * 获取Token剩余有效时间（分钟）
   */
  static async getTokenRemainingTime(): Promise<number> {
    try {
      const tokenDataStr = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) return 0;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      const now = Date.now();
      const remainingMs = tokenData.expiryTime - now;

      return Math.max(0, Math.round(remainingMs / (60 * 1000)));
    } catch (error) {
      console.error('❌ 获取token剩余时间失败:', error);
      return 0;
    }
  }

  /**
   * 设置用户状态
   */
  private static async setUserState(state: UserState): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('❌ 设置用户状态失败:', error);
    }
  }

  /**
   * 获取用户状态
   */
  static async getUserState(): Promise<UserState | null> {
    try {
      const stateStr = await AsyncStorage.getItem(USER_STATE_KEY);
      return stateStr ? JSON.parse(stateStr) : null;
    } catch (error) {
      console.error('❌ 获取用户状态失败:', error);
      return null;
    }
  }

  /**
   * 处理没有token的情况
   */
  private static async handleNoToken(): Promise<void> {
    await this.setUserState({ isLoggedIn: false, lastActivity: Date.now() });
  }

  /**
   * 清除过期的token
   */
  private static async clearExpiredToken(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
    await this.setUserState({ isLoggedIn: false, lastActivity: Date.now() });
    console.log('🧹 过期token已清除');
  }

  /**
   * 更新最后活动时间
   */
  private static async updateLastActivity(): Promise<void> {
    try {
      const currentState = await this.getUserState();
      if (currentState) {
        await this.setUserState({
          ...currentState,
          lastActivity: Date.now()
        });
      }
    } catch (error) {
      console.error('❌ 更新活动时间失败:', error);
    }
  }

  /**
   * 检查用户是否已登录（基于token和用户状态）
   */
  static async isUserLoggedIn(): Promise<boolean> {
    try {
      const isTokenValid = await this.isTokenValid();
      const userState = await this.getUserState();

      const isLoggedIn = isTokenValid && userState?.isLoggedIn === true;

      if (!isLoggedIn && userState?.isLoggedIn === true) {
        // 如果用户状态显示已登录但token无效，更新状态
        await this.setUserState({ isLoggedIn: false, lastActivity: Date.now() });
      }

      return isLoggedIn;
    } catch (error) {
      console.error('❌ 检查登录状态失败:', error);
      return false;
    }
  }

  /**
   * 强制登出（清除所有相关数据）
   */
  static async forceLogout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY, USER_STATE_KEY]);
      console.log('🚪 强制登出完成，所有数据已清除');

      // 通知监听器Token状态已变化
      this.notifyListeners();
    } catch (error) {
      console.error('❌ 强制登出失败:', error);
    }
  }

  /**
   * 获取token信息（用于调试）
   */
  static async getTokenInfo(): Promise<{
    hasToken: boolean;
    isValid: boolean;
    remainingMinutes: number;
    issuedAt?: string;
    expiryTime?: string;
  }> {
    try {
      const tokenDataStr = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) {
        return {
          hasToken: false,
          isValid: false,
          remainingMinutes: 0
        };
      }

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      const now = Date.now();
      const isValid = now <= tokenData.expiryTime;
      const remainingMinutes = Math.max(0, Math.round((tokenData.expiryTime - now) / (60 * 1000)));

      return {
        hasToken: true,
        isValid,
        remainingMinutes,
        issuedAt: new Date(tokenData.issuedAt).toLocaleString(),
        expiryTime: new Date(tokenData.expiryTime).toLocaleString()
      };
    } catch (error) {
      console.error('❌ 获取token信息失败:', error);
      return {
        hasToken: false,
        isValid: false,
        remainingMinutes: 0
      };
    }
  }

  /**
   * 获取Token数据（私有方法）
   */
  private static async getTokenData(): Promise<TokenData | null> {
    try {
      const tokenDataStr = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataStr) {
        return null;
      }
      return JSON.parse(tokenDataStr);
    } catch (error) {
      console.error('❌ 获取Token数据失败:', error);
      return null;
    }
  }

  /**
   * 检查Token是否需要刷新（在过期前30分钟刷新）
   */
  static async shouldRefreshToken(): Promise<boolean> {
    try {
      const tokenData = await this.getTokenData();
      if (!tokenData) {
        return false;
      }

      const now = Date.now();
      const timeUntilExpiry = tokenData.expiryTime - now;
      const thirtyMinutes = 30 * 60 * 1000; // 30分钟

      // 如果Token在30分钟内过期，则需要刷新
      return timeUntilExpiry <= thirtyMinutes && timeUntilExpiry > 0;
    } catch (error) {
      console.error('❌ 检查Token刷新需求失败:', error);
      return false;
    }
  }

  /**
   * 获取Token的剩余有效时间（分钟）
   */
  static async getTokenRemainingMinutes(): Promise<number> {
    try {
      const tokenData = await this.getTokenData();
      if (!tokenData) {
        return 0;
      }

      const now = Date.now();
      const remainingMs = tokenData.expiryTime - now;
      return Math.max(0, Math.floor(remainingMs / (60 * 1000)));
    } catch (error) {
      console.error('❌ 获取Token剩余时间失败:', error);
      return 0;
    }
  }

  /**
   * 检查是否有有效的Token可以用于自动登录
   */
  static async hasValidTokenForAutoLogin(): Promise<boolean> {
    try {
      const isValid = await this.isTokenValid();
      const isLoggedIn = await this.isUserLoggedIn();

      return isValid && isLoggedIn;
    } catch (error) {
      console.error('❌ 检查自动登录Token失败:', error);
      return false;
    }
  }
}

export default TokenManager;
