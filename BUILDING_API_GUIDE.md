# 🏢 楼宇接口调用指南

## 🎯 功能概述

已成功集成楼宇管理接口，支持获取所有楼宇数据的GET方法调用。

## 🚀 使用方法

### 1. 在Home页面查看楼宇列表

**位置**: Home页面 → 楼宇列表区域

**功能**:
- ✅ 自动获取楼宇列表
- ✅ 显示楼宇基本信息
- ✅ 支持手动刷新
- ✅ 错误处理和重试
- ✅ 加载状态显示

**操作**:
1. 打开应用，Home页面会自动调用接口获取楼宇列表
2. 点击"刷新"按钮手动更新数据
3. 点击"查看全部"进入专门的楼宇列表页面

### 2. 专门的楼宇列表页面

**路径**: Home → 查看全部 → 楼宇列表页面

**功能**:
- ✅ 完整的楼宇列表展示
- ✅ 下拉刷新功能
- ✅ 详细的楼宇信息卡片
- ✅ 创建新楼宇入口
- ✅ 空状态处理

## 🛠️ API测试工具

### 控制台测试命令

在浏览器开发者工具的Console中，可以使用以下命令测试API：

```javascript
// 快速测试 - 获取楼宇列表
testBuildingAPI.quick()

// 获取楼宇列表
testBuildingAPI.getList()

// 创建测试楼宇
testBuildingAPI.create()

// 搜索楼宇
testBuildingAPI.search('测试')

// 运行全部测试
testBuildingAPI.all()
```

### 测试步骤

1. **打开浏览器**: 访问 http://localhost:8082
2. **打开开发者工具**: 按F12或右键选择"检查"
3. **切换到Console**: 点击Console标签
4. **运行测试命令**: 输入上述任一命令并回车
5. **查看结果**: 观察控制台输出的API调用结果

## 📊 接口详情

### GET /api/buildings - 获取所有楼宇

**请求方式**: GET
**请求路径**: `/api/buildings`
**参数**: 可选的查询参数

**响应数据结构**:
```typescript
interface Building {
  id: number;
  buildingName: string;           // 楼宇名称
  landlordName: string;           // 房东姓名
  electricityUnitPrice: number;   // 电费单价(元/度)
  waterUnitPrice: number;         // 水费单价(元/吨)
  hotWaterUnitPrice?: number;     // 热水单价(元/吨)
  electricityCost?: number;       // 电费成本(元/度)
  waterCost?: number;             // 水费成本(元/吨)
  hotWaterCost?: number;          // 热水成本(元/吨)
  rentCollectionMethod: string;   // 收租方式
}
```

## 🎮 实际演示

### 1. 启动应用
```bash
npm run start
# 然后按 'w' 打开Web版本
```

### 2. 查看Home页面
- 页面加载时会自动调用楼宇接口
- 在"楼宇列表"区域查看获取的数据
- 观察加载状态、错误处理等

### 3. 测试专门页面
- 点击"查看全部"按钮
- 进入专门的楼宇列表页面
- 测试下拉刷新功能

### 4. 控制台测试
- 按F12打开开发者工具
- 在Console中运行测试命令
- 观察API调用的详细日志

## 📋 功能特点

### ✅ 已实现功能

1. **自动获取**: 页面加载时自动调用接口
2. **手动刷新**: 支持用户主动刷新数据
3. **加载状态**: 显示加载中的状态指示
4. **错误处理**: 网络错误时显示错误信息和重试按钮
5. **空状态**: 无数据时显示友好的空状态页面
6. **数据展示**: 美观的卡片式布局展示楼宇信息
7. **导航集成**: 与应用导航系统完整集成
8. **测试工具**: 提供便捷的API测试工具

### 🎨 UI特性

- **响应式设计**: 适配不同屏幕尺寸
- **加载动画**: 优雅的加载状态指示
- **错误提示**: 清晰的错误信息展示
- **交互反馈**: 按钮点击状态反馈
- **数据可视化**: 费用信息的标签化展示

## 🔧 技术实现

### 状态管理
```typescript
const [buildings, setBuildings] = useState<Building[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### API调用
```typescript
buildingService.getBuildingList()
  .pipe(
    catchError((error) => {
      console.error('获取楼宇列表失败:', error);
      setError(error.message);
      return of([]);
    })
  )
  .subscribe({
    next: (buildingList) => {
      setBuildings(buildingList);
      setLoading(false);
    }
  });
```

### 错误处理
- RxJS的catchError操作符捕获错误
- 用户友好的错误信息显示
- 提供重试机制

## 🚨 注意事项

1. **网络依赖**: 需要确保API服务器正常运行
2. **错误处理**: 已实现完整的错误处理机制
3. **性能优化**: 使用RxJS进行响应式数据处理
4. **类型安全**: 完整的TypeScript类型定义

## 📚 相关文件

- `services/buildingService.ts` - 楼宇服务接口
- `screens/Home/index.tsx` - Home页面楼宇列表
- `screens/BuildingList/index.tsx` - 专门的楼宇列表页面
- `utils/testBuildingAPI.ts` - API测试工具
- `types/building.ts` - 楼宇数据类型定义

现在您可以在应用中查看楼宇接口的调用效果，并使用控制台工具进行详细的API测试！
