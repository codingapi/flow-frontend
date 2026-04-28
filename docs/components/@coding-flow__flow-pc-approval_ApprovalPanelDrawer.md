---
module: @coding-flow/flow-pc-approval
name: ApprovalPanelDrawer
description: 流程审批抽屉组件，以 Ant Design Drawer 形式包裹 ApprovalPanel，在侧边抽屉中展示流程审批详情，适用于列表页快速办理审批的场景。
---

# ApprovalPanelDrawer

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要在页面侧边以抽屉形式打开流程审批面板时使用。该组件是对 `ApprovalPanel` 的二次封装，通过 Ant Design 的 `Drawer` 组件提供侧边弹出效果，常用于在待办列表页中点击"办理"按钮后弹出审批面板，无需跳转页面即可完成审批操作。

## 如何引用

```ts
import { ApprovalPanelDrawer } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

Props 类型为 `ApprovalPanelDrawerProps`，继承自 `ApprovalPanelProps`（来自 `@coding-flow/flow-approval-presenter`）并扩展了抽屉相关属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | **必填**，控制抽屉的显示/隐藏 |
| `onClose` | `() => void` | - | **必填**，抽屉关闭时的回调函数 |
| `drawerClassName` | `string` | - | Drawer 根元素的自定义 CSS 类名（对应 `rootClassName`） |
| `recordId` | `string` | - | 流程记录 ID，传入时加载已有审批记录详情（继承自 ApprovalPanelProps） |
| `workflowCode` | `string` | - | 流程设计编码，传入时发起新的流程实例（继承自 ApprovalPanelProps） |
| `initData` | `any` | - | 初始化数据（继承自 ApprovalPanelProps） |
| `review` | `boolean` | - | 是否为预览模式，预览模式下不展示审批操作按钮（继承自 ApprovalPanelProps） |
| `className` | `string` | - | 面板内容容器的自定义 CSS 类名（继承自 ApprovalPanelProps） |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onClose` | `() => void` | 抽屉关闭时触发，同时作为 ApprovalPanel 的关闭回调 |

### Slots / Children

无显式插槽。抽屉内部直接渲染 `ApprovalPanel` 组件。

## 核心行为

### 抽屉配置

- **mask**: 固定为 `false`，不显示遮罩层，允许在抽屉打开时与背景页面交互
- **body 样式**: 抽屉 body 区域的 `padding` 和 `margin` 均设为 0，确保审批面板填满整个抽屉区域
- **样式控制**: `drawerClassName` 对应 Drawer 的 `rootClassName` 属性，用于自定义抽屉外层样式

### 数据流

`ApprovalPanelDrawer` 将所有 Props（包括自身扩展的属性和继承的 `ApprovalPanelProps` 属性）通过 `{...props}` 透传给内部的 `ApprovalPanel` 组件，`onClose` 回调同时服务于抽屉关闭和面板关闭。

### 组件层级

```
ApprovalPanelDrawer
  └── Drawer (Ant Design)
        └── ApprovalPanel
              └── ApprovalLayout
                    ├── Header
                    ├── Body
                    └── Footer (FlowApprovalActions)
```

## 使用示例

```tsx
// 基础用法：在待办列表中办理审批
import { ApprovalPanelDrawer } from '@coding-flow/flow-pc-approval';
import { useState } from 'react';

const TodoList = () => {
    const [open, setOpen] = useState(false);
    const [recordId, setRecordId] = useState('');

    return (
        <>
            <a onClick={() => {
                setRecordId('12345');
                setOpen(true);
            }}>办理</a>

            <ApprovalPanelDrawer
                recordId={recordId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};
```

```tsx
// 发起新流程（通过 workflowCode）
<ApprovalPanelDrawer
    workflowCode="leave-approval"
    open={open}
    onClose={() => setOpen(false)}
    initData={{ applicant: '张三' }}
/>
```

```tsx
// 预览模式查看审批详情
<ApprovalPanelDrawer
    recordId="12345"
    review={true}
    open={open}
    onClose={() => setOpen(false)}
    drawerClassName="my-custom-drawer"
/>
```

## 注意事项

- `open` 和 `onClose` 为必填属性，组件本身不管理显示状态，需由父组件控制
- 抽屉默认不显示遮罩层（`mask={false}`），如需遮罩效果需自行封装
- 抽屉 body 区域的 padding/margin 被强制设为 0，如需自定义内部间距可通过 `className` 属性在 ApprovalPanel 层面控制
- 所有 Props 均通过展开运算符透传给 `ApprovalPanel`，因此 `open` 和 `drawerClassName` 等抽屉专属属性也会传递到 `ApprovalPanel`，但不会影响其功能
