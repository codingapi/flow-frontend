---
module: @coding-flow/flow-pc-approval
name: FlowApprovalActions
description: 流程审批操作按钮组组件，根据当前流程状态动态渲染审批操作按钮（通过、驳回、转办等），并内置催办、撤回、关闭三个通用操作按钮，通过 ActionFactory 工厂模式映射操作类型到对应组件。
---

# FlowApprovalActions

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要在审批面板底部展示审批操作按钮时使用。该组件从审批上下文中读取当前流程的操作列表（`actions`），通过 `ActionFactory` 将操作类型映射为对应的按钮组件，并额外渲染催办、撤回、关闭三个通用操作按钮。仅在非预览模式（`review=false`）下显示流程操作按钮。

## 如何引用

```ts
import { FlowApprovalActions } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

无。该组件不接受任何 Props，所有数据从 `@coding-flow/flow-approval-presenter` 的审批上下文中获取。

### Events / Callbacks

无显式回调。组件内部通过 Presenter 处理操作逻辑。

### Slots / Children

无。

## 核心行为

### 数据来源

组件通过 `useApprovalContext()` 从审批上下文中获取：

- **state.flow.actions**: 当前流程可用的操作列表（`FlowAction[]`），来自后端 `FlowContent` 数据
- **state.review**: 是否为预览模式
- **context**: 审批上下文对象，用于获取 Presenter 和执行操作

### 操作按钮渲染逻辑

1. **流程操作按钮**: 遍历 `actions` 数组，通过 `ActionFactory.getInstance().getFlowActionComponent(action)` 获取对应的操作组件并渲染
2. **通用操作按钮**: 在流程操作按钮之后，固定渲染 `UrgeAction`、`RevokeAction`、`CloseAction` 三个通用操作

### ActionFactory 操作类型映射

`ActionFactory` 使用单例模式，内部维护操作类型到组件的映射：

| 操作类型 | 组件 | 说明 |
|---------|------|------|
| `PASS` | `PassAction` | 通过审批 |
| `REJECT` | `RejectAction` | 驳回审批 |
| `SAVE` | `SaveAction` | 保存草稿 |
| `ADD_AUDIT` | `AddAuditAction` | 加签 |
| `DELEGATE` | `DelegateAction` | 委派 |
| `TRANSFER` | `TransferAction` | 转办 |
| `RETURN` | `ReturnAction` | 退回 |
| `CUSTOM` | `CustomAction` | 自定义操作 |

### 通用操作按钮

| 组件 | 显示条件 | 行为 |
|------|---------|------|
| `UrgeAction` | `state.flow.urge === true` | 催办当前流程审批人，需二次确认 |
| `RevokeAction` | `state.flow.revoke === true` | 撤回已提交的流程，需二次确认 |
| `CloseAction` | 始终显示 | 关闭审批面板（调用 `context.close()`） |

### 合并审批校验（handlerClickCheck）

点击流程操作按钮前，组件会执行前置校验：

- 若当前流程支持合并审批（`state.flow.mergeable === true`）
- 检查是否已选择审批记录或填写表单数据
- 若两者均为空，则提示"请先选择审批流程."并阻止操作

### 插件扩展支持

催办、撤回、关闭三个通用操作按钮均支持通过 `ViewBindPlugin` 进行自定义替换：

- `UrgeAction` 检查 `APPROVAL_ACTION_URGE_KEY` 插件
- `RevokeAction` 检查 `APPROVAL_ACTION_REVOKE_KEY` 插件
- `CloseAction` 检查 `APPROVAL_ACTION_CLOSE_KEY` 插件

若注册了对应插件，则渲染插件提供的自定义组件，而非默认实现。

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `FlowAction` | `@coding-flow/flow-types` | 流程操作对象（id、title、type、display、enable、script） |
| `FlowActionProps` | 内部定义 | 操作组件 Props（action: FlowAction, onClickCheck?: (actionId: string) => boolean） |

## 使用示例

```tsx
// 基础用法：在审批面板 Footer 中使用
// FlowApprovalActions 通常在 ApprovalLayout 的 Footer 中自动渲染
// 无需手动调用，以下展示其在内部的使用方式

import { FlowApprovalActions } from '@coding-flow/flow-pc-approval';

const Footer = () => {
    return (
        <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0' }}>
            <FlowApprovalActions />
        </div>
    );
};
```

```tsx
// 预览模式下：FlowApprovalActions 不渲染流程操作按钮
// 仅渲染 UrgeAction、RevokeAction、CloseAction 三个通用按钮
// （通用按钮本身根据 flow.urge/flow.revoke 条件控制显示）
```

## 注意事项

- 该组件必须在 `ApprovalContext.Provider` 内部使用，否则 `useApprovalContext()` 会抛出异常
- 预览模式下（`review=true`），流程操作按钮不会渲染，但通用操作按钮（催办、撤回、关闭）仍会显示
- `UrgeAction` 和 `RevokeAction` 分别根据 `flow.urge` 和 `flow.revoke` 字段控制是否显示
- `CloseAction` 始终渲染，可通过注册 `APPROVAL_ACTION_CLOSE_KEY` 插件替换默认行为
- 操作按钮的点击校验（`handlerClickCheck`）仅在流程支持合并审批时生效
- `ActionFactory` 为单例模式，操作类型映射在构造时初始化，运行时不可动态修改
