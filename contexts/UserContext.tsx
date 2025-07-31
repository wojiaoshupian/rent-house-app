import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/userService';
import TokenManager from '../utils/tokenManager';

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
      // 清除本地存储的 token
      await TokenManager.removeToken();
      // 清除用户信息
      setUserState(null);
      console.log('👋 用户已登出');
    } catch (error) {
      console.error('登出失败:', error);
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

  // 组件挂载时检查是否有已保存的用户信息
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = await TokenManager.getToken();
        if (token) {
          // 如果有 token，可以在这里调用 API 获取用户信息
          // 或者从本地存储中恢复用户信息
          console.log('🔑 发现已保存的 token，等待用户信息加载...');
          // 这里暂时不设置用户信息，等待登录或注册时设置
        }
      } catch (error) {
        console.error('初始化用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

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
