---
module: @coding-flow/flow-pc-approval
name: FlowTitle
description: 流程标题渲染组件，用于将后端返回的 HTML 格式流程标题安全地渲染为 DOM 内容，支持富文本标题展示。
---

# FlowTitle

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要展示流程标题且标题可能包含 HTML 标签时使用。该组件接收一个 HTML 字符串形式的标题内容，通过 `dangerouslySetInnerHTML` 将其渲染为 DOM，适用于后端返回的流程标题包含加粗、颜色等富文本样式的场景。

## 如何引用

```ts
import { FlowTitle } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | **必填**，HTML 格式的流程标题字符串，将直接作为 innerHTML 渲染 |

### Events / Callbacks

无。

### Slots / Children

无。

## 核心行为

该组件功能单一，接收 `title` 字符串，通过 React 的 `dangerouslySetInnerHTML` 属性将其渲染为 HTML 内容。不做任何额外的样式处理或数据转换。

### 典型使用场景

在审批列表（如模拟测试页面的待办/已办表格）中，流程的 `title` 字段可能包含 HTML 标签（如 `<span style="color:red">紧急</span> 请假申请`），使用 `FlowTitle` 可以正确渲染这些富文本内容。

## 使用示例

```tsx
// 基础用法
import { FlowTitle } from '@coding-flow/flow-pc-approval';

const App = () => {
    return (
        <FlowTitle title="<b>请假申请</b> - 张三" />
    );
};
```

```tsx
// 在表格列中渲染流程标题
import { FlowTitle } from '@coding-flow/flow-pc-approval';
import { Table } from 'antd';

const columns = [
    {
        dataIndex: 'title',
        title: '流程名称',
        render: (value) => <FlowTitle title={value} />,
    },
];

<Table columns={columns} dataSource={data} />
```

```tsx
// 渲染带样式的标题
<FlowTitle title='<span style="color:#f50">紧急</span> 加班审批 - 李四' />
```

## 注意事项

- 该组件使用 `dangerouslySetInnerHTML` 渲染 HTML 内容，请确保传入的 `title` 值来自可信来源（如后端系统），避免 XSS 攻击风险
- `title` 为必填属性，传入空字符串时组件会渲染一个空的 `<div>` 元素
- 组件不做任何 XSS 过滤或 HTML 清理，由调用方保证数据安全性
