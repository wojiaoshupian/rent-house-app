# 🏢 楼宇CRUD操作完整指南

## 🎯 功能概述

已完成楼宇的完整CRUD（创建、读取、更新、删除）操作接入，包括认证保护和用户界面。

## ✅ 已实现功能

### 1. 完整的CRUD操作
- **✅ Create（创建）**：创建新楼宇
- **✅ Read（读取）**：获取楼宇列表和详情
- **✅ Update（更新）**：编辑楼宇信息
- **✅ Delete（删除）**：删除楼宇

### 2. 认证保护机制
- 所有操作都需要用户认证
- 未登录时自动拒绝请求
- Token过期时自动清理状态
- 详细的错误提示

### 3. 用户界面功能
- 楼宇列表展示
- 编辑楼宇Modal
- 删除确认对话框
- 操作结果反馈

## 🚀 API接口详情

### 创建楼宇
```typescript
POST /api/buildings
Content-Type: application/json
Authorization: Bearer {token}

{
  "buildingName": "楼宇名称",
  "landlordName": "房东姓名",
  "electricityUnitPrice": 1.2,
  "waterUnitPrice": 3.5,
  "hotWaterUnitPrice": 4.0,
  "rentCollectionMethod": "FIXED_MONTH_START"
}
```

### 获取楼宇列表
```typescript
GET /api/buildings
Authorization: Bearer {token}
```

### 更新楼宇
```typescript
PUT /api/buildings/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "buildingName": "新楼宇名称",
  "landlordName": "新房东姓名",
  "electricityUnitPrice": 1.3,
  "waterUnitPrice": 3.6,
  "hotWaterUnitPrice": 4.1,
  "rentCollectionMethod": "FIXED_MONTH_START"
}
```

### 删除楼宇
```typescript
DELETE /api/buildings/{id}
Authorization: Bearer {token}
```

## 🎮 用户界面操作

### 1. 楼宇列表页面
**路径**：首页 → 楼宇管理 → 楼宇列表

**功能**：
- 📋 显示所有楼宇信息
- 🔄 下拉刷新数据
- ➕ 创建新楼宇
- ✏️ 编辑楼宇信息
- 🗑️ 删除楼宇

### 2. 楼宇卡片操作
每个楼宇卡片包含三个操作按钮：
- **蓝色"查看详情"**：查看楼宇详细信息
- **绿色"编辑"**：编辑楼宇信息
- **红色"删除"**：删除楼宇

### 3. 编辑楼宇Modal
**触发**：点击楼宇卡片的"编辑"按钮

**功能**：
- 📝 编辑楼宇名称
- 👤 编辑房东姓名
- ⚡ 编辑电费单价
- 💧 编辑水费单价
- 🔥 编辑热水单价（可选）
- 💾 保存更改
- ❌ 取消编辑

### 4. 删除确认对话框
**触发**：点击楼宇卡片的"删除"按钮

**功能**：
- ⚠️ 显示删除确认信息
- 🗑️ 确认删除操作
- ❌ 取消删除操作

## 🔒 认证保护特性

### 1. 请求前检查
```typescript
// 每个操作前都会检查认证状态
const isAuth = await AuthGuard.isAuthenticated();
if (!isAuth) {
  throw new Error('用户未登录，请先登录后再试');
}
```

### 2. 错误处理
- **401 未授权**：`"登录已过期，请重新登录"`
- **403 权限不足**：`"权限不足，无法执行此操作"`
- **404 不存在**：`"楼宇不存在或已被删除"`
- **409 冲突**：`"楼宇正在使用中，无法删除"`

### 3. 自动状态管理
- Token过期时自动清理状态
- 认证失败时引导用户重新登录
- 保持前端状态与后端同步

## 🧪 测试工具

### 控制台测试命令
```javascript
// 快速测试获取列表
testBuildingAPI.quick()

// 测试获取楼宇列表
testBuildingAPI.getList()

// 测试创建楼宇
testBuildingAPI.create()

// 测试更新楼宇
testBuildingAPI.update()

// 测试删除楼宇
testBuildingAPI.delete()

// 测试搜索楼宇
testBuildingAPI.search('关键词')

// 运行完整测试套件
testBuildingAPI.all()
```

### 测试场景说明
1. **创建测试**：创建一个测试楼宇
2. **更新测试**：找到第一个楼宇并更新其信息
3. **删除测试**：创建一个楼宇然后立即删除
4. **搜索测试**：搜索包含特定关键词的楼宇

## 📊 操作流程

### 创建楼宇流程
```
点击"+ 新建" → 填写楼宇信息 → 提交 → 认证检查 → API调用 → 刷新列表
```

### 更新楼宇流程
```
点击"编辑" → 修改信息 → 点击"保存" → 认证检查 → API调用 → 刷新列表
```

### 删除楼宇流程
```
点击"删除" → 确认删除 → 认证检查 → API调用 → 刷新列表
```

## 💡 使用技巧

### 1. 批量操作
- 可以连续编辑多个楼宇
- 删除操作有确认对话框防止误操作
- 操作完成后自动刷新列表

### 2. 数据验证
- 必填字段：楼宇名称、房东姓名、电费单价、水费单价
- 数字字段：自动验证数字格式
- 热水单价：可选字段

### 3. 错误处理
- 网络错误时显示重试选项
- 认证错误时引导重新登录
- 操作成功时显示确认信息

## 🚨 注意事项

### 1. 认证要求
- 所有CRUD操作都需要用户登录
- Token过期时需要重新登录
- 未认证时操作会被自动拒绝

### 2. 数据安全
- 删除操作不可恢复
- 更新操作会覆盖原有数据
- 建议在重要操作前确认

### 3. 网络依赖
- 需要后端服务器正常运行
- 网络异常时操作可能失败
- 建议在稳定网络环境下操作

## 🎯 实际演示

### 1. 完整操作流程
```
1. 登录应用
2. 进入楼宇管理 → 楼宇列表
3. 点击"+ 新建"创建楼宇
4. 点击"编辑"修改楼宇信息
5. 点击"删除"删除楼宇
6. 观察操作结果和状态变化
```

### 2. 认证保护测试
```
1. 退出登录
2. 尝试进行CRUD操作
3. 观察认证错误提示
4. 重新登录后正常操作
```

### 3. 控制台测试
```
1. 打开开发者工具
2. 运行 testBuildingAPI.all()
3. 观察完整的CRUD测试过程
4. 查看详细的日志输出
```

## 📚 相关文件

- `services/buildingService.ts` - 楼宇服务（包含CRUD方法）
- `screens/BuildingList/index.tsx` - 楼宇列表页面
- `screens/CreateBuilding/index.tsx` - 创建楼宇页面
- `utils/testBuildingAPI.ts` - 楼宇API测试工具
- `types/building.ts` - 楼宇数据类型定义

## 🎉 功能特点

### 1. 完整性
- 支持所有CRUD操作
- 完整的用户界面
- 详细的错误处理

### 2. 安全性
- 认证保护机制
- 操作确认对话框
- 自动状态管理

### 3. 用户友好
- 直观的操作界面
- 清晰的操作反馈
- 便捷的测试工具

现在您可以在应用中完整地管理楼宇数据，包括创建、查看、编辑和删除操作，所有功能都受到完善的认证保护！
