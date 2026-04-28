---
module: @coding-flow/flow-pc-approval
name: ApprovalPanel
description: 流程审批面板组件，根据 recordId 或 workflowCode 从后端加载流程详情（FlowContent），并以全屏布局展示审批表单、流程历史、操作按钮等内容，内部集成 Redux 状态管理和 MVP 架构。
---

# ApprovalPanel

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要展示流程审批详情页面时使用。该组件根据传入的 `recordId`（查看已有审批记录）或 `workflowCode`（发起新流程）从后端加载流程数据，然后渲染包含 Header、Body、Footer 三段式布局的审批面板，支持表单展示、流程历史查看和审批操作（通过、驳回、转办等）。

## 如何引用

```ts
import { ApprovalPanel } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

Props 类型为 `ApprovalPanelProps`，定义在 `@coding-flow/flow-approval-presenter` 包中：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `recordId` | `string` | - | 流程记录 ID。传入时加载已有审批记录详情 |
| `workflowCode` | `string` | - | 流程设计编码。传入时发起新的流程实例 |
| `initData` | `any` | - | 初始化数据，传递给审批布局组件的初始表单数据 |
| `review` | `boolean` | - | 是否为预览模式。预览模式下不展示审批操作按钮，仅查看详情 |
| `onClose` | `() => void` | - | 关闭面板时的回调函数 |
| `className` | `string` | - | 面板内容容器的自定义 CSS 类名 |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onClose` | `() => void` | 面板关闭时的回调，由内部 Footer 的关闭按钮触发 |

### Slots / Children

无显式插槽。面板内容（Header / Body / Footer）由组件内部自动渲染。

## 核心行为

### 数据加载

组件挂载时，根据 `recordId` 或 `workflowCode` 调用 `detail(id, mockKey)` 接口从后端获取 `FlowContent` 数据。`recordId` 优先使用，若未提供则使用 `workflowCode`。

### 内部布局结构

加载成功后，渲染 `ApprovalLayout` 组件：

- **ApprovalLayout**：由 Redux `Provider` 包裹，内部采用 MVP + Redux 架构
- **Header**：展示流程标题信息
- **Body**：展示审批表单和流程历史记录
- **Footer**：展示审批操作按钮区域（`FlowApprovalActions`）

### Mock 支持

通过 `useMockContext()` 获取 mock 标识，在模拟测试环境下传递给 API 请求，支持模拟流程测试场景。

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `ApprovalPanelProps` | `@coding-flow/flow-approval-presenter` | 组件 Props 类型定义 |
| `FlowContent` | `@coding-flow/flow-types` | 流程审批内容对象，包含记录信息、表单、操作按钮、流程历史等 |
| `ApprovalLayoutProps` | `@coding-flow/flow-approval-presenter` | 内部布局组件的 Props 类型 |

## 使用示例

```tsx
// 基础用法：查看已有审批记录
import { ApprovalPanel } from '@coding-flow/flow-pc-approval';

const App = () => {
    return (
        <ApprovalPanel
            recordId="12345"
            onClose={() => console.log('面板已关闭')}
        />
    );
};
```

```tsx
// 发起新流程
<ApprovalPanel
    workflowCode="leave-approval"
    onClose={() => console.log('面板已关闭')}
/>
```

```tsx
// 预览模式（仅查看，不可操作）
<ApprovalPanel
    recordId="12345"
    review={true}
    onClose={() => console.log('面板已关闭')}
/>
```

```tsx
// 传入初始数据
<ApprovalPanel
    workflowCode="leave-approval"
    initData={{ applicant: '张三', department: '技术部' }}
    className="my-approval-panel"
    onClose={() => {}}
/>
```

## 注意事项

- `recordId` 和 `workflowCode` 至少需要传入一个，组件会优先使用 `recordId`；若都未传入，接口将使用空字符串调用，可能导致请求失败
- 组件内部使用了独立的 Redux Store（`approvalStore`），与外部应用的 Redux Store 隔离
- `review` 属性控制是否隐藏审批操作按钮，设为 `true` 时 Footer 区域的操作按钮将被隐藏
- 组件的数据加载在 `useEffect` 中执行，仅在组件挂载时触发一次（依赖数组为空）
