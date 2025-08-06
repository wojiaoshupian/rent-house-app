# 条件渲染重构总结

## 问题背景

原代码中存在大量的条件渲染写法，如：
```jsx
{record.notes && (
  <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
)}
```

这种写法虽然功能正常，但存在以下问题：
1. **可读性差**：逻辑和UI混合在一起
2. **重复代码多**：相似的条件渲染模式重复出现
3. **维护困难**：修改条件逻辑需要在多处修改
4. **类型安全问题**：可能出现 `0 && <Component />` 渲染出 `0` 的问题

## 解决方案

### 1. 创建辅助函数

在 `screens/BillDetail/index.tsx` 中添加了三个辅助函数：

#### renderIfExists - 通用条件渲染
```typescript
const renderIfExists = (condition: any, component: React.ReactNode) => {
  return condition ? component : null;
};
```

**用途**：替代简单的 `condition && <Component />` 写法
**优势**：明确返回 `null`，避免渲染意外值

#### renderFeeItem - 费用项目渲染
```typescript
const renderFeeItem = (amount: number | undefined, label: string, usage?: number, unit?: string) => {
  if (!amount || amount <= 0) return null;
  
  const usageText = usage && unit ? ` (${usage} ${unit})` : '';
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-600">{label}{usageText}</Text>
      <Text className="text-gray-800 font-medium">{formatAmount(amount)}</Text>
    </View>
  );
};
```

**用途**：专门用于渲染费用明细项目
**优势**：统一的样式和逻辑，支持用量显示

#### renderInfoItem - 信息项目渲染
```typescript
const renderInfoItem = (value: any, label: string, formatter?: (value: any) => string) => {
  if (!value) return null;
  
  const displayValue = formatter ? formatter(value) : value;
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-600">{label}</Text>
      <Text className="text-gray-800 font-medium">{displayValue}</Text>
    </View>
  );
};
```

**用途**：渲染键值对信息
**优势**：支持自定义格式化函数

#### renderDescriptionItem - 描述项目渲染
```typescript
const renderDescriptionItem = (value: string | undefined, label: string) => {
  if (!value) return null;
  
  return (
    <View>
      <Text className="text-gray-600 mb-1">{label}</Text>
      <Text className="text-gray-800">{value}</Text>
    </View>
  );
};
```

**用途**：渲染多行描述信息
**优势**：统一的描述样式

### 2. 重构前后对比

#### 费用明细重构

**重构前**：
```jsx
{bill.rent && bill.rent > 0 && (
  <View className="flex-row justify-between">
    <Text className="text-gray-600">房租</Text>
    <Text className="text-gray-800 font-medium">{formatAmount(bill.rent)}</Text>
  </View>
)}

{bill.electricityUsage && bill.electricityUsage > 0 && (
  <View className="flex-row justify-between">
    <Text className="text-gray-600">电费 ({bill.electricityUsage} 度)</Text>
    <Text className="text-gray-800 font-medium">
      {formatAmount(bill.electricityAmount || (bill.electricityUsage * (bill.room?.electricityUnitPrice || 0)))}
    </Text>
  </View>
)}
```

**重构后**：
```jsx
{renderFeeItem(bill.rent, '房租')}
{renderFeeItem(
  bill.electricityAmount || ((bill.electricityUsage || 0) * (bill.room?.electricityUnitPrice || 0)),
  '电费',
  bill.electricityUsage,
  '度'
)}
```

#### 信息项目重构

**重构前**：
```jsx
{bill.tenant && (
  <View className="flex-row justify-between">
    <Text className="text-gray-600">租户信息</Text>
    <Text className="text-gray-800 font-medium">{bill.tenant.name}</Text>
  </View>
)}

{bill.paymentMethod && (
  <View className="flex-row justify-between">
    <Text className="text-gray-600">支付方式</Text>
    <Text className="text-gray-800 font-medium">
      {getPaymentMethodLabel(bill.paymentMethod)}
    </Text>
  </View>
)}
```

**重构后**：
```jsx
{renderInfoItem(bill.tenant?.name, '租户信息')}
{renderInfoItem(bill.paymentMethod, '支付方式', getPaymentMethodLabel)}
```

#### 描述项目重构

**重构前**：
```jsx
{bill.description && (
  <View>
    <Text className="text-gray-600 mb-1">账单描述</Text>
    <Text className="text-gray-800">{bill.description}</Text>
  </View>
)}

{record.notes && (
  <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
)}
```

**重构后**：
```jsx
{renderDescriptionItem(bill.description, '账单描述')}
{renderIfExists(record.notes, (
  <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
))}
```

## 重构效果

### 1. 代码量减少
- **重构前**：约 40 行条件渲染代码
- **重构后**：约 15 行函数调用
- **减少比例**：62.5%

### 2. 可读性提升
- 业务逻辑更清晰
- UI 结构更简洁
- 意图更明确

### 3. 维护性改善
- 样式统一管理
- 逻辑集中处理
- 修改影响范围小

### 4. 类型安全
- 明确的 null 返回
- 更好的 TypeScript 支持
- 避免意外渲染

## 最佳实践建议

### 1. 何时使用辅助函数
- **简单条件**：使用 `renderIfExists`
- **重复模式**：创建专用渲染函数
- **复杂逻辑**：提取为独立组件

### 2. 命名规范
- 渲染函数以 `render` 开头
- 描述性命名，如 `renderFeeItem`
- 保持一致的参数顺序

### 3. 参数设计
- 必需参数在前
- 可选参数在后
- 支持格式化函数

### 4. 返回值处理
- 明确返回 `null` 而不是 `false`
- 保持返回类型一致
- 避免返回 `undefined`

## 扩展建议

### 1. 创建通用组件
可以将这些辅助函数进一步抽象为可复用的组件：

```typescript
// components/common/ConditionalRender.tsx
export const ConditionalRender: React.FC<{
  condition: any;
  children: React.ReactNode;
}> = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};

// components/common/InfoItem.tsx
export const InfoItem: React.FC<{
  label: string;
  value: any;
  formatter?: (value: any) => string;
}> = ({ label, value, formatter }) => {
  if (!value) return null;
  // ... 渲染逻辑
};
```

### 2. 使用 Hook
可以创建自定义 Hook 来管理条件渲染逻辑：

```typescript
const useConditionalRender = () => {
  const renderIf = useCallback((condition: any, component: React.ReactNode) => {
    return condition ? component : null;
  }, []);
  
  return { renderIf };
};
```

### 3. 配置化渲染
对于复杂的表单或详情页，可以使用配置化的方式：

```typescript
const fieldConfig = [
  { key: 'rent', label: '房租', type: 'fee' },
  { key: 'tenant.name', label: '租户信息', type: 'info' },
  { key: 'description', label: '账单描述', type: 'description' }
];
```

## 总结

通过引入辅助函数重构条件渲染，我们实现了：
- **代码简化**：减少重复代码
- **逻辑清晰**：分离关注点
- **维护友好**：统一管理样式和逻辑
- **类型安全**：更好的 TypeScript 支持

这种重构方式不仅提升了代码质量，也为后续的功能扩展和维护奠定了良好的基础。
