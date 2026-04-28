---
module: "@coding-flow/flow-pc-ui"
name: Panel
description: 居中内容面板组件，基于 Ant Design Flex 封装，提供左右各 10% 边距的垂直居中布局容器，适用于表单、详情页等内容区域的居中展示。
---

# Panel

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-ui

## 何时使用

需要将内容在页面中居中展示，并保持左右两侧各 10% 边距时使用。该组件提供垂直方向的弹性布局容器，适合用作表单页面、详情页面、审批页面等主体内容区域的布局容器。

## 如何引用

```ts
import { Panel } from '@coding-flow/flow-pc-ui';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `React.ReactNode` | - | 面板内部的内容 |

### Events / Callbacks

无

### Slots / Children

| 插槽 | 说明 |
|------|------|
| `children` | 面板主体内容区域，内部以垂直弹性布局排列 |

## 核心行为

### 布局结构

组件内部使用 Ant Design `Flex` 组件实现：

- **方向**：垂直布局（`vertical={true}`）
- **对齐**：主轴居中（`justify='center'`）
- **左右边距**：各 10%（`marginLeft: '10%'`，`marginRight: '10%'`）
- **内容宽度**：自动占据 80% 的可用宽度

## 使用示例

```tsx
// 基础用法：居中展示表单内容
import { Panel } from '@coding-flow/flow-pc-ui';

const FormPage = () => {
    return (
        <Panel>
            <h2>审批表单</h2>
            <div>表单内容区域</div>
        </Panel>
    );
};
```

```tsx
// 配合 CardForm 组件使用
import { Panel } from '@coding-flow/flow-pc-ui';
import { CardForm } from '@coding-flow/flow-pc-ui';

const ApprovalPage = () => {
    return (
        <Panel>
            <CardForm title="基本信息" onFinish={(values) => console.log(values)}>
                {/* 表单项 */}
            </CardForm>
        </Panel>
    );
};
```

## 注意事项

- 组件左右边距固定为 10%，不支持通过 Props 自定义，如需调整可通过外部 CSS 覆盖
- 内部使用 `Flex` 垂直布局，子元素默认纵向排列
- 该组件为纯布局容器，不包含任何业务逻辑
