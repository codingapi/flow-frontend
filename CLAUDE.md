# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

flow-frontend 是企业级工作流引擎的前端框架，提供可视化流程设计、动态表单配置、多节点类型流转以及脚本扩展功能。采用 pnpm monorepo 架构，支持 PC 端和移动端。后端代码见 https://github.com/codingapi/flow-engine

## 常用命令

```bash
# 安装依赖（使用 pnpm，非 npm）
pnpm install

# 开发模式
pnpm run dev:app-pc       # PC 端应用
pnpm run dev:app-mobile   # 移动端应用
pnpm run watch:flow-core  # 监听模式编译（各包均有 watch 命令）

# 构建
pnpm run build            # 构建所有包
pnpm run build:flow-pc    # 构建 PC 端所有组件库
pnpm run build:flow-mobile # 构建移动端所有组件库
pnpm run build:flow-core  # 构建单个包（各包均有 build:<name> 命令）

# 测试（框架：@rstest/core，环境：jsdom）
pnpm run test             # 运行所有测试
pnpm run test:flow-core   # 运行特定包的测试
pnpm run test:flow-design
pnpm run test:flow-pc     # 运行 PC 端所有测试
pnpm run test:flow-mobile # 运行移动端所有测试

# 运行单个测试文件
cd packages/flow-core && npx rstest tests/unit/xxx.test.ts
```

## 架构

### 模块依赖关系

```
【基础层】
flow-core (无UI：HTTP客户端、Presenter模式、EventBus、ViewBindPlugin、Groovy工具)
    ├──→ flow-types (全局类型定义：FlowForm、FlowAction、NodeType 等)
    ├──→ flow-icons (图标库)
    └──→ flow-approval-presenter (审批展示器框架：Redux 状态管理)

【PC 端】                         【移动端】
flow-pc-ui (antd)                 flow-mobile-ui (antd-mobile)
    └→ flow-pc-form                   └→ flow-mobile-form
         └→ flow-pc-approval               └→ flow-mobile-approval

flow-design (流程设计器，依赖 flow-pc-ui + @flowgram.ai)

app-pc (依赖 flow-design + flow-pc-approval + flow-pc-form)
app-mobile (依赖 flow-mobile-approval + flow-mobile-ui)
```

### 外部依赖（非 workspace 包）

- `@coding-form/form-engine` ^0.0.18 — 表单引擎（FormView、createFormInstance、registerFormItems）
- `@coding-script/script-engine` ^0.0.9 — 脚本引擎（GroovyScriptConvertorUtil）
- `@flowgram.ai/fixed-layout-editor` 1.0.8 — 流程编辑器（FlowNodeRegistry、FlowNodeEntity）

### 核心架构模式

**Presenter 模式** — 业务逻辑与视图分离的核心机制：

- `BasePresenter<S, M>`（flow-core/presenter.ts）：封装 state + dispatch + model 三要素
- `PresenterHooks.create()`（flow-core/hooks.ts）：桥接 Presenter 与 React useState，自动 syncState
- `Dispatch<T>`（flow-core/dispatch.ts）：状态更新函数类型，支持直接赋值和函数式更新
- 各模块通过 `ContextScope` 类封装 Presenter 并注入 React Context

**ViewBindPlugin** — 视图动态绑定（flow-core/view-plugin.ts）：
- 单例模式，通过 `register(name, component)` / `get(name)` 实现组件的运行时注册与获取
- 设计器插件体系通过此机制注册节点视图组件（ConditionViewPlugin、RouterViewPlugin 等）

**ActionFactory** — 动作工厂（flow-pc-approval、flow-mobile-approval、flow-design 各有一份）：
- 单例模式，按 ActionType（PASS/REJECT/SAVE/ADD_AUDIT/DELEGATE/RETURN/TRANSFER/CUSTOM）注册对应 React 组件
- PC 端和移动端各自实现不同的组件

**FlowNodeRegistry** — 节点注册机制（flow-design）：
- 19 种节点类型通过 `FlowNodeRegistry` 接口定义元数据并注册到 Flowgram 编辑器
- 主体节点（Start/End/Approval/Handle/Router/Condition/Parallel 等 13 种）+ 分支节点（block 类型 6 种）

**Redux Store 规范** — 各模块统一遵循的 Store 创建模式：
- `createSlice` + 唯一 `updateState` reducer + `immer.original()` + `Object.assign`
- 详见 `docs/conventions/flow-design/redux-store.md`

### 技术栈

React 18、TypeScript 5、pnpm 10、Rsbuild/Rslib（构建）、@rstest/core（测试）、Ant Design 6（PC）、Ant Design Mobile 5（移动端）、Redux Toolkit 2、Flowgram.ai 1.0.8、CodeMirror 6

## 开发规范

### 禁止自动提交

- **未经用户明确要求，任何情况下不得执行 `git commit` / `git push` / `git merge` 操作**
- 所有代码变更需经用户审核后再提交

### 基本规范

- **与用户沟通及编写文档时，所有内容必须使用中文表述**
- **在每次修改代码以后，要执行本地化的编译验证确保代码没有错误**
- 前端包管理使用 pnpm（根据用户配置）
- 前端文件命名规范：使用小写字母 + 下划线组合（如 `script_editor.tsx`、`variable_picker.tsx`）
- **前端导入规范**：引入当前文件夹下的内容使用 `./` 相对路径，引入其他模块的代码使用 `@/` 路径别名
- **前端样式规范**：组件样式使用 `.module.scss` 模块化方式引入，禁止在 TSX 文件中使用内联 `style` 对象定义样式

### 工程规范（强制）

**模块化：**

- 采用 pnpm monorepo，每个子模块是独立 package，拥有自己的 `package.json` / `tsconfig.json` / `src/` / `tests/`
- 各 package 职责单一，不得循环依赖

**全 TypeScript：**

- 所有源码使用 `.ts` / `.tsx` 文件
- `tsconfig.json` 开启 `strict` 模式
- **禁止滥用 `any`**，类型不确定时使用 `unknown` 或设计更精确的类型

**单元测试：**

- 测试文件放在 `tests/` 目录下，命名 `*.test.ts` / `*.test.tsx`
- 测试框架：`@rstest/core`（详见 TDD 开发规范章节）

**路径别名：**

- 每个 package 内部 `src/` 目录下的依赖一律使用 `@/` alias
- 通过 `tsconfig.json` 的 `paths` 配置 + `rstest.config.ts` 的 `resolve.alias` 配置
- **禁止使用相对路径 `../../` 跨层引用**

```typescript
// ✅ 正确：使用 @/ 路径别名
import { GroovySyntaxConverter } from '@/components/design-editor/script/service/groovy-syntax-converter';

// ✅ 正确：package 内部同级引用用相对路径
import { LocalHelper } from './local-helper';
import { AnotherUtil } from './utils/another-util';

// ❌ 错误：禁止 ../../ 跨层引用
import { SomeUtil } from '../../../src/components/...';
```

**跨 package 依赖：**

- 通过 `workspace:*` 协议声明依赖（如 `"@coding-flow/flow-core": "workspace:*"`）
- import 时使用完整的 package 名称（如 `import { ViewBindPlugin } from "@coding-flow/flow-core"`）
- **不得用相对路径跨 package 引用**

```typescript
// ✅ 正确：使用完整 package 名称
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { FlowForm, FormActionContext } from "@coding-flow/flow-types";

// ❌ 错误：不得用相对路径跨 package 引用
import { SomeUtil } from '../../../packages/flow-core/src/...';
```

### 代码风格

- **Hooks**：函数式定义，遵循 React Hooks 规范
- **Presenter / Manager / Convertor / Factory 等业务类**：使用 `class`，便于扩展和组合
- **简单工具函数**：可用函数式（`export const fn = () => {}`）

### Git 工作流

**代码提交路径：**

```
feature/{task-name}  →  PR  →  dev  →  （用户审核）  →  main
```

- **禁止直接向 main 分支提交**，main 分支由用户手动合并管理
- **dev 分支为集成分支**，所有 PR 的目标分支均为 dev
- **所有代码开发必须在 git worktree 中进行**，不在主工作区直接改代码

### TDD 开发规范

本项目采用 TDD 模式，基于 `@rstest/core` 测试框架（jsdom 环境，jest-dom matchers）。

- 测试文件放在 `tests/` 目录下，命名 `*.test.ts` 或 `*.test.tsx`
- 优先测试核心业务逻辑（Presenter、工具类、转换函数），UI 组件测试可选
- 每个包的 `rstest.config.ts` 配置 `@/` → `src/` 路径别名
- 测试入口统一使用 `rstest.setup.ts` 注入 jest-dom matchers

```typescript
// packages/flow-core/tests/groovy.test.ts
import { describe, expect, it } from '@rstest/core';
import { GroovyScriptConvertorUtil } from "@/groovy";

describe('GroovyScriptConvertorUtil', () => {
    it('getReturnScript', () => {
        const result = GroovyScriptConvertorUtil.getReturnScript('def run() { return 1 + 1 }');
        expect(result).toEqual('1 + 1');
    });
});
```

<!-- PKR-START -->
## PKR 知识查阅（编码前必须）

进入计划模式或实现功能前，**必须按以下优先级查阅**：

### ⚠️ 开发规范（最高优先级，必须严格遵守）

1. [docs/conventions/index.md](./docs/conventions/index.md) — 项目开发规范

**规范具有最高优先级。** 所有代码必须遵循已注册的 Convention，违反规范的代码视为缺陷。
编码前必须逐条检查相关规范，确保命名、结构、模式完全符合要求。

### 已有能力（必须复用，禁止重复实现）

2. [docs/capabilities/index.md](./docs/capabilities/index.md) — 已有可复用能力

已有能力必须复用，禁止重新实现。优先组合已有能力解决问题。

### 计划模式约束

计划方案中必须包含：
1. **遵循了哪些规范** — 列出遵守的 Convention（必须首先说明）
2. **复用了哪些已有能力** — 列出从 PKR 中找到并复用的 Capability
3. **是否有新增能力** — 如果本次开发产生了可复用的新能力，完成后通过 `/pkr-add` 注册

### 知识管理命令

| 命令 | 用途 |
|------|------|
| `/pkr-init` | 扫描项目，发现候选能力和规范（自动跳过已有文档） |
| `/pkr-sync` | 全量同步，对比代码变更 |
| `/pkr-update <module>/<name> [desc]` | 单项更新，可带描述指导更新 |
| `/pkr-add <module>/<name> <desc>` | 从代码/框架扫描注册 |
| `/pkr-add plan <module>/<name> <desc>` | 注册计划中的能力 |
| `/pkr-export <module> ...` | 导出模块文档供其他项目使用 |
<!-- PKR-END -->
