# Flow Frontend

> Flow Engine 企业级流程引擎前端 - 基于 React 18、TypeScript、Rsbuild 的可视化流程设计与审批系统

## Flow Framework Version

| Package                                                                            | Description              | Version                                                                                                                                             |
|------------------------------------------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| [@coding-flow/flow-core](https://github.com/codingapi/flow-frontend)               | 核心框架库（无 UI 组件） | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-core.svg)](https://www.npmjs.com/package/@coding-flow/flow-core)                             |
| [@coding-flow/flow-types](https://github.com/codingapi/flow-frontend)              | TypeScript 类型定义      | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-types.svg)](https://www.npmjs.com/package/@coding-flow/flow-types)                           |
| [@coding-flow/flow-icons](https://github.com/codingapi/flow-frontend)              | 图标库                   | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-icons.svg)](https://www.npmjs.com/package/@coding-flow/flow-icons)                           |
| [@coding-flow/flow-approval-presenter](https://github.com/codingapi/flow-frontend) | 审批 Presenter 框架     | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-approval-presenter.svg)](https://www.npmjs.com/package/@coding-flow/flow-approval-presenter) |
| [@coding-flow/flow-design](https://github.com/codingapi/flow-frontend)             | 流程设计器组件（PC）     | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-design.svg)](https://www.npmjs.com/package/@coding-flow/flow-design)                         |
| [@coding-flow/flow-pc-ui](https://github.com/codingapi/flow-frontend)              | PC 端基础 UI 组件库      | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-ui.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-ui)                           |
| [@coding-flow/flow-pc-form](https://github.com/codingapi/flow-frontend)            | PC 端表单组件库          | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-form.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-form)                       |
| [@coding-flow/flow-pc-approval](https://github.com/codingapi/flow-frontend)        | PC 端审批组件库          | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-approval.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-approval)               |
| [@coding-flow/flow-mobile-ui](https://github.com/codingapi/flow-frontend)          | 移动端基础 UI 组件库     | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-ui.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-ui)                   |
| [@coding-flow/flow-mobile-form](https://github.com/codingapi/flow-frontend)        | 移动端表单组件库         | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-form.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-form)               |
| [@coding-flow/flow-mobile-approval](https://github.com/codingapi/flow-frontend)    | 移动端审批组件库         | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-approval.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-approval)       |


## 简介

Flow Frontend 是 Flow Engine 流程引擎的前端项目，提供完整的流程管理界面，包括可视化流程设计、动态表单配置、审批处理等功能。采用 monorepo 架构，支持 PC 端和移动端。

### 核心特性

- **可视化流程设计器** - 基于 Flowgram.ai 的流程设计器，支持拖拽式节点配置
- **动态表单系统** - 表单设计器、表单渲染、字段权限管理
- **审批流程管理** - 待办/已办列表、审批处理、流程追踪
- **Groovy 脚本编辑** - CodeMirror 6 集成的代码编辑器，支持语法高亮
- **Monorepo 架构** - pnpm workspace 管理的模块化开发
- **TypeScript 类型安全** - 完整的类型定义和类型检查
- **响应式设计** - 同时支持 PC 端和移动端

## 技术栈

- **React 18** - UI 框架
- **TypeScript 5** - 类型安全
- **Rsbuild/Rslib** - 构建工具
- **pnpm 10** - 包管理器
- **Ant Design 6** - UI 组件库
- **Redux Toolkit** - 状态管理
- **CodeMirror 6** - 代码编辑器
- **Flowgram.ai** - 流程图编辑器
- **Groovy** - 脚本引擎支持

## 项目结构

```
flow-frontend/
├── apps/                                    # 应用层
│   ├── app-pc/                              # PC 端应用
│   │   └── src/
│   │       ├── pages/                       # 页面组件
│   │       ├── api/                         # API 接口
│   │       └── config/                      # 配置文件
│   └── app-mobile/                          # 移动端应用
│       └── src/
│           ├── pages/                       # 页面组件
│           ├── api/                         # API 接口
│           └── config/                      # 配置文件
├── packages/                                # 包层
│   ├── flow-core/                           # 核心框架库（无 UI 组件）
│   │   └── src/
│   │       ├── http.ts                      # HTTP 客户端
│   │       ├── hooks.ts                     # React Hooks
│   │       ├── presenter.ts                 # Presenter 模式
│   │       ├── groovy.ts                    # Groovy 脚本工具
│   │       ├── event.ts                     # 事件系统
│   │       ├── object.ts                    # 对象工具
│   │       └── ...                          # 其他工具模块
│   ├── flow-types/                          # TypeScript 类型定义
│   │   └── src/
│   │       └── types/                       # 业务类型定义
│   │           ├── flow-approval.ts         # 流程审批类型
│   │           ├── flow-design.ts           # 流程设计类型
│   │           ├── form-instance.ts         # 表单实例类型
│   │           ├── form-type.ts             # 表单类型
│   │           ├── form-view.ts             # 表单视图类型
│   │           └── icons.ts                 # 图标类型
│   ├── flow-icons/                          # 图标库
│   │   └── src/
│   │       ├── icons/                       # 图标定义
│   │       └── index.ts                     # 导出
│   ├── flow-approval-presenter/             # 审批 Presenter 框架
│   │   └── src/
│   │       ├── api/                         # API 接口
│   │       ├── context/                     # 上下文
│   │       ├── hooks/                       # 审批相关 Hooks
│   │       ├── model/                       # 数据模型
│   │       ├── plugins/                     # 插件
│   │       ├── presenters/                  # Presenter 实现
│   │       ├── store/                       # 状态管理
│   │       └── typings/                     # 类型定义
│   ├── flow-design/                         # 流程设计器组件（PC）
│   │   └── src/
│   │       ├── api/                         # API 接口
│   │       ├── assets/                      # 静态资源
│   │       ├── components/                  # 组件
│   │       │   ├── design-editor/           # 设计编辑器
│   │       │   ├── design-import/           # 导入功能
│   │       │   ├── design-panel/            # 属性面板
│   │       │   └── groovy-code/             # Groovy 代码组件
│   │       ├── plugins/                     # 节点视图类型插件
│   │       ├── script-components/           # 脚本编辑组件
│   │       │   ├── components/              # 脚本组件
│   │       │   ├── modal/                   # 模态框
│   │       │   ├── services/                # 服务
│   │       │   ├── typings/                 # 类型定义
│   │       │   └── utils/                   # 工具函数
│   │       └── utils/                       # 工具函数
│   ├── flow-pc/                             # PC 端组件库集合
│   │   ├── flow-pc-ui/                      # 基础 UI 组件库
│   │   │   └── src/
│   │   │       ├── components/              # 原子组件
│   │   │       ├── hooks/                   # Hooks
│   │   │       ├── index.ts                 # 导出
│   │   │       └── type.ts                  # 类型定义
│   │   ├── flow-pc-form/                    # 表单相关组件
│   │   │   └── src/
│   │   │       ├── api/                     # 表单 API
│   │   │       ├── components/              # 表单组件
│   │   │       ├── plugins/                 # 表单插件
│   │   │       ├── index.ts                 # 导出
│   │   │       └── type.d.ts                # 类型定义
│   │   └── flow-pc-approval/                # 审批页面组件
│   │       └── src/
│   │           ├── api/                     # 审批 API
│   │           ├── components/              # 审批组件
│   │           ├── plugins/                 # 审批插件
│   │           ├── index.ts                 # 导出
│   │           └── type.d.ts                # 类型定义
│   └── flow-mobile/                         # 移动端组件库集合
│       ├── flow-mobile-ui/                  # 基础 UI 组件库
│       │   └── src/
│       │       ├── components/              # 原子组件
│       │       └── index.ts                 # 导出
│       ├── flow-mobile-form/                # 表单相关组件
│       │   └── src/
│       │       ├── api/                     # 表单 API
│       │       ├── components/              # 表单组件
│       │       ├── hooks/                   # Hooks
│       │       ├── index.ts                 # 导出
│       │       └── type.ts                  # 类型定义
│       └── flow-mobile-approval/            # 审批页面组件
│           └── src/
│               ├── api/                     # 审批 API
│               ├── components/              # 审批组件
│               ├── plugins/                 # 审批插件
│               ├── index.ts                 # 导出
│               └── type.d.ts                # 类型定义
├── scripts/                                 # 脚本工具
├── package.json                             # 根 package.json
└── pnpm-workspace.yaml                      # pnpm workspace 配置
```

## 模块依赖关系

### 基础包

```
flow-core (核心框架，无 UI)
    ↑
    ├── flow-types (类型定义)
    ├── flow-icons (图标库)
    └── flow-approval-presenter (审批 Presenter)
```

### PC 端组件

```
flow-core → flow-types → flow-icons → flow-pc-ui (基础 UI)
                                     ↓
                                flow-pc-form (表单)
                                     ↓
                                flow-pc-approval (审批)
                                     ↓
                                flow-design (流程设计器)
```

### 移动端组件

```
flow-core → flow-types → flow-mobile-ui (基础 UI)
                                ↓
                           flow-mobile-form (表单)
                                ↓
                           flow-mobile-approval (审批)
```

### 依赖说明

| 包名 | 说明 | 依赖 |
|------|------|------|
| **flow-core** | 全局框架依赖，只包含与 UI 无关的基础能力（HTTP、状态管理、工具函数等） | - |
| **flow-types** | 全局类型定义，包含流程审批相关的业务类型（PC 端和移动端共用） | flow-core |
| **flow-icons** | 图标库 | flow-core |
| **flow-approval-presenter** | 审批 Presenter 框架 | flow-core, flow-types |
| **flow-pc-ui** | PC 端基础 UI 组件库，提供原子化组件 | flow-core, flow-types, flow-icons |
| **flow-pc-form** | 表单相关功能，包含表单设计器、表单渲染器、字段权限管理 | flow-core, flow-types, flow-pc-ui |
| **flow-pc-approval** | 审批页面功能，包含待办/已办列表、审批处理、流程追踪 | flow-core, flow-types, flow-pc-form |
| **flow-design** | 流程设计器功能，基于 Flowgram.ai 的可视化流程设计器 | flow-core, flow-types, flow-icons, flow-pc-ui |
| **flow-mobile-ui** | 移动端基础 UI 组件库 | flow-core, flow-types, flow-icons |
| **flow-mobile-form** | 移动端表单相关功能 | flow-core, flow-types, flow-mobile-ui |
| **flow-mobile-approval** | 移动端审批页面功能 | flow-core, flow-types, flow-mobile-form |

## 快速开始

### 安装依赖

```bash
# 进入前端目录
cd flow-frontend

# 安装依赖（推荐使用 pnpm）
pnpm install
```

### 开发模式

```bash
# 启动 PC 端应用
pnpm run dev:app-pc

# 启动移动端应用
pnpm run dev:app-mobile

# 监听模式编译核心库
pnpm run watch:flow-core
pnpm run watch:flow-types
pnpm run watch:flow-approval-presenter
pnpm run watch:flow-design
pnpm run watch:flow-pc-ui
pnpm run watch:flow-pc-form
pnpm run watch:flow-pc-approval
pnpm run watch:flow-mobile-ui
pnpm run watch:flow-mobile-form
pnpm run watch:flow-mobile-approval
```

### 构建

```bash
# 构建所有包
pnpm run build

# 构建 PC 端所有组件库
pnpm run build:flow-pc

# 构建移动端所有组件库
pnpm run build:flow-mobile

# 构建特定包
pnpm run build:flow-core                # 核心框架库
pnpm run build:flow-types               # 类型定义库
pnpm run build:flow-icons               # 图标库
pnpm run build:flow-approval-presenter  # 审批 Presenter 框架
pnpm run build:flow-design              # 流程设计器组件库

# 构建 PC 端组件
pnpm run build:flow-pc-ui               # 基础 UI 组件库
pnpm run build:flow-pc-form             # 表单组件库
pnpm run build:flow-pc-approval         # 审批组件库

# 构建移动端组件
pnpm run build:flow-mobile-ui           # 基础 UI 组件库
pnpm run build:flow-mobile-form         # 表单组件库
pnpm run build:flow-mobile-approval     # 审批组件库

# 构建应用
pnpm run build:app-pc
pnpm run build:app-mobile
```

### 测试

```bash
# 运行所有测试
pnpm run test

# 运行核心包测试
pnpm run test:flow-core

# 运行设计器测试
pnpm run test:flow-design

# 运行 PC 端组件测试
pnpm run test:flow-pc
# 或单独测试
pnpm run test:flow-pc-ui
pnpm run test:flow-pc-form
pnpm run test:flow-pc-approval

# 运行移动端组件测试
pnpm run test:flow-mobile
# 或单独测试
pnpm run test:flow-mobile-ui
pnpm run test:flow-mobile-form
pnpm run test:flow-mobile-approval
```

## 许可证

本项目为 Flow Engine 的前端部分，遵循主项目的 [LICENSE](./LICENSE)。
