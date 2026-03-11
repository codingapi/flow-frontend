# Flow Frontend

> Flow Engine 企业级流程引擎前端 - 基于 React 18、TypeScript、Rsbuild 的可视化流程设计与审批系统

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

## 开发规范

### 文件命名规范

- 使用小写字母 + 下划线组合（如 `script_editor.tsx`、`variable_picker.tsx`）

### 导入规范

```typescript
// ✅ 正确：使用 @/ 路径别名引入其他模块的代码
import { GroovySyntaxConverter } from '@/components/design-editor/script/service/groovy-syntax-converter';
import { ScriptType } from '@/components/design-editor/typings/groovy-script';

// ✅ 正确：引入当前文件夹下的内容使用相对路径
import { LocalHelper } from './local-helper';
import { AnotherUtil } from './utils/another-util';

// ❌ 错误：避免跨目录使用相对路径
import { GroovySyntaxConverter } from '../../../src/components/...';
```

### 样式规范

- 组件样式使用 `.module.scss` 模块化方式引入
- 禁止在 TSX 文件中使用内联 `style` 对象定义样式

### 面向对象开发规范

TypeScript 代码根据类型和复杂度选择合适的开发风格：

- **Hooks**：使用函数式方式定义，遵循 React Hooks 规范
- **业务处理类**（Service、Context、Converter、Utils 等）：根据复杂度选择，复杂逻辑使用 class 便于扩展和维护，简单功能可用函数式
- **工具函数**：根据场景选择，复杂逻辑使用 class，简单工具可用函数式

## 许可证

本项目为 Flow Engine 的前端部分，遵循主项目的 [LICENSE](../LICENSE)。
