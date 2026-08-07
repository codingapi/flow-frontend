---
name: flow-design/node-registry
module: flow-design
description: 流程节点注册机制，通过 FlowNodeRegistry 接口定义 19 种节点类型并注册到 Flowgram 固定布局编辑器
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-design"
symbols:
  - FlowNodeRegistry
  - FlowNodeMeta
  - FlowNodeJSON
  - StartNodeRegistry
  - EndNodeRegistry
  - ApprovalNodeRegistry
  - HandleNodeRegistry
  - NotifyNodeRegistry
  - ManualNodeRegistry
  - RouterNodeRegistry
  - TriggerNodeRegistry
  - DelayNodeRegistry
  - SubProcessNodeRegistry
  - ConditionNodeRegistry
  - ParallelNodeRegistry
  - InclusiveNodeRegistry
  - ManualBranchNodeRegistry
  - ConditionBranchNodeRegistry
  - ParallelBranchNodeRegistry
  - InclusiveBranchNodeRegistry
  - ConditionElseBranchNodeRegistry
  - InclusiveElseBranchNodeRegistry
content_hash: 70fe2634bcad42dd771697ff9f520999b4bb6b28cff8f92691fb94aa0fe65666
---

## 解决什么问题

流程设计器需要支持 19 种不同类型的节点，每种节点有不同的元数据（图标、颜色、是否可删除、是否可复制、是否支持分支等）。`FlowNodeRegistry` 提供了一套标准化的节点注册机制：

- 每种节点类型通过统一的接口定义元数据
- 注册到 Flowgram 编辑器的 fixed-layout 系统
- 支持节点（end）、分支块（block）和可分裂节点（dynamicSplit）三种扩展类型

## 如何使用

### 1. FlowNodeRegistry 接口

```typescript
import { FlowNodeRegistry } from "@flowgram.ai/fixed-layout-editor";

// 定义节点注册配置
const MyNodeRegistry: FlowNodeRegistry = {
    type: 'MY_NODE_TYPE',        // 节点类型标识
    extend: 'end' | 'block' | 'dynamicSplit',     // 扩展类型
    info: {                      // 本地扩展必填：图标与描述
        icon: string,
        description: string,
    },
    meta: {
        isStart: boolean,        // 是否为起始节点
        isNodeEnd: boolean,      // 是否为结束节点
        deleteDisable: boolean,  // 禁止删除
        copyDisable: boolean,    // 禁止复制
        addDisable: boolean,     // 禁止添加
        expandable: boolean,     // 是否可展开（start 节点为 false）
        sidebarDisable: boolean,   // 项目扩展：禁止侧栏
        editTitleDisable: boolean, // 项目扩展：禁止编辑标题
    },
    canAdd: (ctx, from) => boolean,      // 项目扩展：是否允许添加
    canDelete: (ctx, from) => boolean,   // 项目扩展：是否允许删除
    onAdd: (ctx, from) => FlowNodeJSON,  // 项目扩展：添加时的自定义处理
};
```

项目本地接口（`typings/node.tsx`）在 Flowgram 原生字段基础上要求必填 `info: { icon, description }`，并在 `meta` 上扩展 `sidebarDisable` / `style` / `editTitleDisable`，同时在注册表上扩展 `canAdd` / `canDelete` / `onAdd` 钩子（如 router 的 `canAdd`、manual-branch 的 `onAdd`）。

`extend` 取值中 `dynamicSplit`（`FlowNodeSplitType.DYNAMIC_SPLIT`）用于可分裂节点（CONDITION / PARALLEL / INCLUSIVE / MANUAL）；END / ROUTER 使用 `extend: 'end'`，分支块使用 `extend: 'block'`。

### 2. 节点类型分类

**主体节点（13 种）：**

| 类型 | type 值 | 说明 |
|------|---------|------|
| 开始节点 | START | 流程入口，不可删除 |
| 结束节点 | END | 流程出口 |
| 审批节点 | APPROVAL | 人工审批 |
| 办理节点 | HANDLE | 人工办理 |
| 通知节点 | NOTIFY | 消息通知 |
| 手动节点 | MANUAL | 手动操作（支持分支） |
| 路由节点 | ROUTER | 条件路由 |
| 触发器节点 | TRIGGER | 事件触发 |
| 延迟节点 | DELAY | 定时延迟 |
| 子流程节点 | SUB_PROCESS | 嵌套子流程 |
| 条件节点 | CONDITION | 条件分支（支持分支） |
| 并行节点 | PARALLEL | 并行执行（支持分支） |
| 包容节点 | INCLUSIVE | 包容分支（支持分支） |

**分支节点（6 种，extend='block'）：**

- `CONDITION_BRANCH` / `CONDITION_ELSE_BRANCH`
- `PARALLEL_BRANCH`
- `INCLUSIVE_BRANCH` / `INCLUSIVE_ELSE_BRANCH`
- `MANUAL_BRANCH`

### 3. 注册到编辑器

```typescript
import { useEditorProps } from "@/components/design-editor/hooks/use-editor-props";

// 收集所有 NodeRegistry 并传入编辑器
const props = useEditorProps(initialData, nodeRegistries);
```

## 使用实例

每个节点目录下有独立的 `index.ts` 或 `index.tsx` 文件定义 Registry 配置（approval、delay、handle、notify、sub-process、trigger 六个目录为 `index.tsx`，其余为 `index.ts`），以及 `form-meta.tsx` 定义节点的表单元数据（策略配置项）。设计器通过 `useEditorProps` 将所有 Registry 注册到 Flowgram 编辑器。
