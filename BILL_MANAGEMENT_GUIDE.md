# 💰 账单管理系统完整指南

## 🎯 功能概述

已完成账单管理系统的完整接入，包括账单的创建、查看、编辑、支付、删除等全生命周期管理功能。

## ✅ 已实现功能

### 1. 完整的账单CRUD操作
- **✅ Create（创建）**：创建新账单
- **✅ Read（读取）**：获取账单列表和详情
- **✅ Update（更新）**：编辑账单信息
- **✅ Delete（删除）**：删除账单
- **✅ Pay（支付）**：账单支付功能

### 2. 账单类型支持
- **🏠 房租**：月租费用管理
- **⚡ 电费**：电力消费账单
- **💧 水费**：用水费用账单
- **🔥 热水费**：热水使用费用
- **🔌 水电费**：综合水电费账单
- **💰 押金**：租房押金管理
- **📄 其他费用**：其他杂费管理

### 3. 账单状态管理
- **⏳ 待支付**：新创建的账单
- **✅ 已支付**：完成支付的账单
- **⏰ 逾期**：超过到期日期的账单
- **❌ 已取消**：取消的账单
- **🔍 有争议**：存在争议的账单

### 4. 支付方式支持
- **💵 现金**：现金支付
- **🏦 银行转账**：银行转账支付
- **📱 支付宝**：支付宝支付
- **💬 微信支付**：微信支付
- **💳 其他方式**：其他支付方式

### 5. 预估账单功能
- **📊 预估账单查看**：查看系统生成的预估账单
- **🔍 状态筛选**：按状态筛选预估账单
- **📋 费用明细**：详细的费用构成展示
- **✅ 账单确认**：确认预估账单转为正式账单

#### 预估账单状态
- **📝 已生成**：系统自动生成的预估账单
- **✅ 已确认**：已确认的预估账单
- **📤 已发送**：已发送给租户的账单
- **💰 已支付**：已完成支付的账单
- **⏰ 已逾期**：超过到期日期的账单
- **❌ 已取消**：已取消的账单

## 🚀 API接口详情

### 创建账单
```typescript
POST /api/bills
Content-Type: application/json
Authorization: Bearer {token}

{
  "roomId": 1,
  "billType": "RENT",
  "title": "2024年1月房租",
  "description": "房租账单",
  "amount": 1500.00,
  "billPeriod": "2024-01",
  "dueDate": "2024-01-05",
  "notes": "备注信息"
}
```

### 获取账单列表
```typescript
GET /api/bills?roomId=1&status=PENDING&billType=RENT
Authorization: Bearer {token}
```

### 获取账单详情
```typescript
GET /api/bills/{billId}
Authorization: Bearer {token}
```

### 更新账单
```typescript
PUT /api/bills/{billId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "更新后的标题",
  "amount": 1600.00,
  "notes": "更新后的备注"
}
```

### 支付账单
```typescript
POST /api/bills/{billId}/pay
Content-Type: application/json
Authorization: Bearer {token}

{
  "amount": 1500.00,
  "paymentMethod": "CASH",
  "notes": "现金支付"
}
```

### 删除账单
```typescript
DELETE /api/bills/{billId}
Authorization: Bearer {token}
```

### 获取账单统计
```typescript
GET /api/bills/stats?roomId=1&buildingId=1
Authorization: Bearer {token}
```

### 批量生成账单
```typescript
POST /api/bills/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "roomIds": [1, 2, 3],
  "billType": "RENT",
  "title": "2024年2月房租",
  "billPeriod": "2024-02",
  "dueDate": "2024-02-05",
  "amount": 1500.00
}
```

### 预估账单接口

#### 获取预估账单列表
```typescript
GET /api/estimated-bills?roomId=1&billMonth=2025-08&billStatus=GENERATED&page=0&size=10
Authorization: Bearer {token}

// 响应示例
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "roomId": 1,
      "roomNumber": "101",
      "buildingName": "A栋",
      "billMonth": "2025-08",
      "billDate": "2025-08-05",
      "rent": 1500.00,
      "electricityAmount": 60.00,
      "waterAmount": 35.00,
      "hotWaterAmount": 20.00,
      "totalAmount": 1615.00,
      "billStatus": "GENERATED",
      "billStatusDescription": "已生成"
    }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 查询参数说明
- **roomId**: 房间ID（可选）
- **billMonth**: 账单月份，格式YYYY-MM（可选）
- **billStatus**: 账单状态（可选）
  - GENERATED - 已生成
  - CONFIRMED - 已确认
  - SENT - 已发送
  - PAID - 已支付
  - OVERDUE - 已逾期
  - CANCELLED - 已取消
- **page**: 页码，从0开始（默认0）
- **size**: 每页大小（默认10）

## 📱 用户界面功能

### 1. 账单列表页面
- **筛选功能**：按状态、类型筛选账单
- **搜索功能**：搜索特定账单
- **快速支付**：直接在列表页支付账单
- **下拉刷新**：刷新账单列表
- **浮动按钮**：快速创建新账单

### 2. 账单详情页面
- **完整信息展示**：账单所有详细信息
- **支付记录**：查看历史支付记录
- **操作按钮**：支付、编辑、删除操作
- **房间租户信息**：关联的房间和租户信息

### 3. 创建账单页面
- **房间选择**：选择关联房间
- **类型选择**：选择账单类型
- **表单验证**：完整的输入验证
- **智能默认值**：自动设置账单周期和到期日期

## 🔧 技术实现

### 账单类型定义
```typescript
// types/bill.ts
export interface Bill {
  id: number;
  billNumber: string;
  roomId: number;
  billType: BillType;
  title: string;
  amount: number;
  billPeriod: string;
  dueDate: string;
  status: BillStatus;
  paymentMethod?: PaymentMethod;
  paidAmount?: number;
  paidAt?: string;
  // ... 更多字段
}
```

### 账单服务类
```typescript
// services/billService.ts
class BillService {
  createBill(data: CreateBillRequest): Observable<Bill>
  getBillList(params?: BillListParams): Observable<Bill[]>
  getBillDetail(billId: number): Observable<BillDetail>
  updateBill(data: UpdateBillRequest): Observable<Bill>
  deleteBill(billId: number): Observable<void>
  payBill(billId: number, paymentData: PaymentData): Observable<Bill>
  getBillStats(): Observable<BillStats>
  generateBills(request: GenerateBillRequest): Observable<GenerateResult>
}
```

### 认证保护
- 所有账单操作都需要用户认证
- 未登录时自动拒绝请求
- Token过期时自动清理状态
- 详细的错误提示和处理

## 🧪 API测试

### 浏览器控制台测试
```javascript
// 测试创建账单
window.testBillAPI.testCreateBill()

// 测试获取账单列表
window.testBillAPI.testGetBillList()

// 测试获取账单详情
window.testBillAPI.testGetBillDetail(billId)

// 测试更新账单
window.testBillAPI.testUpdateBill(billId)

// 测试支付账单
window.testBillAPI.testPayBill(billId)

// 测试删除账单
window.testBillAPI.testDeleteBill(billId)

// 测试获取统计信息
window.testBillAPI.testGetBillStats()

// 测试批量生成账单
window.testBillAPI.testGenerateBills()

// 测试预估账单功能
window.testBillAPI.testGetEstimatedBills()
window.testBillAPI.testGetEstimatedBillsByRoomId(1)
window.testBillAPI.testGetEstimatedBillsByStatus('GENERATED')

// 运行所有测试
window.testBillAPI.runAllTests()
```

## 💡 使用场景

### 1. 房租管理流程
```
创建房租账单 → 发送给租户 → 租户支付 → 确认收款 → 记录完成
```

### 2. 水电费管理流程
```
抄表记录 → 自动生成水电费账单 → 通知租户 → 收取费用 → 更新状态
```

### 3. 批量账单生成
```
选择房间 → 设置账单信息 → 批量生成 → 逐个确认 → 发送通知
```

## 🔍 表单验证规则

### 必填字段验证
- **房间选择**：必须选择一个有效房间
- **账单标题**：不能为空
- **账单金额**：必须大于0
- **账单周期**：格式必须为YYYY-MM
- **到期日期**：格式必须为YYYY-MM-DD

### 业务逻辑验证
- **金额合理性**：金额必须为正数
- **日期有效性**：到期日期不能是过去日期
- **重复检查**：同一房间同一周期不能重复创建相同类型账单

## 🚨 注意事项

### 1. 认证要求
- 所有账单操作都需要用户登录
- Token过期时需要重新登录
- 未认证时操作会被自动拒绝

### 2. 数据一致性
- 账单与房间信息保持同步
- 支付状态实时更新
- 统计数据准确计算

### 3. 错误处理
- 网络错误自动重试
- 业务错误详细提示
- 用户友好的错误信息

## 🔄 与其他模块的集成

### 1. 房间管理集成
- 账单关联房间信息
- 房间租金自动填充
- 房间状态影响账单创建

### 2. 抄表记录集成
- 水电费账单自动计算
- 抄表数据关联账单
- 用量统计生成费用

### 3. 租户管理集成
- 账单关联租户信息
- 租户支付历史记录
- 租户账单统计分析

## 📈 未来扩展

### 1. 自动化功能
- 定时生成账单
- 自动发送提醒
- 逾期自动处理

### 2. 报表功能
- 收入统计报表
- 账单分析图表
- 导出功能

### 3. 通知功能
- 账单到期提醒
- 支付成功通知
- 逾期警告提醒

## 🎉 总结

账单管理系统已完整接入，提供了从账单创建到支付完成的全流程管理功能。系统具有良好的用户体验、完善的错误处理和强大的扩展性，为楼宇管理提供了重要的财务管理工具。
