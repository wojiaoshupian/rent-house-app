# UserContext 使用说明

## 概述

UserContext 是一个 React Context，用于在整个应用中管理用户状态。它提供了用户信息的存储、更新、登出等功能。

## 功能特性

- ✅ 用户信息存储和管理
- ✅ 用户认证状态跟踪
- ✅ 自动 token 管理
- ✅ 用户登出功能
- ✅ 用户信息刷新
- ✅ 类型安全的 TypeScript 支持

## 安装和配置

### 1. 包装应用程序

在 `App.tsx` 中用 `UserProvider` 包装整个应用：

```tsx
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          {/* 你的应用内容 */}
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
```

### 2. 在组件中使用

使用 `useUser` hook 访问用户状态：

```tsx
import { useUser } from '../contexts/UserContext';

export const MyComponent = () => {
  const { user, isAuthenticated, setUser, logout } = useUser();

  return (
    <View>
      {isAuthenticated ? (
        <Text>欢迎，{user?.username}!</Text>
      ) : (
        <Text>请登录</Text>
      )}
    </View>
  );
};
```

## API 参考

### UserContextState 接口

```tsx
interface UserContextState {
  user: User | null;              // 当前用户信息
  isLoading: boolean;             // 加载状态
  isAuthenticated: boolean;       // 是否已认证
  setUser: (user: User | null) => void;           // 设置用户信息
  updateUser: (userData: Partial<User>) => void;  // 更新用户信息
  logout: () => Promise<void>;                    // 登出
  refreshUserInfo: () => Promise<void>;           // 刷新用户信息
}
```

### 方法说明

#### `setUser(user: User | null)`
设置用户信息，通常在登录或注册成功后调用。

```tsx
// 登录成功后
const handleLoginSuccess = (userData: User) => {
  setUser(userData);
};
```

#### `updateUser(userData: Partial<User>)`
部分更新用户信息，用于更新用户资料。

```tsx
// 更新用户名
updateUser({ username: 'newUsername' });
```

#### `logout()`
清除用户信息和 token，执行登出操作。

```tsx
const handleLogout = async () => {
  await logout();
  // 用户已登出
};
```

#### `refreshUserInfo()`
从服务器刷新用户信息（需要根据实际 API 实现）。

## 使用示例

### 1. 注册成功后存储用户信息

```tsx
// RegisterScreen.tsx
const { setUser } = useUser();

userService.register(registerData).subscribe({
  next: (user) => {
    if (user) {
      setUser(user); // 存储用户信息到 Context
      console.log('用户信息已存储:', user);
    }
  }
});
```

### 2. 显示用户信息

```tsx
// ProfileScreen.tsx
const { user, isAuthenticated } = useUser();

return (
  <View>
    <Text>
      {isAuthenticated ? user?.username : '未登录'}
    </Text>
    <Text>
      {isAuthenticated ? user?.email : '请先登录'}
    </Text>
  </View>
);
```

### 3. 条件渲染

```tsx
// HomeScreen.tsx
const { user, isAuthenticated } = useUser();

return (
  <View>
    {isAuthenticated ? (
      <Text>欢迎回来，{user?.username}!</Text>
    ) : (
      <Text>欢迎使用应用，请注册账户</Text>
    )}
  </View>
);
```

### 4. 登出功能

```tsx
// ProfileScreen.tsx
const { logout } = useUser();

const handleLogout = () => {
  Alert.alert('确认退出', '您确定要退出登录吗？', [
    { text: '取消', style: 'cancel' },
    { 
      text: '退出', 
      onPress: async () => {
        await logout();
        Alert.alert('提示', '已成功退出登录');
      }
    }
  ]);
};
```

## 注意事项

1. **必须在 UserProvider 内部使用**：`useUser` hook 必须在 `UserProvider` 包装的组件内使用。

2. **Token 管理**：Context 会自动处理 token 的存储和清除，与 `TokenManager` 配合工作。

3. **类型安全**：所有的用户数据都有完整的 TypeScript 类型定义。

4. **持久化**：用户信息目前存储在内存中，应用重启后需要重新登录。如需持久化，可以扩展 Context 实现。

## 扩展功能

可以根据需要扩展 UserContext 的功能：

- 添加用户偏好设置
- 实现用户信息的本地持久化
- 添加用户权限管理
- 集成推送通知设置
- 添加用户活动日志

## 调试

Context 包含了详细的控制台日志，方便调试：

- `👤 用户信息已更新`
- `👤 用户信息已部分更新`
- `👋 用户已登出`
- `🔄 用户信息刷新完成`
- `🔑 发现已保存的 token`
