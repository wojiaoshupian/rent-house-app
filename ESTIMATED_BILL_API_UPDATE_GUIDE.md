# 📊 预估账单API接口更新指南

## 🎯 接口变更说明

预估账单相关接口已从独立的 `/api/estimated-bills` 路径迁移到统一的 `/api/bills` 路径下，实现账单管理的统一化。

## 📋 接口变更对照表

| 功能 | 旧接口 | 新接口 | 状态 |
|------|--------|--------|------|
| 查询账单 | `GET /api/estimated-bills` | `GET /api/bills` | ✅ 已更新 |
| 生成账单 | `POST /api/estimated-bills/generate` | `POST /api/bills/generate` | ✅ 已更新 |
| 获取详情 | `GET /api/estimated-bills/{id}` | `GET /api/bills/{id}` | ✅ 已更新 |
| 更新账单 | `PUT /api/estimated-bills/{id}` | `PUT /api/bills/{id}` | ✅ 已更新 |
| 删除账单 | `DELETE /api/estimated-bills/{id}` | `DELETE /api/bills/{id}` | ✅ 已更新 |

## ✅ 已完成的更新

### 1. 服务层更新 (`services/billService.ts`)

#### 获取预估账单列表
```typescript
// 旧接口调用
apiService.get<EstimatedBill[]>('/api/estimated-bills', { params })

// 新接口调用
apiService.get<EstimatedBill[]>('/api/bills', { params })
```

#### 生成预估账单
```typescript
// 旧接口调用
apiService.post<EstimatedBill>('/api/estimated-bills/generate', null, { params })

// 新接口调用
apiService.post<EstimatedBill>('/api/bills/generate', null, { params })
```

#### 删除预估账单
```typescript
// 旧接口调用
apiService.delete<void>(`/api/estimated-bills/${billId}`)

// 新接口调用
apiService.delete<void>(`/api/bills/${billId}`)
```

### 2. 页面导航更新 (`screens/EstimatedBillList/index.tsx`)

#### 预估账单详情导航
```typescript
// 旧导航
navigation.navigate('EstimatedBillDetail', { billId: bill.id })

// 新导航（使用统一的账单详情页面）
navigation.navigate('BillDetail', { billId: bill.id })
```

### 3. 导航类型更新 (`types/navigation.ts`)

#### 移除独立的预估账单详情路由
```typescript
// 移除的路由定义
EstimatedBillDetail: { billId: number };

// 现在使用统一的账单详情路由
BillDetail: { billId: number };
```

### 4. 测试工具更新 (`utils/testBillAPI.ts`)

#### 更新接口说明
```typescript
// 生成预估账单测试
console.log('💡 注意：此接口需要用户登录并调用 POST /api/bills/generate');

// 删除预估账单测试
console.log('💡 注意：此接口需要用户登录并调用 DELETE /api/bills/{id}');
```

### 5. 文档更新 (`BILL_MANAGEMENT_GUIDE.md`)

#### API接口文档
```typescript
// 获取预估账单列表
GET /api/bills?roomId=1&billMonth=2025-08&billStatus=GENERATED&page=0&size=10
Authorization: Bearer {token}
```

## 🔧 技术实现细节

### 统一的账单管理
- ✅ **统一接口**：预估账单和普通账单使用相同的API端点
- ✅ **统一详情页**：预估账单详情使用普通账单详情页面
- ✅ **统一类型**：保持现有的 `EstimatedBill` 类型定义
- ✅ **向下兼容**：保持所有现有功能不变

### 接口参数保持不变
- ✅ **查询参数**：`roomId`, `billMonth`, `billStatus`, `page`, `size`
- ✅ **生成参数**：`roomId`, `billMonth`
- ✅ **响应格式**：保持原有的数据结构和分页信息

### 认证和权限
- ✅ **认证检查**：所有接口调用前检查用户登录状态
- ✅ **错误处理**：完整的HTTP状态码错误处理
- ✅ **权限控制**：保持原有的权限验证机制

## 🧪 测试验证

### 控制台测试命令
```javascript
// 测试获取预估账单
window.testBillAPI.testGetEstimatedBills()

// 测试生成预估账单
window.testBillAPI.testGenerateEstimatedBill(1, "2025-08")

// 测试删除预估账单
window.testBillAPI.testDeleteEstimatedBill(123)

// 测试获取房间预估账单
window.testBillAPI.testGetEstimatedBillsByRoomId(1)

// 测试获取状态预估账单
window.testBillAPI.testGetEstimatedBillsByStatus('GENERATED')

// 运行所有测试
window.testBillAPI.runAllTests()
```

### 验证要点
1. **接口调用**：确认所有预估账单接口调用新的 `/api/bills` 端点
2. **功能完整性**：验证所有预估账单功能正常工作
3. **页面导航**：确认预估账单详情正确导航到账单详情页
4. **数据一致性**：验证数据格式和内容保持一致

## 💡 使用建议

### 开发环境
- ✅ 使用控制台测试工具验证接口更新
- ✅ 检查网络请求确认调用正确的端点
- ✅ 验证预估账单列表和详情页面功能

### 生产环境
- ✅ 确保后端接口已更新到新的路径
- ✅ 验证所有预估账单功能正常工作
- ✅ 监控接口调用和错误日志

### 用户体验
- ✅ 预估账单功能保持不变
- ✅ 页面导航和交互保持一致
- ✅ 错误提示和加载状态正常显示

## 🎉 更新完成

所有预估账单相关的API接口调用已成功更新到新的 `/api/bills` 端点，功能完整性和用户体验保持不变。系统现在使用统一的账单管理接口，提供更好的一致性和维护性。

### 主要改进
- 🔄 **接口统一**：预估账单和普通账单使用统一接口
- 📱 **页面复用**：预估账单详情复用账单详情页面
- 🛡️ **功能保持**：所有现有功能完全保持不变
- 🧪 **测试完整**：提供完整的测试工具和验证方法

现在您可以正常使用所有预估账单功能，包括查看、生成、删除等操作！
