# 🔐 Token自动管理指南

## 🎯 功能概述

已实现智能Token管理系统，能够自动检测登录状态并在未登录时移除过期或无效的Token。

## ✅ 已实现功能

### 1. 智能Token管理
- **自动过期检测**：每次获取Token时自动检查是否过期
- **自动清理**：过期Token会被自动移除
- **状态同步**：Token状态与用户登录状态保持同步
- **定期检查**：每5分钟自动检查一次登录状态

### 2. 增强的TokenManager
```typescript
// 设置Token（带过期时间）
await TokenManager.setToken(token, 24); // 24小时有效期

// 获取Token（自动检查过期）
const token = await TokenManager.getToken(); // 过期返回null

// 检查Token有效性
const isValid = await TokenManager.isTokenValid();

// 检查用户登录状态
const isLoggedIn = await TokenManager.isUserLoggedIn();

// 强制登出（清除所有数据）
await TokenManager.forceLogout();
```

### 3. 自动状态管理
- **初始化检查**：应用启动时自动检查Token有效性
- **过期处理**：Token过期时自动清理用户状态
- **状态同步**：确保Token状态与用户Context状态一致

### 4. 可视化监控
- **Token状态监控器**：左上角显示当前Token状态
- **实时更新**：每30秒更新一次状态显示
- **详细信息**：显示Token剩余时间、用户状态等

## 🚀 使用方法

### 1. 查看Token状态
在应用左上角可以看到Token状态指示器：
- **绿色圆点**：Token正常，剩余时间充足
- **黄色圆点**：Token即将过期（<1小时）
- **红色圆点**：Token已过期
- **灰色圆点**：无Token

### 2. 详细状态信息
点击状态指示器可以展开详细信息：
- 📱 用户状态（认证状态、用户名）
- 🔑 Token信息（有效性、签发时间、过期时间）
- 操作按钮（检查、刷新、清除）

### 3. 控制台测试
在浏览器开发者工具的Console中可以使用测试命令：

```javascript
// 快速查看当前状态
testTokenManager.quick()

// 测试基本功能
testTokenManager.basic()

// 测试过期处理
testTokenManager.expired()

// 测试状态管理
testTokenManager.state()

// 运行全部测试
testTokenManager.all()

// 清理测试数据
testTokenManager.cleanup()
```

## 🔧 自动处理机制

### 1. 应用启动时
```
应用启动 → 检查Token有效性 → 无效则清理状态 → 更新用户Context
```

### 2. Token获取时
```
获取Token → 检查过期时间 → 过期则自动清理 → 返回null或有效Token
```

### 3. 定期检查
```
每5分钟 → 检查登录状态 → Token无效但用户已登录 → 自动登出
```

### 4. 用户操作时
```
用户操作 → 更新最后活动时间 → 保持状态同步
```

## 📊 状态管理流程

### 登录成功时
1. 保存Token和过期时间
2. 设置用户登录状态
3. 更新用户Context
4. 开始定期状态检查

### Token过期时
1. 自动检测到过期
2. 清理Token和相关数据
3. 更新用户状态为未登录
4. 清空用户Context

### 手动登出时
1. 调用强制登出
2. 清除所有相关数据
3. 更新所有状态
4. 停止定期检查

## 🎮 实际演示

### 1. 正常使用流程
```
登录 → Token自动保存 → 状态监控器显示绿色 → 正常使用应用
```

### 2. Token过期处理
```
等待Token过期 → 状态监控器变红 → 下次操作时自动登出 → 清理状态
```

### 3. 手动测试
```
打开控制台 → 运行testTokenManager.expired() → 观察自动清理过程
```

## 💡 开发者功能

### 1. Token状态监控器
- 位置：应用左上角
- 功能：实时显示Token状态
- 操作：点击展开详细信息和操作按钮

### 2. 控制台测试工具
- 快速测试：`testTokenManager.quick()`
- 完整测试：`testTokenManager.all()`
- 清理数据：`testTokenManager.cleanup()`

### 3. 详细日志
系统会输出详细的日志信息：
- ✅ Token设置成功
- ⏰ Token已过期，自动清除
- 🧹 过期token已清除
- 🚪 强制登出完成

## 🔒 安全特性

### 1. 自动过期处理
- Token过期后立即失效
- 自动清理过期数据
- 防止使用无效Token

### 2. 状态一致性
- Token状态与用户状态同步
- 防止状态不一致问题
- 确保安全性

### 3. 强制清理
- 提供强制登出功能
- 清除所有相关数据
- 确保完全退出

## 🚨 注意事项

1. **开发环境功能**：Token状态监控器只在开发环境显示
2. **定期检查**：系统每5分钟自动检查一次状态
3. **自动清理**：过期Token会被自动清理，无需手动处理
4. **状态同步**：Token状态变化会自动同步到用户Context

## 📚 相关文件

- `utils/tokenManager.ts` - 增强的Token管理器
- `contexts/UserContext.tsx` - 更新的用户上下文
- `components/common/TokenStatusMonitor/` - Token状态监控器
- `utils/testTokenManager.ts` - Token管理器测试工具

## 🎯 使用建议

1. **监控状态**：关注左上角的Token状态指示器
2. **测试功能**：使用控制台测试工具验证功能
3. **查看日志**：观察控制台输出的详细日志
4. **定期检查**：系统会自动处理，无需手动干预

现在系统会自动检测登录状态，并在Token过期或无效时自动清理相关数据，确保应用的安全性和一致性！
