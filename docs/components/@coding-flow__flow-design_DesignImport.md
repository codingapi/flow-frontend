---
module: @coding-flow/flow-design
name: DesignImport
description: 流程设计导入组件，以 Modal 弹窗形式提供流程设计 JSON 文件的上传与导入能力，支持将导出的流程配置文件重新导入系统。
---

# DesignImport

- **来源**: 自有
- **所属 module**: @coding-flow/flow-design

## 何时使用

需要将外部导出的流程设计文件（JSON 格式）导入到当前系统中时使用。该组件以 Modal 弹窗形式展示，内含文件上传区域，用户选择文件后自动将文件转为 Base64 并调用后端导入接口完成流程配置的恢复。

## 如何引用

```ts
import { DesignImport } from '@coding-flow/flow-design';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | - | **必填**，控制 Modal 弹窗的显示/隐藏 |
| `onClose` | `() => void` | - | **必填**，关闭弹窗时的回调函数（点击取消、点击遮罩或导入成功后触发） |

### Events / Callbacks

无额外事件回调。导入成功后自动调用 `onClose` 关闭弹窗。

### Slots / Children

无显式插槽。弹窗内容由组件内部渲染，包含一个文件上传表单。

## 核心行为

### 内部结构

- **Modal 容器**：使用 Ant Design 的 `Modal` 组件，标题固定为"流程导入"，开启 `destroyOnHidden` 确保关闭后销毁内部状态
- **表单**：使用 Ant Design 的 `Form` 组件，布局为垂直（`vertical`），包含一个文件上传字段
- **Upload 子组件**：自定义的文件上传组件（非 Ant Design 原生 Upload），限制最多上传 1 个文件，仅接受 `.json` 格式。上传后自动将文件转为 Base64 编码字符串

### 导入流程

1. 用户点击"选择文件"按钮，选择 JSON 格式的流程设计文件
2. 文件被读取并转换为 Base64 编码字符串
3. 用户点击"确定"按钮，触发表单提交
4. 表单 `onFinish` 回调将 Base64 字符串传入 `importWorkflow` API 接口
5. 后端处理完成后返回结果，若 `success` 为 `true`，显示"流程已导入成功"提示并关闭弹窗

### 关键依赖

| 依赖 | 说明 |
|------|------|
| `Upload`（内部组件） | 文件上传子组件，将文件转为 Base64 后通过 `onChange` 回调传给表单 |
| `importWorkflow`（API） | 调用 `POST /api/cmd/workflow/import` 接口完成流程导入 |

## 使用示例

```tsx
// 基础用法：打开流程导入弹窗
import { DesignImport } from '@coding-flow/flow-design';
import { useState } from 'react';

const App = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>导入流程</button>
            <DesignImport
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};
```

## 注意事项

- `open` 和 `onClose` 为必填属性，组件本身不管理弹窗的显示状态，需由父组件控制
- Modal 设置了 `destroyOnHidden={true}`，每次关闭后内部表单状态会被销毁，重新打开时表单会被重置
- 文件上传仅接受 `.json` 格式（`accept=".json,application/json"`），且限制最多上传 1 个文件
- 导入成功后会自动关闭弹窗并显示 Ant Design 的 `message.success` 提示
- 导入的文件内容会被转为 Base64 编码后发送到后端，后端负责解析 JSON 内容并恢复流程配置
