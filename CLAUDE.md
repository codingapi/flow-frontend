# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本项目中工作时提供指导。

## 项目概述

flow-frontend 是一个企业级工作流引擎的前端框架，提供可视化流程设计、动态表单配置、多节点类型流转以及脚本扩展功能。项目采用前后端分离架构，支持 PC 端和移动端客户端。后端代码见 https://github.com/codingapi/flow-engine


### 前端 (React/pnpm)

```bash
# 安装依赖（使用 pnpm，而非 npm）
cd flow-frontend && pnpm install

# 构建所有包
pnpm run build

# 构建 PC 端所有组件库
pnpm run build:flow-pc

# 构建移动端所有组件库
pnpm run build:flow-mobile

# 构建特定包
pnpm run build:flow-core              # 核心框架库
pnpm run build:flow-types             # 类型定义库
pnpm run build:flow-icons             # 图标库
pnpm run build:flow-approval-presenter # 审批展示器框架
pnpm run build:flow-design            # 流程设计器组件库
pnpm run build:flow-pc-ui             # PC 端基础 UI 组件库
pnpm run build:flow-pc-form           # PC 端表单组件库
pnpm run build:flow-pc-approval       # PC 端审批组件库
pnpm run build:flow-mobile-ui         # 移动端基础 UI 组件库
pnpm run build:flow-mobile-form       # 移动端表单组件库
pnpm run build:flow-mobile-approval   # 移动端审批组件库

# 构建特定应用
pnpm run build:app-pc
pnpm run build:app-mobile

# 开发模式
pnpm run dev:app-pc     # PC 端应用
pnpm run dev:app-mobile # 移动端应用
```

## 架构

### 后端分层架构（8 层架构）

1. **工作流层** - 流程定义
2. **节点层** - 19 种节点类型（StartNode、EndNode、ApprovalNode、HandleNode、NotifyNode、ManualNode、RouterNode、SubProcessNode、DelayNode、TriggerNode、ConditionNode、ParallelNode、InclusiveNode 及其分支变体，含 Else 分支节点）
3. **动作层** - 8 种动作类型（Pass、Reject、Save、AddAudit、Delegate、Return、Transfer、Custom）
4. **记录层** - 流程实例记录
5. **会话层** - 会话管理
6. **管理器层** - 业务管理器（NodeStrategyManager、OperatorManager、ActionManager 等）
7. **策略层** - 策略驱动的配置
8. **脚本层** - Groovy 脚本运行时

### 设计模式

- **建造者模式** - WorkflowBuilder、NodeBuilder、FormMetaBuilder
- **工厂模式** - FlowActionFactory
- **策略模式** - NodeStrategy、WorkflowStrategy
- **模板方法模式** - BaseAction、BaseNodeBuilder
- **责任链模式** - 动作执行链
- **组合模式** - 带 blocks 的节点层级结构

### 模块结构

#### 后端模块

| 模块 | 描述 |
|--------|-------------|
| `flow-engine-framework` | 核心工作流引擎框架（节点/动作/策略/脚本/服务） |
| `flow-engine-starter` | Spring Boot 自动配置入口 |
| `flow-engine-starter-api` | REST API 层（FlowRecordController、WorkflowController） |
| `flow-engine-starter-infra` | 持久化层（JPA 实体、8 个仓储实现、达梦方言） |
| `flow-engine-starter-query` | 查询层（FlowRecordQueryController、WorkflowQueryController） |
| `flow-engine-example` | 示例应用（H2/达梦、JWT 认证、端口 8090） |

#### 前端模块（位于 flow-frontend 仓库）

**核心模块**：

| 模块 | 描述 | 依赖 |
|--------|-------------|------|
| `flow-core` | 核心框架库（HTTP、Hooks、Presenter 等），不包含 UI 组件 | 无 |
| `flow-types` | TypeScript 类型定义（流程实例、表单、审批等业务类型） | flow-core |
| `flow-icons` | 图标库 | flow-core |
| `flow-approval-presenter` | 审批展示器框架（基于 Redux 的状态管理） | flow-core, flow-types |
| `flow-design` | 流程设计器组件库（节点配置、属性面板、脚本配置等） | flow-core, flow-types, flow-icons, flow-pc-ui |

**PC 端模块**：

| 模块 | 描述 | 依赖 |
|--------|-------------|------|
| `flow-pc-ui` | PC 端基础 UI 组件库（按钮、输入框等原子组件） | flow-core |
| `flow-pc-form` | PC 端表单组件库（表单设计器、表单渲染等） | flow-core, flow-types |
| `flow-pc-approval` | PC 端审批组件库（待办/已办/审批处理等） | flow-core, flow-types, flow-icons, flow-approval-presenter, flow-pc-ui, flow-pc-form |

**移动端模块**：

| 模块 | 描述 | 依赖 |
|--------|-------------|------|
| `flow-mobile-ui` | 移动端基础 UI 组件库 | flow-core |
| `flow-mobile-form` | 移动端表单组件库 | flow-core, flow-types |
| `flow-mobile-approval` | 移动端审批组件库 | flow-core, flow-types, flow-icons, flow-approval-presenter, flow-mobile-ui, flow-mobile-form |

**前端模块依赖关系**：

```
【基础层】
flow-core (无UI，基础框架)
    ├──→ flow-icons (图标库)
    ├──→ flow-approval-presenter (审批展示器框架)
    ├──→ flow-types (类型定义)
    ├──→ flow-pc-ui (PC 端基础 UI 组件库)
    └──→ flow-mobile-ui (移动端基础 UI 组件库)

【类型定义层】
flow-types (类型定义)
    ├──→ flow-pc-form (PC 端表单组件库)
    └──→ flow-mobile-form (移动端表单组件库)

【PC 端依赖链】
flow-pc-ui
    └──→ flow-pc-form
              └──→ flow-pc-approval (PC 端审批组件库)
                        ├──→ flow-icons
                        └──→ flow-approval-presenter

flow-design (流程设计器)
    ├──→ flow-pc-ui
    ├──→ flow-icons
    └──→ flow-types

app-pc
    ├──→ flow-design
    ├──→ flow-pc-approval
    └──→ flow-pc-form

【移动端依赖链】
flow-mobile-ui
    └──→ flow-mobile-form
              └──→ flow-mobile-approval (移动端审批组件库)
                        ├──→ flow-icons
                        └──→ flow-approval-presenter

app-mobile
    ├──→ flow-mobile-approval
    └──→ flow-mobile-ui
```

**依赖说明**：
- `flow-core` 是最底层模块，所有其他模块都依赖它
- `flow-icons` 和 `flow-approval-presenter` 被 `flow-pc-approval` 和 `flow-mobile-approval` 共用
- `flow-design` 依赖 `flow-pc-ui`（而非 flow-pc-approval），因为设计器使用 PC 端基础 UI 组件
- `app-pc` 直接依赖 `flow-design`、`flow-pc-approval` 和 `flow-pc-form`
- `app-mobile` 直接依赖 `flow-mobile-approval` 和 `flow-mobile-ui`

**模块划分原则**：

- **flow-core**：全局框架依赖，只包含与 UI 无关的基础能力（HTTP、状态管理、工具函数等）
- **flow-types**：全局类型定义，包含流程审批相关的业务类型（移动端和 PC 端共用）
- **flow-icons**：图标库，提供统一的图标组件
- **flow-approval-presenter**：审批展示器框架，基于 Redux 的状态管理
- **flow-design**：流程设计器功能，包含节点配置、属性面板、脚本配置等
- **flow-pc-***：PC 端专用组件库，依赖 Ant Design
- **flow-mobile-***：移动端专用组件库，依赖 Ant Design Mobile

#### 前端应用

| 应用 | 描述 |
|--------|-------------|
| `app-pc` | PC 端应用 |
| `app-mobile` | 移动端应用 |

### 技术栈

- **后端**：Java 17、Spring Boot 3.5.9、Spring Data JPA、Groovy、JJWT、Fastjson 2、Apache Commons、H2/达梦数据库
- **前端**：React 18、TypeScript、pnpm、Rsbuild/Rslib、Ant Design（PC）、Ant Design Mobile（移动端）、Redux Toolkit、Flowgram、CodeMirror

## 关键包

- `com.codingapi.flow.node` - 节点实现（19 种类型）
- `com.codingapi.flow.action` - 动作实现（8 种类型）
- `com.codingapi.flow.strategy` - 策略接口和实现
- `com.codingapi.flow.repository` - 数据访问层
- `com.codingapi.flow.service` - 业务服务层
- `com.codingapi.flow.script` - Groovy 脚本运行时

## 开发规范

### 设计先行

- **开发任何新功能前，必须先在 `docs/architecture/` 下完成架构设计文档，经用户确认后再编码**
- 架构文档包含：系统架构、API 接口、核心组件方案、模块职责划分
- 任务清单见 `docs/todo/`
- 各阶段详细可执行的开发计划见 `docs/plan/`

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
- 设计涉及流程或 UML 图形的解决方案时，使用 Mermaid Markdown 语法
- 在设计计划方案或执行方案过程中，对于代码的设计规划与调整修改要遵循本项目的代码风格和架构设计规则
- 设计的计划要保存到本地的 `docs/` 目录下：
  - `docs/plan/` - 存放详细可执行开发计划，文件命名格式为 `yyyy-mm-dd-标题.md`
  - `docs/architecture/` - 存放架构设计文档
  - `docs/todo/` - 存放阶段任务清单
  - 设计文件（如 `.pen`）可放在 `docs/design/` 目录下

### 工程规范（强制）

**模块化：**

- 采用 pnpm monorepo，每个子模块是独立 package，拥有自己的 `package.json` / `tsconfig.json` / `src/` / `tests/`
- 各 package 职责单一，不得循环依赖

**全 TypeScript：**

- 所有源码使用 `.ts` / `.tsx` 文件
- `tsconfig.json` 开启 `strict` 模式
- **禁止滥用 `any`**，类型不确定时使用 `unknown` 或设计更精确的类型

**单元测试强制：**

- 每个 package 必须有 `tests/unit/` 目录
- 测试文件命名：`*.test.ts` 或 `*.test.tsx`
- CI 失败条件：任一 package 单测不通过 或 关键路径覆盖率下降
- 测试框架：`@rstest/core`

**路径别名：**

- 每个 package 内部 `src/` 目录下的依赖一律使用 `@/` alias
- 通过 `tsconfig.json` 的 `paths` 配置 + `vitest.config.ts` 的 `resolve.alias` 配置
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

- 通过 `workspace:*` 协议声明依赖（如 `"@flow-engine/core": "workspace:*"`）
- import 时使用完整的 package 名称（如 `import { ViewBindPlugin } from "@flow-engine/flow-core"`）
- **不得用相对路径跨 package 引用**

```json
// package.json 示例
{
  "dependencies": {
    "@flow-engine/flow-core": "workspace:*",
    "@flow-engine/flow-types": "workspace:*"
  }
}
```

```typescript
// ✅ 正确：使用完整 package 名称
import { ViewBindPlugin } from "@flow-engine/flow-core";
import { GroovyVariableMapping } from "@flow-engine/flow-types";

// ❌ 错误：不得用相对路径跨 package 引用
import { SomeUtil } from '../../../packages/flow-core/src/...';
```

### 面向对象开发规范

TypeScript 代码根据类型和复杂度选择合适的开发风格：

- **Hooks**：使用函数式方式定义，遵循 React Hooks 规范
- **业务处理类**（Service、Context、Converter、Utils 等）：根据复杂度选择，复杂逻辑使用 class 便于扩展和维护，简单功能可用函数式
- **工具函数**：根据场景选择，复杂逻辑使用 class，简单工具可用函数式

```typescript
// ✅ 正确：Hooks 使用函数式定义
export const useFlowDesigner = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  // ...
  return { nodes, setNodes };
};

// ✅ 正确：复杂业务逻辑使用 class 便于扩展
export class GroovySyntaxConverter {
  private adapters: Map<ScriptType, ScriptAdapter> = new Map();

  public registerAdapter(adapter: ScriptAdapter): void {
    this.adapters.set(adapter.scriptType, adapter);
  }

  public toScript(...): string { ... }
}

// ✅ 正确：简单的工具函数可用函数式
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

// ✅ 正确：简单的业务处理也可用函数式
export const createDefaultMappings = (): GroovyVariableMapping[] => {
  return [...];
};
```

### Git 工作流

**代码提交路径：**

```
feature/{task-name}  →  PR  →  dev  →  （用户审核）  →  main
```

- **禁止直接向 main 分支提交**，main 分支由用户手动合并管理
- **dev 分支为集成分支**，所有 PR 的目标分支均为 dev
- **所有代码开发必须在 git worktree 中进行**，不在主工作区直接改代码

### TDD 开发规范

本项目前端采用 TDD（测试驱动开发）模式，基于 `@rstest/core` 测试框架。

**测试文件位置：**

- 单元测试文件放在 `tests/` 目录下，与源代码同级的 `tests/` 目录中
- 测试文件命名：`*.test.ts` 或 `*.test.tsx`

**测试编写流程：**

1. **Red（红灯）**：先编写测试用例，明确预期行为
2. **Green（绿灯）**：编写最小代码使测试通过
3. **Refactor（重构）**：优化代码结构，运行全部测试确认不回归

**测试用例设计要求：**

- 每个测试用例需明确：测试目标、前置条件、执行步骤、期望断言
- 优先测试核心业务逻辑（Presenter、工具类、转换函数）
- UI 组件测试可选，主要保证核心逻辑的正确性

**测试命令：**

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm test --filter=flow-core
pnpm test --filter=flow-design

# 运行特定测试文件
pnpm test -- xxx.test.ts
```

**示例（基于 flow-core 的 groovy 测试）：**

```typescript
// packages/flow-core/tests/groovy.test.ts
import {describe, expect, it} from '@rstest/core';
import {GroovyScriptConvertorUtil} from "@/groovy";

describe('GroovyScriptUtil', () => {
    describe('getReturnScript', () => {
        it('get groovy script return data', () => {
            const script = `...`;
            const result = GroovyScriptConvertorUtil.getReturnScript(script);
            expect(result).toEqual('expected value');
        });
    });
});
```


