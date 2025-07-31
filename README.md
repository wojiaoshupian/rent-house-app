# React Native 库集成演示

这是一个演示如何集成和使用 `rxjs`、`lodash`、`zustand` 以及 React Navigation 的 Expo 应用。

## 已集成的库

### 1. Zustand - 状态管理
- 轻量级状态管理库
- 简单易用的 API
- 支持 TypeScript
- 演示功能：
  - 计数器管理
  - 用户信息管理
  - Todo 列表管理

### 2. RxJS - 响应式编程
- 响应式编程库
- 事件流处理
- 异步操作管理
- 演示功能：
  - 应用状态管理 (BehaviorSubject)
  - 防抖搜索 (debounceTime)
  - 定时器 (interval)
  - 事件流合并 (merge)
  - 请求取消 (switchMap)

### 3. Lodash - 工具库
- JavaScript 实用工具函数库
- 数据处理和函数式编程
- 演示功能：
  - 数组操作 (uniq, groupBy, chunk)
  - 对象操作 (merge, get, set, pick, omit)
  - 字符串操作 (camelCase, snakeCase, capitalize)
  - 数字操作 (random, range, sum, mean)
  - 函数操作 (debounce, throttle, curry)
  - 集合操作 (map, filter, reduce, sortBy)

### 4. React Navigation - 路由导航
- React Native 路由导航库
- 类型安全的导航
- 演示功能：
  - 页面间导航
  - 导航参数传递
  - 自定义导航样式

## 项目结构

```
my-expo-app/
├── App.tsx                 # 主应用入口，配置路由
├── store/
│   └── useStore.ts        # Zustand 状态管理
├── services/
│   └── rxjsService.ts     # RxJS 服务
├── utils/
│   └── lodashUtils.ts     # Lodash 工具函数
├── screens/
│   ├── HomeScreen.tsx     # 主页面
│   ├── ZustandDemoScreen.tsx  # Zustand 演示
│   ├── RxJSDemoScreen.tsx     # RxJS 演示
│   ├── LodashDemoScreen.tsx   # Lodash 演示
│   └── LibraryDemoScreen.tsx  # 综合演示
├── types/
│   └── navigation.ts      # 导航类型定义
└── components/            # 原有组件
```

## 功能演示

### 主页面 (HomeScreen)
- 展示所有可用的演示页面
- 提供导航到各个库演示页面的入口
- 显示已集成库的说明

### Zustand 演示页面
- **计数器管理**: 演示状态更新和订阅
- **用户信息管理**: 演示复杂状态对象的管理
- **Todo 列表**: 演示列表状态的管理和操作

### RxJS 演示页面
- **应用状态管理**: 使用 BehaviorSubject 管理全局状态
- **防抖搜索**: 演示 debounceTime 操作符
- **定时器**: 演示 interval 和订阅管理
- **事件流**: 演示 merge 操作符和事件处理

### Lodash 演示页面
- **数组操作**: uniq, groupBy, chunk, filter 等
- **对象操作**: merge, get, set, pick, omit 等
- **字符串操作**: camelCase, snakeCase, capitalize 等
- **数字操作**: random, range, sum, mean 等
- **函数操作**: debounce, throttle, curry 等
- **集合操作**: map, filter, reduce, sortBy 等

### 综合演示页面
- 展示所有库的联合使用
- 演示 RxJS 获取数据 + Lodash 处理数据 + Zustand 状态管理
- 展示库之间的协作和集成

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 在模拟器或真机上运行：
- iOS: 按 `i` 键
- Android: 按 `a` 键
- Web: 按 `w` 键

## 技术栈

- **React Native**: 跨平台移动应用开发
- **Expo**: React Native 开发工具链
- **TypeScript**: 类型安全的 JavaScript
- **NativeWind**: React Native 的 Tailwind CSS
- **Zustand**: 轻量级状态管理
- **RxJS**: 响应式编程
- **Lodash**: JavaScript 工具库
- **React Navigation**: 路由导航

## 学习要点

1. **状态管理**: 使用 Zustand 进行简单高效的状态管理
2. **响应式编程**: 使用 RxJS 处理异步操作和事件流
3. **工具函数**: 使用 Lodash 进行数据处理和函数式编程
4. **路由导航**: 使用 React Navigation 进行页面导航
5. **类型安全**: 使用 TypeScript 确保代码的类型安全
6. **库集成**: 学习如何将多个库集成到一个项目中

## 扩展建议

- 添加更多 RxJS 操作符的演示
- 集成更多 Lodash 函数
- 添加持久化存储 (AsyncStorage)
- 集成网络请求库 (Axios)
- 添加单元测试
- 集成状态持久化 