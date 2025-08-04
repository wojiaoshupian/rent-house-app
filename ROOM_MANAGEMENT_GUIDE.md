# 🏠 房间管理功能指南

## 🎯 功能概述

已完成房间管理功能的实现，包括房间创建、列表查看、更新、删除等完整的CRUD操作，以及认证保护和测试工具。

## ✅ 已实现功能

### 1. 完整的房间CRUD操作
- **✅ Create（创建）**：创建新房间
- **✅ Read（读取）**：获取房间列表和详情
- **✅ Update（更新）**：编辑房间信息
- **✅ Delete（删除）**：删除房间

### 2. 房间数据管理
- **房间基础信息**：房间号、租金、押金、水电费单价
- **楼宇关联**：房间与楼宇的关联关系
- **状态管理**：房间状态（可租、已租、维修中、预定）
- **认证保护**：所有操作都需要用户认证

### 3. 用户界面功能
- **房间创建页面**：完整的房间信息录入表单
- **楼宇选择器**：动态加载楼宇列表供选择
- **表单验证**：完善的输入验证和错误提示
- **操作反馈**：创建成功后的确认和导航

## 🚀 API接口详情

### 创建房间接口
```typescript
POST /api/rooms
Content-Type: application/json
Authorization: Bearer {token}

请求示例：
{
  "roomNumber": "101",
  "rent": 1500.00,
  "defaultDeposit": 3000.00,
  "electricityUnitPrice": 1.2,
  "waterUnitPrice": 3.5,
  "hotWaterUnitPrice": 6.0,
  "buildingId": 3
}

响应示例：
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "roomNumber": "101",
    "rent": 1500.00,
    "defaultDeposit": 3000.00,
    "electricityUnitPrice": 1.2,
    "waterUnitPrice": 3.5,
    "hotWaterUnitPrice": 6.0,
    "buildingId": 3,
    "status": "AVAILABLE",
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  },
  "token": "refreshed-jwt-token",
  "tokenExpiresAt": 1754372478208,
  "timestamp": 1754286078214
}
```

### 其他房间接口
```typescript
// 获取房间列表
GET /api/rooms
GET /api/rooms?buildingId=3

// 获取房间详情
GET /api/rooms/{id}

// 更新房间信息
PUT /api/rooms/{id}

// 删除房间
DELETE /api/rooms/{id}

// 搜索房间
GET /api/rooms?search=关键词

// 获取房间统计
GET /api/rooms/stats
```

## 🎮 用户界面操作

### 1. 房间创建页面
**访问路径**：主页 → 房间管理 → 创建房间

**功能特性**：
- 📋 完整的房间信息表单
- 🏢 动态楼宇选择器
- ✅ 实时表单验证
- 💾 一键创建房间

### 2. 表单字段说明
- **所属楼宇** *：选择房间所属的楼宇（必填）
- **房间号** *：房间编号，如"101"（必填）
- **月租金** *：房间月租金额（必填）
- **默认押金** *：房间默认押金金额（必填）
- **电费单价** *：电费单价，元/度（必填）
- **水费单价** *：水费单价，元/吨（必填）
- **热水单价**：热水单价，元/吨（可选）

### 3. 操作流程
```
选择楼宇 → 填写房间信息 → 验证表单 → 提交创建 → 创建成功 → 返回列表
```

## 🔒 认证保护特性

### 1. 请求前检查
```typescript
// 每个房间操作前都会检查认证状态
const isAuth = await AuthGuard.isAuthenticated();
if (!isAuth) {
  throw new Error('用户未登录，请先登录后再试');
}
```

### 2. 错误处理
- **401 未授权**：`"登录已过期，请重新登录"`
- **403 权限不足**：`"权限不足，无法执行此操作"`
- **404 不存在**：`"房间不存在或已被删除"`
- **409 冲突**：`"房间号已存在，请使用其他房间号"`

### 3. 自动状态管理
- Token过期时自动清理状态
- 认证失败时引导用户重新登录
- 保持前端状态与后端同步

## 🧪 测试工具

### 控制台测试命令
```javascript
// 快速测试获取房间列表
testRoomAPI.quick()

// 测试获取房间列表
testRoomAPI.getList()

// 测试根据楼宇ID获取房间
testRoomAPI.getByBuildingId(3)

// 测试创建房间
testRoomAPI.create()

// 测试更新房间
testRoomAPI.update()

// 测试删除房间
testRoomAPI.delete()

// 测试搜索房间
testRoomAPI.search('关键词')

// 运行完整测试套件
testRoomAPI.all()
```

### 测试场景说明
1. **创建测试**：自动选择第一个楼宇创建测试房间
2. **更新测试**：找到第一个房间并更新其信息
3. **删除测试**：创建一个房间然后立即删除
4. **搜索测试**：搜索包含特定关键词的房间

## 📊 数据类型定义

### 房间基础类型
```typescript
interface Room {
  id: number;
  roomNumber: string;
  rent: number;
  defaultDeposit: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  buildingId: number;
  status?: RoomStatus;
  createdAt?: string;
  updatedAt?: string;
}

enum RoomStatus {
  AVAILABLE = 'AVAILABLE',     // 可租
  OCCUPIED = 'OCCUPIED',       // 已租
  MAINTENANCE = 'MAINTENANCE', // 维修中
  RESERVED = 'RESERVED'        // 预定
}
```

### 创建房间请求
```typescript
interface CreateRoomRequest {
  roomNumber: string;
  rent: number;
  defaultDeposit: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  buildingId: number;
}
```

## 💡 使用场景

### 1. 房间创建流程
```
房东登录 → 选择楼宇 → 填写房间信息 → 创建房间 → 房间可用于出租
```

### 2. 房间管理流程
```
查看房间列表 → 选择房间 → 编辑/删除房间 → 更新房间状态
```

### 3. 租户入住流程
```
查看可租房间 → 选择房间 → 办理入住 → 房间状态变为已租
```

## 🔍 表单验证规则

### 必填字段验证
- **房间号**：不能为空，建议使用数字+字母组合
- **租金**：必须大于0的数字
- **押金**：不能为负数
- **电费单价**：必须大于0的数字
- **水费单价**：必须大于0的数字
- **楼宇选择**：必须选择一个有效的楼宇

### 数据格式验证
- **数字字段**：自动转换为数字类型
- **小数精度**：支持两位小数
- **字符长度**：房间号建议不超过20个字符

## 🚨 注意事项

### 1. 认证要求
- 所有房间操作都需要用户登录
- Token过期时需要重新登录
- 未认证时操作会被自动拒绝

### 2. 数据完整性
- 房间必须关联到有效的楼宇
- 房间号在同一楼宇内不能重复
- 删除楼宇前需要先删除其下的所有房间

### 3. 业务逻辑
- 已租房间不能随意删除
- 房间价格调整需要考虑现有租约
- 房间状态变更需要记录历史

## 📚 相关文件

- `types/room.ts` - 房间数据类型定义
- `services/roomService.ts` - 房间服务（包含CRUD方法）
- `screens/CreateRoom/index.tsx` - 房间创建页面
- `utils/testRoomAPI.ts` - 房间API测试工具
- `types/navigation.ts` - 导航类型定义（已更新）

## 🎯 使用建议

### 1. 开发测试
- 使用控制台测试工具验证API功能
- 确保用户已登录后再测试
- 观察控制台日志确认操作结果

### 2. 生产环境
- 确保后端接口已实现并正常工作
- 验证数据验证规则是否正确
- 监控房间创建和管理操作

### 3. 用户体验
- 提供清晰的表单验证提示
- 确保楼宇选择器加载正常
- 操作成功后提供明确反馈

## 🎉 功能特点

### 1. 完整性
- 支持完整的房间CRUD操作
- 完善的用户界面和交互
- 详细的错误处理和验证

### 2. 安全性
- 完整的认证保护机制
- 数据验证和安全检查
- 自动状态管理和清理

### 3. 易用性
- 直观的房间创建界面
- 便捷的楼宇选择功能
- 完善的测试和调试工具

现在您可以在应用中完整地管理房间数据，包括创建、查看、编辑和删除房间，所有功能都受到完善的认证保护！
