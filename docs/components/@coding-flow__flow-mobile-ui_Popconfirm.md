---
module: @coding-flow/flow-mobile-ui
name: Popconfirm
description: 移动端确认弹窗组件，基于 antd-mobile ActionSheet 实现，点击触发元素后弹出操作面板进行二次确认操作。
---

# Popconfirm

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-ui

## 何时使用

当需要在移动端对某个操作进行二次确认时使用。该组件包裹在触发元素外部，点击触发元素后会弹出一个 ActionSheet 操作面板，显示标题和确认按钮，用户可以选择确认或取消操作。适用于删除、提交等需要用户明确确认的场景。

## 如何引用

```ts
import { Popconfirm } from '@coding-flow/flow-mobile-ui';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | **必填**，确认弹窗的标题文本，显示在 ActionSheet 的 `extra` 区域 |
| `onConfirm` | `() => void` | - | 用户点击"确认"按钮时的回调函数 |
| `children` | `React.ReactNode` | - | 触发弹窗的内容元素，点击该区域会弹出确认面板 |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onConfirm` | `() => void` | 用户在 ActionSheet 中点击"确认"按钮时触发 |

### Slots / Children

- `children`：触发弹窗显示的内容区域，通常为一个按钮或其他可点击元素。

## 核心行为

- 组件内部通过 `useState` 管理 ActionSheet 的显示/隐藏状态
- 点击 `children` 区域时设置 `visible` 为 `true`，弹出 ActionSheet
- ActionSheet 自动提供"取消"按钮（`cancelText='取消'`），点击取消或遮罩层时关闭面板
- ActionSheet 的 `actions` 列表固定包含一个"确认"操作项（`{text: '确认', key: 'ok'}`）

## 使用示例

```tsx
// 基础用法：删除确认
import { Popconfirm } from '@coding-flow/flow-mobile-ui';

const DeleteButton = () => {
    const handleConfirm = () => {
        console.log('执行删除操作');
    };

    return (
        <Popconfirm
            title="确定要删除吗？"
            onConfirm={handleConfirm}
        >
            <button>删除</button>
        </Popconfirm>
    );
};
```

```tsx
// 包裹自定义元素
<Popconfirm
    title="确认提交？"
    onConfirm={() => {
        submitForm();
    }}
>
    <div className="submit-area">
        <span>点击提交</span>
    </div>
</Popconfirm>
```

## 注意事项

- `title` 为必填属性，不能为空
- 组件基于 antd-mobile 的 `ActionSheet` 实现，需确保项目已安装 `antd-mobile` 依赖
- 组件自行管理显示/隐藏状态，父组件无需额外控制
- 当前 ActionSheet 的 `actions` 列表中只包含"确认"操作，不支持自定义操作按钮文案
