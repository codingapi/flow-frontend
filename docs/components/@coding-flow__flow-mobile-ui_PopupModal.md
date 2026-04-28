---
module: @coding-flow/flow-mobile-ui
name: PopupModal
description: 移动端底部弹出模态框组件，基于 antd-mobile Popup 实现，提供标题栏和取消/确定操作按钮，适用于筛选、选择等需要弹出面板的场景。
---

# PopupModal

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-ui

## 何时使用

当需要在移动端展示一个从底部弹出的模态面板时使用。该组件基于 antd-mobile 的 Popup 组件封装，自带标题栏（包含取消和确定按钮），内容区域高度占视口的 40%。适用于筛选条件选择、表单填写、信息展示等需要临时弹出面板的场景。

## 如何引用

```ts
import { PopupModal } from '@coding-flow/flow-mobile-ui';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | **必填**，控制模态框的显示/隐藏状态 |
| `onClose` | `() => void` | - | 关闭模态框时的回调函数，点击"取消"按钮、点击遮罩层或 Popup 关闭时触发 |
| `onOk` | `() => void` | - | 点击"确定"按钮时的回调函数 |
| `title` | `string` | - | 模态框标题文本，显示在标题栏中间位置 |
| `children` | `React.ReactNode` | - | 模态框的内容区域，显示在标题栏下方 |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onClose` | `() => void` | 点击"取消"按钮、点击遮罩层或 Popup 触发关闭时调用 |
| `onOk` | `() => void` | 点击标题栏右侧"确定"按钮时调用 |

### Slots / Children

- `children`：模态框的主体内容区域，可放置任意自定义内容，如列表、表单、筛选器等。

## 核心行为

- 组件基于 antd-mobile 的 `Popup` 组件封装，从屏幕底部弹出
- 弹出面板的 `bodyStyle` 高度固定为 `40vh`（视口高度的 40%）
- 标题栏为三栏式布局：左侧"取消"链接、中间标题文本、右侧"确定"链接
- 点击遮罩层（`onMaskClick`）会触发 `onClose` 回调
- `open` 属性由父组件控制，组件本身不管理显示状态

## 使用示例

```tsx
// 基础用法：筛选面板
import { PopupModal } from '@coding-flow/flow-mobile-ui';
import { useState } from 'react';

const FilterPage = () => {
    const [open, setOpen] = useState(false);

    const handleOk = () => {
        console.log('确认筛选条件');
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>打开筛选</button>
            <PopupModal
                open={open}
                title="筛选条件"
                onOk={handleOk}
                onClose={handleClose}
            >
                <div>筛选内容区域</div>
            </PopupModal>
        </>
    );
};
```

```tsx
// 不带标题
<PopupModal
    open={open}
    onClose={() => setOpen(false)}
    onOk={() => {
        handleSave();
        setOpen(false);
    }}
>
    <div>自定义内容</div>
</PopupModal>
```

## 注意事项

- `open` 为必填属性，组件本身不管理显示状态，需由父组件通过 state 控制
- 组件基于 antd-mobile 的 `Popup` 组件实现，需确保项目已安装 `antd-mobile` 依赖
- 面板高度固定为 `40vh`，不支持通过 props 自定义高度
- 标题栏中的"取消"和"确定"按钮文案目前不支持自定义
- 点击"取消"按钮不会自动关闭弹窗，需要在 `onClose` 回调中手动设置 `open` 为 `false`
