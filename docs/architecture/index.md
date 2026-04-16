# Flow Engine 前端架构设计

> **文档编码**：ARCH-001

## 概述

Flow Engine 前端是基于 React 18 + TypeScript 的企业级工作流引擎前端解决方案，采用前后端分离架构，支持 PC 端和移动端客户端。

## 技术栈

- **框架**：React 18、TypeScript（strict 模式）
- **包管理**：pnpm
- **构建工具**：Rsbuild/Rslib
- **PC 端 UI**：Ant Design
- **移动端 UI**：Ant Design Mobile
- **状态管理**：Redux Toolkit
- **流程设计**：Flowgram（流程可视化编辑器）
- **脚本编辑**：CodeMirror

## 模块架构

```
flow-engine (前端根目录)
│
├── packages/                      # 组件库包
│   ├── flow-core/                 # 核心框架库（无 UI 依赖）
│   ├── flow-types/                # 类型定义库
│   ├── flow-icons/                # 图标库
│   ├── flow-approval-presenter/   # 审批展示器框架
│   ├── flow-design/               # 流程设计器组件库
│   ├── flow-pc/                   # PC 端组件库
│   │   ├── flow-pc-ui/           # PC 端基础 UI 组件
│   │   ├── flow-pc-form/         # PC 端表单组件
│   │   └── flow-pc-approval/     # PC 端审批组件
│   └── flow-mobile/               # 移动端组件库
│       ├── flow-mobile-ui/       # 移动端基础 UI 组件
│       ├── flow-mobile-form/     # 移动端表单组件
│       └── flow-mobile-approval/ # 移动端审批组件
│
└── apps/                          # 应用
    ├── app-pc/                    # PC 端应用
    └── app-mobile/                # 移动端应用
```

## 核心模块依赖关系

```
flow-core (无UI，基础框架)
    ↑
    ├── flow-icons (图标库)
    ├── flow-approval-presenter (审批展示器框架)
    │
    └── flow-types (类型定义)
            ↑
            ├── flow-pc-form
            └── flow-mobile-form

flow-pc-ui ──→ flow-pc-form ──→ flow-pc-approval
                                    ↑
                            flow-design ──→ app-pc

flow-mobile-ui ──→ flow-mobile-form ──→ flow-mobile-approval ──→ app-mobile
```

## 模块职责划分

### flow-core

全局框架依赖，只包含与 UI 无关的基础能力：

- HTTP 请求封装
- 状态管理（Redux store 配置）
- 工具函数
- 视图插件机制（ViewBindPlugin）
- Groovy 脚本工具类

### flow-types

全局类型定义，包含流程审批相关的业务类型：

- 流程节点类型定义
- 操作类型定义
- 表单元数据定义
- 审批相关类型定义
- 表单动作接口

### flow-icons

统一的图标组件库，提供流程相关的图标资源。

### flow-approval-presenter

审批展示器框架，基于 Redux 的状态管理：

- ApprovalContext：审批上下文
- ApprovalPresenter：审批业务逻辑处理
- FlowActionPresenter：流程动作处理
- 视图插件接口定义（加签、委派、转办等）

### flow-design

流程设计器功能，包含节点配置、属性面板、脚本配置等：

- 设计器上下文
- 节点组件
- 属性面板
- 脚本编辑器
- 视图插件接口定义（条件配置、异常处理、标题配置等）

### flow-pc-*

PC 端专用组件库，依赖 Ant Design

### flow-mobile-*

移动端专用组件库，依赖 Ant Design Mobile

## 核心机制

### ViewBind 插件机制

ViewBindPlugin 是系统的核心扩展机制，允许业务方注册自定义视图来替代默认实现。

详见：[02-flow-core.md](./02-flow-core.md#viewbind-插件机制)

### Presenter 模式

采用 Presenter 模式处理业务逻辑，通过 Context 与 React 组件通信。

详见：[03-flow-approval-presenter.md](./03-flow-approval-presenter.md)

## 设计原则

1. **依赖方向**：flow-core 无 UI 依赖，flow-types 是类型定义，其他模块按需依赖
2. **视图扩展**：通过 ViewBindPlugin 实现业务定制
3. **状态管理**：审批模块使用 Redux Toolkit 管理状态
4. **命名规范**：文件命名使用小写字母 + 下划线组合
5. **导入规范**：跨模块使用 @/ 路径别名，同模块使用相对路径

## 相关文档

- [02-flow-core.md](./02-flow-core.md) - flow-core 核心框架设计
- [03-flow-types.md](./03-flow-types.md) - flow-types 类型定义设计
- [04-flow-approval-presenter.md](./04-flow-approval-presenter.md) - 审批展示器设计
- [05-flow-design.md](./05-flow-design.md) - 流程设计器设计
- [06-flow-pc-ui.md](./06-flow-pc-ui.md) - PC 端 UI 模块设计
- [07-flow-mobile-ui.md](./07-flow-mobile-ui.md) - 移动端 UI 模块设计
