---
module: "@coding-flow/flow-pc-ui"
name: Drawer
description: 全屏抽屉组件，基于 Ant Design Drawer 封装，默认隐藏标题栏和关闭图标，关闭时自动销毁内容，适用于全屏编辑、详情展示等场景。
---

# Drawer

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-ui

## 何时使用

需要以全屏抽屉形式展示内容时使用。该组件预设为全屏（`size="100%"`）、无标题栏、无关闭图标，关闭后自动销毁内部 DOM，适合用作全屏编辑面板、流程设计器容器、详情查看面板等场景。

## 如何引用

```ts
import { Drawer } from '@coding-flow/flow-pc-ui';
```

## API 说明

### Props

继承 Ant Design `DrawerProps`，以下为组件内预设的固定行为及可覆盖属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | 控制抽屉的显示/隐藏 |
| `onClose` | `() => void` | - | 关闭抽屉时的回调函数 |
| `children` | `React.ReactNode` | - | 抽屉内部的内容 |
| `title` | `React.ReactNode` | `false` | 组件内固定为 `false`（不显示标题），可通过 `{...props}` 覆盖 |
| `size` | `'default' \| 'large' \| string` | `"100%"` | 组件内固定为 `"100%"`（全屏），可通过 `{...props}` 覆盖 |
| `closeIcon` | `React.ReactNode \| false` | `false` | 组件内固定为 `false`（不显示关闭图标），可通过 `{...props}` 覆盖 |
| `destroyOnHidden` | `boolean` | `true` | 组件内固定为 `true`（关闭时销毁 DOM） |

> **注意**：由于组件先设置固定属性再通过 `{...props}` 展开，父组件传入的同名属性会覆盖内部预设值。

### 继承属性

该组件继承 Ant Design `DrawerProps` 的所有属性，如 `placement`、`width`、`height`、`mask`、`maskClosable`、`className`、`style` 等。详见 [Ant Design Drawer API](https://ant.design/components/drawer#api)。

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onClose` | `() => void` | 点击遮罩层或按下 ESC 键等触发关闭时的回调 |

### Slots / Children

| 插槽 | 说明 |
|------|------|
| `children` | 抽屉主体内容区域 |

## 使用示例

```tsx
// 基础用法：全屏抽屉
import { Drawer } from '@coding-flow/flow-pc-ui';
import { useState } from 'react';

const App = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>打开抽屉</button>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <div>全屏内容区域</div>
            </Drawer>
        </>
    );
};
```

```tsx
// 配合表单使用
import { Drawer } from '@coding-flow/flow-pc-ui';
import { useState } from 'react';

const EditPanel = () => {
    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <h2>编辑表单</h2>
            {/* 表单内容 */}
        </Drawer>
    );
};
```

## 注意事项

- 组件默认全屏展示（`size="100%"`），不显示标题栏和关闭图标，需要通过 `open` 属性由父组件控制显示/隐藏
- `destroyOnHidden` 默认为 `true`，每次关闭抽屉都会销毁内部 DOM，重新打开时内容会重新渲染
- 组件先设置预设属性（`title`、`size`、`closeIcon`、`destroyOnHidden`），再通过 `{...props}` 展开，因此父组件传入的同名属性会覆盖预设值
