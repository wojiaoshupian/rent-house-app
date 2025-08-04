# 🏢 楼宇API接口更新指南

## 🎯 接口修改说明

**原接口**：`GET /api/buildings` （获取所有楼宇）

**新接口**：`GET /api/buildings/owned/{userId}` （获取用户拥有的楼宇）

**修改原因**：应该获取当前用户拥有的楼宇，而不是所有楼宇，符合业务逻辑和权限控制。

## ✅ 已实现的修改

### 1. 楼宇服务更新
- **自动获取当前用户**：调用 `userService.getCurrentUser()` 获取用户ID
- **调用正确接口**：使用 `/api/buildings/owned/{userId}` 接口
- **认证保护**：添加认证检查，确保用户已登录
- **错误处理**：完善的错误处理和提示信息

### 2. 新增便捷方法
- **按用户ID获取**：`getBuildingsByUserId(userId)` 方法
- **直接调用**：可以直接传入用户ID获取楼宇
- **认证保护**：同样包含认证检查

### 3. 测试工具更新
- **更新测试说明**：明确说明调用的是用户拥有楼宇接口
- **新增用户ID测试**：可以测试指定用户ID的楼宇获取
- **完善错误提示**：提供更详细的测试指导

## 🚀 技术实现

### 自动获取当前用户楼宇
```typescript
// 1. 检查认证状态
const isAuth = await AuthGuard.isAuthenticated();

// 2. 获取当前用户信息
userService.getCurrentUser().subscribe({
  next: (currentUser) => {
    // 3. 使用用户ID调用接口
    const url = `/api/buildings/owned/${currentUser.id}`;
    apiService.get<Building[]>(url).subscribe(subscriber);
  }
});
```

### 直接按用户ID获取
```typescript
// 直接调用指定用户的楼宇
buildingService.getBuildingsByUserId(123).subscribe({
  next: (buildings) => {
    console.log('用户123拥有的楼宇:', buildings);
  }
});
```

### 接口调用流程
```
用户请求 → 认证检查 → 获取当前用户 → 调用 /api/buildings/owned/{userId} → 返回用户楼宇
```

## 🎮 使用方法

### 1. 前端调用（自动）
```typescript
// 自动获取当前用户的楼宇
buildingService.getBuildingList().subscribe({
  next: (buildings) => {
    // 这里的buildings是当前用户拥有的楼宇
    console.log('我的楼宇:', buildings);
  }
});
```

### 2. 指定用户ID调用
```typescript
// 获取指定用户的楼宇
buildingService.getBuildingsByUserId(123).subscribe({
  next: (buildings) => {
    console.log('用户123的楼宇:', buildings);
  }
});
```

### 3. 控制台测试
```javascript
// 测试当前用户的楼宇
testBuildingAPI.getList()

// 测试指定用户的楼宇
testBuildingAPI.getByUserId(123)

// 自动获取当前用户ID并测试
testBuildingAPI.getByUserId()
```

## 🔧 后端接口要求

### 接口定义
```java
@GetMapping("/owned/{userId}")
@Operation(summary = "获取用户拥有的楼宇", description = "获取指定用户拥有的所有楼宇")
public ResponseEntity<ApiResponse<List<BuildingDto>>> getUserOwnedBuildings(@PathVariable Long userId) {
    List<BuildingDto> buildings = buildingService.getUserOwnedBuildings(userId);
    return ResponseEntity.ok(ApiResponse.success(buildings));
}
```

### 请求示例
```
GET /api/buildings/owned/123
Authorization: Bearer {token}
```

### 响应示例
```json
{
  "data": [
    {
      "id": 1,
      "buildingName": "测试楼宇",
      "landlordName": "张三",
      "electricityUnitPrice": 1.2,
      "waterUnitPrice": 3.5,
      "createdBy": 123,
      "createdByUsername": "testuser",
      "createdAt": "2024-01-01T12:00:00",
      "updatedAt": "2024-01-01T12:00:00"
    }
  ],
  "success": true,
  "message": "获取成功"
}
```

## 📊 接口对比

### 修改前
```
GET /api/buildings
- 获取所有楼宇
- 可能包含其他用户的楼宇
- 权限控制不够精确
```

### 修改后
```
GET /api/buildings/owned/{userId}
- 获取指定用户拥有的楼宇
- 只返回该用户的楼宇
- 权限控制更加精确
```

## 🧪 测试验证

### 控制台测试命令
```javascript
// 快速测试用户楼宇获取
testBuildingAPI.quick()

// 测试当前用户的楼宇
testBuildingAPI.getList()

// 测试指定用户的楼宇
testBuildingAPI.getByUserId(123)

// 自动获取当前用户ID并测试
testBuildingAPI.getByUserId()
```

### 测试场景
1. **已登录用户**：应该能获取到自己的楼宇列表
2. **未登录用户**：应该提示需要登录
3. **无楼宇用户**：应该返回空列表
4. **指定用户ID**：应该能获取指定用户的楼宇

## 💡 预期行为

### 成功情况
- ✅ 用户已登录：返回用户拥有的楼宇列表
- ✅ 用户有楼宇：显示楼宇详细信息
- ✅ 用户无楼宇：返回空列表，提示可以创建楼宇

### 错误情况
- ❌ 用户未登录：提示需要登录
- ❌ Token过期：自动清理状态，引导重新登录
- ❌ 用户不存在：返回404错误
- ❌ 权限不足：返回403错误

## 🔍 调试信息

### 控制台日志
修改后的接口会输出详细的调试信息：
```
🏢 获取用户拥有的楼宇列表...
👤 当前用户: testuser ID: 123
🔗 调用接口: /api/buildings/owned/123
✅ 获取用户楼宇列表成功
📊 楼宇数量: 2
```

### 错误日志
```
❌ 获取用户楼宇列表失败: 用户未登录
💡 提示：请先登录后再测试
```

## 🚨 注意事项

### 1. 认证要求
- 必须用户已登录才能获取楼宇列表
- Token必须有效且未过期
- 需要有获取用户信息的权限

### 2. 权限控制
- 用户只能获取自己拥有的楼宇
- 不能获取其他用户的楼宇（除非有特殊权限）
- 后端需要验证用户身份和权限

### 3. 数据一致性
- 楼宇的 `createdBy` 字段应该与用户ID一致
- 确保数据库中的关联关系正确
- 定期检查数据完整性

## 📚 相关文件

- `services/buildingService.ts` - 楼宇服务（已更新）
- `utils/testBuildingAPI.ts` - 楼宇API测试工具（已更新）
- `screens/BuildingList/index.tsx` - 楼宇列表页面（使用更新后的服务）

## 🎯 使用建议

### 1. 开发测试
- 使用控制台测试工具验证接口调用
- 确保用户已登录后再测试
- 观察控制台日志确认调用的是正确接口

### 2. 生产环境
- 确保后端接口已实现并正常工作
- 验证权限控制是否正确
- 监控接口调用成功率

### 3. 问题排查
- 检查用户是否已登录
- 确认后端接口路径是否正确
- 查看控制台日志定位问题

## 🎉 修改效果

现在楼宇列表功能：
- ✅ **权限精确**：只显示用户拥有的楼宇
- ✅ **接口正确**：调用 `/api/buildings/owned/{userId}` 接口
- ✅ **自动获取**：自动获取当前用户ID
- ✅ **认证保护**：确保用户已登录
- ✅ **错误处理**：完善的错误提示和处理

用户现在只能看到和管理自己拥有的楼宇，符合业务逻辑和安全要求！
