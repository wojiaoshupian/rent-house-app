# 预估账单状态简化

## 更改概述

根据用户需求，将预估账单的状态筛选选项从原来的6个状态简化为3个状态：
- **全部** - 显示所有状态的账单
- **已生成** - 新创建的预估账单
- **已确认** - 已经确认的预估账单

## 具体更改

### 1. 更新状态选项配置

**文件**: `types/bill.ts`

**更改前**:
```typescript
export const ESTIMATED_BILL_STATUS_OPTIONS = [
  { value: EstimatedBillStatus.GENERATED, label: '已生成', color: '#3b82f6' },
  { value: EstimatedBillStatus.CONFIRMED, label: '已确认', color: '#10b981' },
  { value: EstimatedBillStatus.SENT, label: '已发送', color: '#8b5cf6' },
  { value: EstimatedBillStatus.PAID, label: '已支付', color: '#10b981' },
  { value: EstimatedBillStatus.OVERDUE, label: '已逾期', color: '#ef4444' },
  { value: EstimatedBillStatus.CANCELLED, label: '已取消', color: '#6b7280' },
] as const;
```

**更改后**:
```typescript
// 预估账单状态选项 - 只保留已生成和已确认状态
export const ESTIMATED_BILL_STATUS_OPTIONS = [
  { value: EstimatedBillStatus.GENERATED, label: '已生成', color: '#3b82f6' },
  { value: EstimatedBillStatus.CONFIRMED, label: '已确认', color: '#10b981' },
] as const;
```

### 2. 更新预估账单列表页面

**文件**: `screens/EstimatedBillList/index.tsx`

**更改内容**:
- 状态筛选标签现在只显示：全部、已生成、已确认
- 编辑账单状态功能只允许在"已生成"和"已确认"之间切换

**更改前**:
```typescript
const statusOptions = [
  { label: '已生成', value: 'GENERATED' },
  { label: '已确认', value: 'CONFIRMED' },
  { label: '已发送', value: 'SENT' },
  { label: '已支付', value: 'PAID' },
  { label: '已逾期', value: 'OVERDUE' },
  { label: '已取消', value: 'CANCELLED' }
];
```

**更改后**:
```typescript
// 编辑账单状态 - 只允许在已生成和已确认之间切换
const statusOptions = [
  { label: '已生成', value: 'GENERATED' },
  { label: '已确认', value: 'CONFIRMED' }
];
```

### 3. 更新预估账单编辑表单

**文件**: `components/EstimatedBillEditForm.tsx`

**更改内容**:
- 状态选择下拉框只显示"已生成"和"已确认"两个选项

**更改前**:
```typescript
const statusOptions = [
  { label: '已生成', value: 'GENERATED' },
  { label: '已确认', value: 'CONFIRMED' },
  { label: '已发送', value: 'SENT' },
  { label: '已支付', value: 'PAID' },
  { label: '已逾期', value: 'OVERDUE' },
  { label: '已取消', value: 'CANCELLED' }
];
```

**更改后**:
```typescript
// 状态选项 - 只保留已生成和已确认
const statusOptions = [
  { label: '已生成', value: 'GENERATED' },
  { label: '已确认', value: 'CONFIRMED' }
];
```

## 保持不变的部分

### 状态枚举定义
`EstimatedBillStatus` 枚举保持完整，包含所有6个状态：
```typescript
export enum EstimatedBillStatus {
  GENERATED = 'GENERATED',   // 已生成
  CONFIRMED = 'CONFIRMED',   // 已确认
  SENT = 'SENT',            // 已发送
  PAID = 'PAID',            // 已支付
  OVERDUE = 'OVERDUE',      // 已逾期
  CANCELLED = 'CANCELLED'    // 已取消
}
```

**原因**: 
- 后端API可能仍然需要处理所有状态
- 数据库中可能存在其他状态的历史数据
- 保持类型定义的完整性，便于未来扩展

### 确认按钮逻辑
预估账单卡片上的"确认"按钮逻辑保持不变：
- 只有"已生成"状态的账单才显示确认按钮
- 点击确认后状态变为"已确认"

## 用户体验改进

### 1. 简化的界面
- 状态筛选标签从6个减少到3个（包含"全部"）
- 界面更加简洁，减少用户选择的复杂性

### 2. 清晰的工作流程
- **已生成**: 系统自动生成的预估账单，等待确认
- **已确认**: 用户确认无误的账单，可以发送给租户

### 3. 一致的操作体验
- 所有相关页面和组件都使用相同的状态选项
- 编辑功能只允许在有意义的状态之间切换

## 业务逻辑

### 账单生命周期（简化版）
1. **系统生成** → 状态：已生成
2. **用户确认** → 状态：已确认
3. **后续处理** → 通过其他方式处理（如导出、打印等）

### 状态转换规则
- **已生成** ↔ **已确认**: 允许双向切换
- 其他状态转换通过后端API或其他业务流程处理

## 技术影响

### 前端影响
- ✅ 筛选功能正常工作
- ✅ 编辑功能限制在允许的状态范围内
- ✅ 界面显示简化，用户体验提升

### 后端兼容性
- ✅ 后端API不需要修改
- ✅ 数据库结构不需要变更
- ✅ 现有数据完全兼容

### 未来扩展性
- 如需要添加更多状态，只需修改 `ESTIMATED_BILL_STATUS_OPTIONS` 配置
- 状态枚举保持完整，便于未来功能扩展
- 组件设计支持动态状态选项

## 测试建议

### 功能测试
1. **筛选功能**: 验证"全部"、"已生成"、"已确认"筛选正常工作
2. **状态编辑**: 验证只能在"已生成"和"已确认"之间切换
3. **确认按钮**: 验证只有"已生成"状态显示确认按钮
4. **表单编辑**: 验证编辑表单中状态选择正常工作

### 兼容性测试
1. **历史数据**: 验证包含其他状态的历史数据正常显示
2. **API调用**: 验证后端API调用不受影响
3. **数据同步**: 验证前后端数据状态同步正常

## 总结

这次更改成功简化了预估账单的状态管理，提升了用户体验，同时保持了系统的技术完整性和未来扩展性。用户现在可以更专注于核心的账单确认流程，而不会被过多的状态选项分散注意力。
