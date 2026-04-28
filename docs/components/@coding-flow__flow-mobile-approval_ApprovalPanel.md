---
module: "@coding-flow/flow-mobile-approval"
name: ApprovalPanel
description: 移动端流程审批面板入口组件，根据流程记录 ID 或流程设计编码加载审批详情内容，并渲染完整的审批布局（头部、表单主体、操作按钮）。
---

# ApprovalPanel

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-approval

## 何时使用

当需要在移动端页面中展示一个完整的流程审批面板时使用。该组件是移动端审批场景的顶层入口，会自动调用后端接口获取流程详情数据（FlowContent），并以 ApprovalLayout 布局渲染整个审批界面，包括审批头部信息、审批表单主体和底部操作按钮区域。

适用于待办审批、已办详情查看、流程预览等移动端场景。

## 如何引用

```ts
import { ApprovalPanel } from '@coding-flow/flow-mobile-approval';
```

## API 说明

### Props

继承自 `ApprovalPanelProps`（定义在 `@coding-flow/flow-approval-presenter`）：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `recordId` | `string` | - | 流程记录 ID，与 `workflowCode` 二选一传入 |
| `workflowCode` | `string` | - | 流程设计编码，与 `recordId` 二选一传入 |
| `initData` | `any` | - | 初始化数据，传入后会透传给内部 ApprovalLayout |
| `onClose` | `() => void` | - | 关闭回调函数 |
| `review` | `boolean` | - | 是否为预览模式。设置为 `true` 时，查看详情但不执行审批操作（隐藏操作按钮） |
| `className` | `string` | - | 自定义 CSS 类名 |

## 使用示例

### 基本用法 - 待办审批

```tsx
import { ApprovalPanel } from '@coding-flow/flow-mobile-approval';

const TodoApprovalPage = () => {
  return (
    <ApprovalPanel
      recordId="12345"
      onClose={() => console.log('面板关闭')}
    />
  );
};
```

### 流程设计预览

```tsx
import { ApprovalPanel } from '@coding-flow/flow-mobile-approval';

const WorkflowPreviewPage = () => {
  return (
    <ApprovalPanel
      workflowCode="leave-approval"
      review={true}
    />
  );
};
```

### 带初始化数据

```tsx
import { ApprovalPanel } from '@coding-flow/flow-mobile-approval';

const ApprovalWithInitData = () => {
  return (
    <ApprovalPanel
      recordId="12345"
      initData={{ field1: '初始值' }}
      onClose={() => {
        // 返回上一页
        history.back();
      }}
    />
  );
};
```

## 注意事项

- `recordId` 和 `workflowCode` 至少传入一个，组件内部会将两者合并为请求参数（`recordId || workflowCode`）来调用后端详情接口。
- 组件内部通过 `useMockContext()` 获取 Mock 上下文键值，用于开发环境的数据模拟。
- 组件依赖 `@coding-flow/flow-approval-presenter` 提供的 Redux Store 和上下文管理，内部自动完成 Store 初始化。
- 该组件是移动端审批面板的顶层入口，内部渲染 `ApprovalLayout`，后者包含 `Header`（审批头部）、`Body`（表单主体）和 `Footer`（操作按钮）三个子模块。
- 当 `review` 为 `true` 时，底部操作按钮区域将被隐藏（仅保留撤销、催办等特殊操作），适用于查看流程详情而非审批操作的场景。
