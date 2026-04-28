---
module: "@coding-flow/flow-mobile-approval"
name: FlowApprovalActions
description: 移动端流程审批操作按钮区域组件，渲染审批动作按钮（通过、驳回、转办等），支持主操作按钮、自定义样式按钮以及"更多操作"弹出面板。
---

# FlowApprovalActions

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-approval

## 何时使用

当需要在移动端审批页面底部展示流程操作按钮时使用。该组件负责渲染所有可用的审批动作按钮，包括内置的 8 种动作类型（通过、驳回、保存、加签、转办、委派、退回、自定义）以及撤销和催办等特殊操作。

当操作按钮数量超过 3 个时，自动将多余按钮收纳到"更多操作"弹出面板中，保持界面简洁。

## 如何引用

```ts
import { FlowApprovalActions } from '@coding-flow/flow-mobile-approval';
```

## API 说明

### Props

该组件不接受任何 Props，其数据完全来源于上下文：

| 数据来源 | 说明 |
|----------|------|
| `useApprovalContext()` | 获取 Redux 审批状态和审批上下文，读取 `state.flow` 中的合并状态、操作按钮列表等数据 |
| `useLayoutPresenter()` | 获取布局展示器实例，通过 `LayoutPresenter` 计算按钮分组（主操作 / 更多操作）及显示逻辑 |

### 内部依赖的动作类型

组件通过 `ActionFactory` 工厂类渲染不同类型的动作按钮，支持以下 8 种内置动作：

| 动作类型 | 说明 |
|----------|------|
| `PASS` | 通过 |
| `REJECT` | 驳回 |
| `SAVE` | 保存 |
| `ADD_AUDIT` | 加签 |
| `DELEGATE` | 委派 |
| `RETURN` | 退回 |
| `TRANSFER` | 转办 |
| `CUSTOM` | 自定义 |

此外还包含以下特殊操作按钮：

| 组件 | 说明 |
|------|------|
| `RevokeAction` | 撤销操作 |
| `UrgeAction` | 催办操作 |

## 使用示例

### 在审批布局中使用（作为 Footer 内容）

```tsx
import { FlowApprovalActions } from '@coding-flow/flow-mobile-approval';
import { useApprovalContext } from '@coding-flow/flow-approval-presenter';

const ApprovalFooter = () => {
  return (
    <div style={{ padding: '10px' }}>
      <FlowApprovalActions />
    </div>
  );
};
```

### 与 ApprovalContext 配合

```tsx
import { ApprovalLayout } from '@coding-flow/flow-mobile-approval';
import { Provider } from 'react-redux';
import { approvalStore } from '@coding-flow/flow-approval-presenter';

// ApprovalLayout 内部已集成 FlowApprovalActions
// 当 ApprovalPanel 加载流程数据后，Footer 区域会自动渲染 FlowApprovalActions
const App = () => {
  return (
    <Provider store={approvalStore}>
      <ApprovalLayout
        content={flowContent}
        onClose={() => {}}
      />
    </Provider>
  );
};
```

## 注意事项

- 该组件必须在 `ApprovalContext` 上下文中使用，否则 `useApprovalContext()` 会抛出异常。
- 组件通过 `LayoutPresenter` 管理按钮展示策略：前 3 个操作按钮作为主按钮直接展示，超过 3 个时多余的按钮收入"更多操作" ActionSheet 弹出面板中。
- 在预览模式（`review` 为 `true`）下，自定义样式按钮和"更多操作"按钮将被隐藏，仅保留撤销和催办等特殊操作。
- 当流程处于合并审批状态（`state.flow.mergeable` 为 `true`）时，点击操作按钮前会校验是否已选择待审批流程，未选择时会弹出提示"请先选择审批流程"。
- 操作按钮的点击事件通过 `EventBus` 事件总线分发，使用 `action.id` 作为事件标识，由各具体动作组件监听处理。
