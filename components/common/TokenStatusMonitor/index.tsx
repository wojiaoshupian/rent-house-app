import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import TokenManager from '../../../utils/tokenManager';
import { useUser } from '../../../contexts/UserContext';

interface TokenInfo {
  hasToken: boolean;
  isValid: boolean;
  remainingMinutes: number;
  issuedAt?: string;
  expiryTime?: string;
}

interface TokenStatusMonitorProps {
  enabled?: boolean;
  showDetails?: boolean;
}

/**
 * Token状态监控组件
 * 用于开发环境下监控token状态和登录状态
 */
export const TokenStatusMonitor: React.FC<TokenStatusMonitorProps> = ({ 
  enabled = __DEV__, 
  showDetails = false 
}) => {
  const { user, isAuthenticated, logout } = useUser();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    hasToken: false,
    isValid: false,
    remainingMinutes: 0
  });
  const [isExpanded, setIsExpanded] = useState(showDetails);

  // 获取token信息
  const fetchTokenInfo = async () => {
    try {
      const info = await TokenManager.getTokenInfo();
      setTokenInfo(info);
    } catch (error) {
      console.error('获取token信息失败:', error);
    }
  };

  // 检查登录状态
  const checkLoginStatus = async () => {
    const isLoggedIn = await TokenManager.isUserLoggedIn();
    console.log('🔍 登录状态检查:', {
      isLoggedIn,
      hasUser: !!user,
      isAuthenticated,
      tokenValid: tokenInfo.isValid
    });
  };

  // 强制清除token
  const handleForceLogout = () => {
    Alert.alert(
      '强制登出',
      '确定要清除所有登录数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await logout();
            await fetchTokenInfo();
            Alert.alert('完成', '所有登录数据已清除');
          }
        }
      ]
    );
  };

  // 监听Token状态变化并定期更新
  useEffect(() => {
    if (!enabled) return;

    // 立即获取一次token信息
    fetchTokenInfo();

    // 添加Token状态变化监听器
    const removeListener = TokenManager.addListener(() => {
      console.log('🔔 Token状态发生变化，立即更新显示');
      fetchTokenInfo();
    });

    // 定期更新token信息（作为备用机制）
    const interval = setInterval(fetchTokenInfo, 30000); // 每30秒更新一次

    return () => {
      clearInterval(interval);
      removeListener(); // 移除监听器
    };
  }, [enabled]);

  // 如果未启用，不显示
  if (!enabled) {
    return null;
  }

  // 获取状态颜色
  const getStatusColor = () => {
    if (!tokenInfo.hasToken) return '#6b7280'; // 灰色
    if (!tokenInfo.isValid) return '#ef4444'; // 红色
    if (tokenInfo.remainingMinutes < 60) return '#f59e0b'; // 黄色
    return '#10b981'; // 绿色
  };

  // 获取状态文本
  const getStatusText = () => {
    if (!tokenInfo.hasToken) return '无Token';
    if (!tokenInfo.isValid) return '已过期';
    if (tokenInfo.remainingMinutes < 60) return '即将过期';
    return '正常';
  };

  return (
    <View style={{
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderRadius: 8,
      padding: 8,
      minWidth: 120
    }}>
      {/* 基本状态显示 */}
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)}
        style={{ marginBottom: isExpanded ? 8 : 0 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: getStatusColor(),
            marginRight: 6
          }} />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {getStatusText()}
          </Text>
        </View>
        
        {tokenInfo.hasToken && tokenInfo.isValid && (
          <Text style={{ color: 'white', fontSize: 10, marginTop: 2 }}>
            剩余: {tokenInfo.remainingMinutes}分钟
          </Text>
        )}
      </TouchableOpacity>

      {/* 详细信息 */}
      {isExpanded && (
        <View>
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: '#374151', 
            paddingTop: 8,
            marginBottom: 8 
          }}>
            <Text style={{ color: '#d1d5db', fontSize: 10, marginBottom: 4 }}>
              📱 用户状态
            </Text>
            <Text style={{ color: 'white', fontSize: 10 }}>
              认证: {isAuthenticated ? '✅ 是' : '❌ 否'}
            </Text>
            <Text style={{ color: 'white', fontSize: 10 }}>
              用户: {user ? user.username : '未登录'}
            </Text>
            <Text style={{ color: '#10b981', fontSize: 9, marginTop: 2 }}>
              💡 支持后端过期时间
            </Text>
          </View>

          {tokenInfo.hasToken && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#d1d5db', fontSize: 10, marginBottom: 4 }}>
                🔑 Token信息
              </Text>
              <Text style={{ color: 'white', fontSize: 10 }}>
                状态: {tokenInfo.isValid ? '✅ 有效' : '❌ 无效'}
              </Text>
              {tokenInfo.issuedAt && (
                <Text style={{ color: 'white', fontSize: 10 }}>
                  签发: {tokenInfo.issuedAt}
                </Text>
              )}
              {tokenInfo.expiryTime && (
                <Text style={{ color: 'white', fontSize: 10 }}>
                  过期: {tokenInfo.expiryTime}
                </Text>
              )}
            </View>
          )}

          {/* 操作按钮 */}
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <TouchableOpacity
              onPress={checkLoginStatus}
              style={{
                backgroundColor: '#3b82f6',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                flex: 1
              }}
            >
              <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>
                检查
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={fetchTokenInfo}
              style={{
                backgroundColor: '#10b981',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                flex: 1
              }}
            >
              <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>
                刷新
              </Text>
            </TouchableOpacity>
            
            {tokenInfo.hasToken && (
              <TouchableOpacity
                onPress={handleForceLogout}
                style={{
                  backgroundColor: '#ef4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  flex: 1
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>
                  清除
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
