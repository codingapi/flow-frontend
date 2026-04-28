---
module: @coding-flow/flow-pc-approval
name: WorkflowSelectModal
description: 流程选择弹窗组件，以 Modal 形式展示所有可用的流程定义列表，用户点击按钮选择要发起的流程，适用于发起流程时的流程类型选择场景。
---

# WorkflowSelectModal

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要让用户从多个可用流程中选择一个进行发起时使用。该组件以弹窗形式展示所有已配置的流程定义，每个流程以按钮形式排列，用户点击后触发选择回调并关闭弹窗。常用于"发起流程"入口页面。

## 如何引用

```ts
import { WorkflowSelectModal } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | **必填**，控制弹窗的显示/隐藏 |
| `onClose` | `() => void` | - | **必填**，弹窗关闭时的回调函数（点击遮罩或取消按钮触发） |
| `onSelect` | `(code: string) => void` | - | 选择流程后的回调函数，参数为所选流程的编码（`code`） |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onClose` | `() => void` | 弹窗关闭时触发 |
| `onSelect` | `(code: string) => void` | 用户点击某个流程按钮时触发，参数为流程编码 |

### Slots / Children

无显式插槽。弹窗内容为流程按钮列表，由组件内部根据后端数据自动渲染。

## 核心行为

### 数据加载

组件挂载时自动调用 `options()` 接口获取所有可用的流程定义列表，返回数据格式为 `{ success: boolean, data: { list: Select[] } }`，其中 `Select` 类型包含 `label`（流程名称）和 `value`（流程编码）字段。

### 弹窗配置

- **标题**: 固定为"请选择发起流程"
- **宽度**: 固定为 `45%`
- **footer**: 设为 `false`，不显示底部确认/取消按钮
- **关闭方式**: 点击右上角关闭按钮或遮罩层关闭

### 内容布局

流程选项以 Ant Design `Space` 组件排列，每个选项渲染为一个 `Button`（`type="primary"`），点击按钮触发 `onSelect` 回调并传入对应的流程编码。

## 使用示例

```tsx
// 基础用法
import { WorkflowSelectModal } from '@coding-flow/flow-pc-approval';
import { useState } from 'react';

const App = () => {
    const [open, setOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState('');

    return (
        <>
            <button onClick={() => setOpen(true)}>发起流程</button>

            <WorkflowSelectModal
                open={open}
                onClose={() => setOpen(false)}
                onSelect={(code) => {
                    setSelectedCode(code);
                    setOpen(false);
                    console.log('选择了流程:', code);
                }}
            />
        </>
    );
};
```

```tsx
// 结合 ApprovalPanelDrawer 使用（选择流程后打开审批面板）
const App = () => {
    const [selectVisible, setSelectVisible] = useState(false);
    const [approvalVisible, setApprovalVisible] = useState(false);
    const [workflowCode, setWorkflowCode] = useState('');

    return (
        <>
            <button onClick={() => setSelectVisible(true)}>发起流程</button>

            <WorkflowSelectModal
                open={selectVisible}
                onClose={() => setSelectVisible(false)}
                onSelect={(code) => {
                    setWorkflowCode(code);
                    setSelectVisible(false);
                    setApprovalVisible(true);
                }}
            />

            <ApprovalPanelDrawer
                workflowCode={workflowCode}
                open={approvalVisible}
                onClose={() => setApprovalVisible(false)}
            />
        </>
    );
};
```

## 注意事项

- `open` 和 `onClose` 为必填属性，组件不自行管理显示状态
- `onSelect` 为可选回调，不传时点击流程按钮不会触发任何行为（但弹窗不会自动关闭）
- 流程列表在组件挂载时一次性加载，不提供刷新机制；若流程列表可能变化，需要通过关闭再打开弹窗来重新加载
- 弹窗宽度为 `45%`，在窄屏设备上可能需要考虑响应式适配
