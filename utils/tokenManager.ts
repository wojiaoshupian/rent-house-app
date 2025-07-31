import AsyncStorage from '@react-native-async-storage/async-storage';

// Token 管理类
const TOKEN_KEY = 'auth_token';

class TokenManager {
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('✅ Token 设置成功 - Key', TOKEN_KEY, 'Value:', token);
    } catch (error) {
      console.error('保存 token 失败:', error);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('获取 token 失败:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('删除 token 失败:', error);
    }
  }
}

export default TokenManager;
