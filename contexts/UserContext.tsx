import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/userService';
import TokenManager from '../utils/tokenManager';
import { AutoLoginService } from '../services/autoLoginService';

// 用户上下文状态接口
interface UserContextState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

// 创建用户上下文
const UserContext = createContext<UserContextState | undefined>(undefined);

// 用户上下文提供者组件的 Props
interface UserProviderProps {
  children: ReactNode;
}

// 用户上下文提供者组件
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 计算是否已认证
  const isAuthenticated = user !== null;

  // 设置用户信息
  const setUser = (userData: User | null) => {
    setUserState(userData);
    console.log('👤 用户信息已更新:', userData ? userData.username : '已清空');
  };

  // 更新用户信息（部分更新）
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUserState(updatedUser);
      console.log('👤 用户信息已部分更新:', userData);
    }
  };

  // 登出
  const logout = async () => {
    try {
      // 使用强制登出清除所有相关数据
      await TokenManager.forceLogout();
      // 清除用户信息
      setUserState(null);
      console.log('👋 用户已登出，所有数据已清除');
    } catch (error) {
      console.error('❌ 登出失败:', error);
    }
  };

  // 刷新用户信息（从服务器获取最新信息）
  const refreshUserInfo = async () => {
    try {
      setIsLoading(true);
      const token = await TokenManager.getToken();
      
      if (!token) {
        setUserState(null);
        return;
      }

      // 这里可以调用 API 获取最新的用户信息
      // 暂时保持现有用户信息不变
      console.log('🔄 用户信息刷新完成');
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      // 如果刷新失败，可能 token 已过期，清除用户信息
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 检查登录状态并自动清理过期token
  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await TokenManager.isUserLoggedIn();

      if (!isLoggedIn && user !== null) {
        // 如果token无效但用户状态还存在，自动登出
        console.log('🔒 检测到token已过期或无效，自动登出');
        setUserState(null);
        await TokenManager.forceLogout();
      } else if (isLoggedIn && user === null) {
        // 如果token有效但用户状态为空，可能需要重新获取用户信息
        console.log('🔑 检测到有效token但用户信息为空，需要重新获取用户信息');
      }
    } catch (error) {
      console.error('❌ 检查认证状态失败:', error);
    }
  };

  // 组件挂载时检查是否有已保存的用户信息并尝试自动登录
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 应用启动，开始初始化用户状态...');

        // 尝试自动登录
        AutoLoginService.attemptAutoLogin().subscribe({
          next: (autoLoginResult) => {
            if (autoLoginResult) {
              console.log('✅ 自动登录成功:', autoLoginResult.user.username);
              setUserState(autoLoginResult.user);
            } else {
              console.log('ℹ️ 未执行自动登录，用户需要手动登录');
              setUserState(null);
            }
          },
          error: (error) => {
            console.error('❌ 自动登录失败:', error);
            setUserState(null);
            // 自动登录失败，清理可能无效的Token
            TokenManager.forceLogout();
          },
          complete: () => {
            setIsLoading(false);
            console.log('🏁 用户初始化完成');
          }
        });
      } catch (error) {
        console.error('❌ 初始化用户信息失败:', error);
        setUserState(null);
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // 定期检查登录状态（每5分钟检查一次）
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000); // 5分钟

    return () => clearInterval(interval);
  }, [user]);

  const contextValue: UserContextState = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    updateUser,
    logout,
    refreshUserInfo,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook 用于使用用户上下文
export const useUser = (): UserContextState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// 导出用户上下文（如果需要直接访问）
export { UserContext };
