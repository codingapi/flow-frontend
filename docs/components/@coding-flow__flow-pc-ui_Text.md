---
module: "@coding-flow/flow-pc-ui"
name: Text
description: 文本省略组件，基于 Ant Design Typography.Text 封装，支持保留末尾指定字符数并显示完整内容的 tooltip 提示，适用于长文本截断展示场景。
---

# Text

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-ui

## 何时使用

需要展示可能超长的文本并保留末尾部分字符时使用。该组件自动将文本截断，保留最后 N 个字符作为后缀显示在省略号之后，并在鼠标悬停时通过 tooltip 展示完整文本。适合用于文件名、编码、标题等需要保留末尾关键信息的文本展示场景。

## 如何引用

```ts
import { Text } from '@coding-flow/flow-pc-ui';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `suffixCount` | `number` | - | **必填**，保留末尾的字符数 |
| `children` | `string` | - | **必填**，要展示的完整文本内容 |

### Events / Callbacks

无

### Slots / Children

| 插槽 | 说明 |
|------|------|
| `children` | 完整文本内容（仅接受 `string` 类型） |

## 核心行为

### 文本截断逻辑

1. 将 `children` 文本分为两部分：
   - **前半部分**（`start`）：从开头到 `children.length - suffixCount` 的子串
   - **后半部分**（`suffix`）：最后 `suffixCount` 个字符（去除首尾空格）
2. 前半部分使用 Ant Design `Typography.Text` 的 `ellipsis` 功能进行省略展示
3. 后半部分作为 `ellipsis.suffix` 始终显示在省略号之后
4. 鼠标悬停时 tooltip 显示完整原始文本

### Typography.Text 配置

- 最大宽度：`100%`（`maxWidth: '100%'`）
- 省略配置：`{ suffix, tooltip: children }`

## 使用示例

```tsx
// 基础用法：保留末尾 4 个字符
import { Text } from '@coding-flow/flow-pc-ui';

const FileNameList = () => {
    return (
        <div>
            <Text suffixCount={4}>
                这是一个非常长的文件名用于测试文本截断效果document.pdf
            </Text>
        </div>
    );
};
```

```tsx
// 展示流程编码：保留末尾 6 位编码
import { Text } from '@coding-flow/flow-pc-ui';

const FlowCodeDisplay = () => {
    return (
        <Text suffixCount={6}>
            WORKFLOW-2024-APPROVAL-LEAVE-REQUEST-001234
        </Text>
    );
};
```

```tsx
// 在表格列中使用
import { Table } from 'antd';
import { Text } from '@coding-flow/flow-pc-ui';

const columns = [
    {
        title: '流程标题',
        dataIndex: 'title',
        render: (text: string) => <Text suffixCount={4}>{text}</Text>,
    },
];
```

## 注意事项

- `children` 必须为 `string` 类型，不支持传入 `ReactNode`
- `suffixCount` 必填且应大于 0，否则前半部分将等于完整文本，后缀为空
- 后缀部分会通过 `.trim()` 去除首尾空格
- 组件内部使用 `children.slice(-suffixCount)` 获取后缀，当 `suffixCount` 大于等于文本长度时，后缀将占据全部文本
- tooltip 始终显示完整的原始 `children` 文本，不受 `suffixCount` 影响
