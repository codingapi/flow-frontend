# Flow Frontend

> Flow Engine 企业级流程引擎前端 - 基于 React 18、TypeScript、Rsbuild 的可视化流程设计与审批系统

## Flow Framework Version

| Package                                                                            | Description             | Version                                                                                                                                             |
|------------------------------------------------------------------------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| [@coding-flow/flow-core](https://github.com/codingapi/flow-frontend)               | Flow-Core-Framework     | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-core.svg)](https://www.npmjs.com/package/@coding-flow/flow-core)                             |
| [@coding-flow/flow-types](https://github.com/codingapi/flow-frontend)              | Form-Type               | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-types.svg)](https://www.npmjs.com/package/@coding-flow-types)                                     |
| [@coding-flow/flow-icons](https://github.com/codingapi/flow-frontend)              | Form-Icons              | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-icons.svg)](https://www.npmjs.com/package/@coding-flow/flow-icons)                           |
| [@coding-flow/flow-design](https://github.com/codingapi/flow-frontend)             | Flow-Design (PC)        | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-design.svg)](https://www.npmjs.com/package/@coding-flow/flow-design)                         |
| [@coding-flow/flow-approval-presenter](https://github.com/codingapi/flow-frontend) | Flow-Approval-Presenter | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-approval-presenter.svg)](https://www.npmjs.com/package/@coding-flow/flow-approval-presenter) |
| [@coding-flow/flow-pc-ui](https://github.com/codingapi/flow-frontend)              | Flow-PC-UI              | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-ui.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-ui)                           |
| [@coding-flow/flow-pc-form](https://github.com/codingapi/flow-frontend)            | Flow-PC-Form            | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-form.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-form)                       |
| [@coding-flow/flow-pc-approval](https://github.com/codingapi/flow-frontend)        | Flow-PC-Approval        | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-pc-approval.svg)](https://www.npmjs.com/package/@coding-flow/flow-pc-approval)               |
| [@coding-flow/flow-mobile-ui](https://github.com/codingapi/flow-frontend)          | Flow-Mobile-UI          | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-ui.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-ui)                   |
| [@coding-flow/flow-mobile-form](https://github.com/codingapi/flow-frontend)        | Flow-Mobile-Form        | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-form.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-form)               |
| [@coding-flow/flow-mobile-approval](https://github.com/codingapi/flow-frontend)    | Flow-Mobile-Approval    | [![npm](https://img.shields.io/npm/v/@coding-flow/flow-mobile-approval.svg)](https://www.npmjs.com/package/@coding-flow/flow-mobile-approval)       |


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
├── apps/                          # 应用层
│   ├── app-pc/                    # PC 端应用
│   │   └── src/
│   │       ├── pages/             # 页面组件
│   │       ├── api/               # API 接口
│   │       └── config/            # 配置文件
│   └── app-mobile/                # 移动端应用
│       └── src/
│           ├── pages/             # 页面组件
│           ├── api/               # API 接口
│           └── config/            # 配置文件
├── packages/                      # 包层
│   ├── flow-core/                 # 核心框架库（无 UI 组件）
│   │   └── src/
│   │       ├── http.ts            # HTTP 客户端
│   │       ├── hooks.ts           # React Hooks
│   │       ├── presenter.ts       # Presenter 模式
│   │       ├── groovy.ts          # Groovy 脚本工具
│   │       ├── event.ts           # 事件系统
│   │       └── object.ts          # 对象工具
│   ├── flow-types/                # TypeScript 类型定义
│   │   └── src/
│   │       └── types/             # 业务类型定义
│   │           ├── workflow/      # 流程相关类型
│   │           ├── form/          # 表单相关类型
│   │           ├── approval/      # 审批相关类型
│   │           └── design/        # 设计器相关类型
│   └── flow-pc/                   # PC 端组件库集合
│       ├── flow-pc-ui/            # 基础 UI 组件库
│       │   └── src/
│       │       └── components/    # 原子组件
│       ├── flow-pc-form/          # 表单相关组件
│       │   └── src/
│       │       ├── form-designer/ # 表单设计器
│       │       ├── form-render/   # 表单渲染器
│       │       └── field-types/   # 字段类型组件
│       ├── flow-pc-design/        # 流程设计器组件
│       │   └── src/
│       │       ├── design-editor/ # 设计编辑器
│       │       ├── node-config/   # 节点配置面板
│       │       ├── script-editor/ # 脚本编辑器
│       │       └── variable-picker/ # 变量选择器
│       └── flow-pc-approval/      # 审批页面组件
│           └── src/
│               ├── todo-list/     # 待办列表
│               ├── done-list/     # 已办列表
│               ├── approval-detail/ # 审批详情
│               └── approval-form/  # 审批表单
├── package.json                   # 根 package.json
└── pnpm-workspace.yaml            # pnpm workspace 配置
```

## 模块依赖关系

```
flow-core (无UI，基础能力)
    ↑
flow-types (类型定义)
    ↑       ↑
    │       └── flow-pc-form
    │               ↑
    └───────→ flow-pc-design ──→ flow-pc-approval
                    ↑
            flow-pc-ui (基础UI)
```

### 依赖说明

- **flow-core**: 全局框架依赖，只包含与 UI 无关的基础能力（HTTP、状态管理、工具函数等）
- **flow-types**: 全局类型定义，包含流程审批相关的业务类型（手机端和 PC 端共用）
- **flow-pc-ui**: PC 端基础 UI 组件库，提供原子化组件
- **flow-pc-form**: 表单相关功能，依赖 flow-core + flow-types
- **flow-pc-design**: 流程设计器功能，包含节点配置、属性面板、脚本配置等
- **flow-pc-approval**: 审批页面功能，依赖 flow-pc-design + flow-pc-form

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
pnpm run watch:flow-pc-ui
pnpm run watch:flow-pc-form
pnpm run watch:flow-pc-design
pnpm run watch:flow-pc-approval
```

### 构建

```bash
# 构建所有包
pnpm run build

# 构建 PC 端所有组件库
pnpm run build:flow-pc

# 构建特定包
pnpm run build:flow-core          # 核心 API 库
pnpm run build:flow-types         # 类型定义库
pnpm run build:flow-pc-ui         # 基础 UI 组件库
pnpm run build:flow-pc-form       # 表单组件库
pnpm run build:flow-pc-design     # 设计器组件库
pnpm run build:flow-pc-approval   # 审批组件库

# 构建应用
pnpm run build:app-pc
pnpm run build:app-mobile
```

### 测试

```bash
# 运行所有测试
pnpm run test

# 运行特定包的测试
pnpm run test:flow-core
pnpm run test:flow-pc-ui
pnpm run test:flow-pc-form
pnpm run test:flow-pc-design
pnpm run test:flow-pc-approval
```

## 许可证

本项目为 Flow Engine 的前端部分，遵循主项目的 [LICENSE](../LICENSE)。
