---
module: "@coding-flow/flow-icons"
name: Icon
description: 动态图标组件，根据传入的 type 字符串从 @ant-design/icons 按需加载对应图标，支持加载状态处理和图标不存在时的容错处理。
---

# Icon

- **来源**: 自有
- **所属 module**: @coding-flow/flow-icons

## 何时使用

需要在流程设计器、审批组件等场景中使用 Ant Design 图标时使用。该组件通过传入图标名称字符串动态加载 `@ant-design/icons` 中的图标组件，适合图标类型在运行时才能确定的场景（如后端配置、动态渲染等）。

## 如何引用

```ts
import { Icon } from '@coding-flow/flow-icons';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `string` | - | **必填**，Ant Design 图标组件名称，如 `'HomeOutlined'`、`'UserOutlined'` 等 |
| `style` | `CSSProperties` | `undefined` | 图标的自定义行内样式对象，会传递给底层图标组件 |

### Events / Callbacks

无。

### Slots / Children

无。不接受子元素。

## 核心行为

### 动态加载机制

`Icon` 组件通过 `import("@ant-design/icons")` 动态导入图标库，并根据 `type` 属性从模块中查找对应的图标组件：

1. **加载中**：在图标加载完成前，渲染一个带 `style` 的占位 `<div>`，显示 "Loading..." 文本
2. **加载成功**：将匹配到的图标组件渲染到页面，并将 `style` 透传给图标组件
3. **加载失败**：若 `type` 对应的图标在 `@ant-design/icons` 中不存在，组件返回 `null` 并在控制台输出警告信息

### 生命周期管理

- 当 `type` 变化时，组件通过 `useEffect` 重新加载对应图标
- 组件卸载时通过 `mounted` 标记位防止对已卸载组件执行状态更新，避免内存泄漏

### 容错处理

- 动态导入失败（网络异常等）时，`error` 状态置为 `true`，组件返回 `null`
- 图标名称不存在时，控制台打印 `Icon ${type} not found` 警告

## 使用示例

```tsx
// 基础用法：渲染指定图标
import { Icon } from '@coding-flow/flow-icons';

const App = () => {
    return (
        <Icon type="HomeOutlined" />
    );
};
```

```tsx
// 自定义样式
import { Icon } from '@coding-flow/flow-icons';

const App = () => {
    return (
        <Icon
            type="CheckCircleOutlined"
            style={{ fontSize: 24, color: '#52c41a' }}
        />
    );
};
```

```tsx
// 动态图标：根据后端数据渲染不同图标
import { Icon } from '@coding-flow/flow-icons';
import { useState } from 'react';

const NodeIcon = ({ nodeType }: { nodeType: string }) => {
    const iconMap: Record<string, string> = {
        approval: 'AuditOutlined',
        start: 'PlayCircleOutlined',
        end: 'PoweroffOutlined',
        notify: 'BellOutlined',
    };

    return <Icon type={iconMap[nodeType] || 'QuestionCircleOutlined'} />;
};
```

## 注意事项

- `type` 必须是 `@ant-design/icons` 中实际导出的图标组件名称（如 `'HomeOutlined'`），传入无效名称不会报错但会渲染为空
- 组件内部使用动态 `import()` 加载图标，首次渲染时会有短暂的 "Loading..." 占位状态
- 该组件依赖 `@ant-design/icons`（~6.1.0）作为运行时依赖，使用前需确保已安装该包
- `style` 属性仅在图标加载成功后透传给底层图标组件，加载中的占位元素也会应用该样式
