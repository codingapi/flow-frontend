---
module: @coding-flow/flow-mobile-ui
name: TextIcon
description: 移动端文字图标组件，将文本前两个字符显示在圆形蓝色背景中，常用于头像、流程节点图标等场景。
---

# TextIcon

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-ui

## 何时使用

当需要在移动端展示一个基于文字的圆形图标时使用。该组件将传入文本的前两个字符截取后显示在一个蓝色圆形背景中，适用于用户头像、流程节点图标、分类标识等需要文字缩略图展示的场景。

## 如何引用

```ts
import { TextIcon } from '@coding-flow/flow-mobile-ui';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | - | **必填**，要显示的文本内容，组件会截取前两个字符显示；为空时显示默认字符"待" |

### Slots / Children

无。该组件不接受子元素。

## 核心行为

- 组件读取 `text` 属性，截取前两个字符（`text.slice(0, 2)`）进行显示
- 当 `text` 为空（`null`、`undefined`、空字符串）时，默认显示"待"字
- 图标为固定尺寸的圆形：宽高均为 `40px`，圆角 `20px`（即正圆）
- 背景色固定为 `#1890ff`（antd 主色调蓝色）
- 文字颜色为白色（`#fff`），字号 `16px`，居中显示

## 样式规格

| 属性 | 值 |
|------|------|
| 尺寸 | 40 x 40 px |
| 圆角 | 20px（圆形） |
| 背景色 | `#1890ff` |
| 文字颜色 | `#fff` |
| 字号 | 16px |
| 最大显示字符数 | 2 |

## 使用示例

```tsx
// 基础用法：显示用户头像缩略
import { TextIcon } from '@coding-flow/flow-mobile-ui';

const UserList = () => {
    return (
        <div>
            <TextIcon text="张三" />      {/* 显示 "张三" */}
            <TextIcon text="李四丰" />     {/* 显示 "李四" */}
            <TextIcon text="审批中" />     {/* 显示 "审批" */}
        </div>
    );
};
```

```tsx
// 流程节点图标
const FlowNode = ({ name }: { name: string }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TextIcon text={name} />
            <span>{name}</span>
        </div>
    );
};
```

```tsx
// 空值场景：显示默认字符 "待"
<TextIcon text="" />       {/* 显示 "待" */}
<TextIcon text={undefined} /> {/* 显示 "待" */}
```

## 注意事项

- 组件使用内联样式定义外观，不支持通过 props 自定义样式、颜色或尺寸
- 背景色固定为 `#1890ff`，如需其他颜色需在项目中自行实现类似组件
- 图标尺寸固定为 `40px`，不支持响应式或自定义大小
- 当 `text` 为空值时会显示默认字符"待"，适用于"待审批"等场景
