---
module: @coding-flow/flow-design
name: DesignPanel
description: 流程设计属性面板组件，以全屏 Drawer 形式提供流程基本信息、表单设计、流程设计和更多参数四个标签页的编辑能力，内部采用 MVP + Redux 架构管理状态。
---

# DesignPanel

- **来源**: 自有
- **所属 module**: @coding-flow/flow-design

## 何时使用

需要打开流程设计属性面板时使用。该组件以全屏抽屉形式展示，包含流程基本配置（标题、编码、表单定义）、表单字段管理、流程画布编辑及高级参数设置四个功能区域。传入 `id` 加载已有流程，不传 `id` 则创建新流程。

## 如何引用

```ts
import { DesignPanel } from '@coding-flow/flow-design';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `id` | `string` | - | 流程编码。传入时加载已有流程配置，不传时创建新流程 |
| `open` | `boolean` | - | **必填**，控制 Drawer 的显示/隐藏 |
| `onClose` | `() => void` | - | 关闭面板时的回调函数 |
| `drawerClassName` | `string` | - | Drawer 根元素的自定义 CSS 类名 |
| `className` | `string` | - | 面板内容容器的自定义 CSS 类名 |

### Slots / Children

无显式插槽。面板内容（Header / Body / Footer）由组件内部根据状态自动渲染。

## 核心行为

### 内部架构

`DesignPanel` 采用 MVP + Redux 架构：

- **DesignPanelLayout**：Redux Provider + Context Provider 包裹的三段式布局（Header → Body → Footer）
- **Presenter**：业务逻辑层，管理流程 CRUD、表单字段操作、节点管理、状态同步
- **DesignPanelContextScope**：封装 Presenter + Props，对外暴露 `close()`、`save()`、`syncState()`、`initState()`、`getPresenter()` 方法
- **Redux Store**（`designSlice`）：单一 slice，`updateState` reducer 支持对象合并和函数式更新

### 标签页

Header 中的 Tabs 组件控制 Body 区域显示的内容：

| Tab Key | 标签 | 内容 |
|---------|------|------|
| `base` | 基本信息 | 流程标题、备注、编码、表单名称/编码、发起人范围配置 |
| `form` | 表单设计 | 主表字段管理、子表管理、表单导入（通过 `ImportFormViewPlugin` 扩展） |
| `flow` | 流程设计 | 可视化流程画布编辑器 |
| `setting` | 更多参数 | 高级配置 |

### 操作按钮（Header 右侧）

- **保存**：调用 `context.save()` 保存当前流程配置，成功后显示提示
- **版本另存**：通过 Popover 输入版本名称，调用 `context.save(versionName)` 保存为新版本
- **导出**：调用 `exportWorkflow(id)` 导出流程 JSON
- **关闭**：重置状态并触发 `onClose` 回调

### 初始化逻辑

- `id` 存在时：调用 `Presenter.loadDesign(id)` 从后端加载流程数据
- `id` 不存在时：调用 `Presenter.createDesign()` 创建新流程

### 关键内部类型

| 类型 | 说明 |
|------|------|
| `Workflow` | 流程配置（id、title、code、form、operatorCreateScript、strategies、nodes） |
| `FlowNode` | 流程节点（id、name、type、order、actions、strategies、blocks、script、view、display） |
| `State` | 全局状态（view.tabPanel + workflow） |
| `DesignPanelApi` | API 接口契约（create、load、save、createNode），由 `DesignPanelApiImpl` 实现 |
| `TabPanelType` | 标签页类型：`'base' \| 'form' \| 'flow' \| 'setting'` |

## 使用示例

```tsx
// 基础用法：打开已有流程的设计面板
import { DesignPanel } from '@coding-flow/flow-design';
import { useState } from 'react';

const App = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>编辑流程</button>
            <DesignPanel
                id="my-workflow-code"
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};
```

```tsx
// 创建新流程
<DesignPanel
    open={open}
    onClose={() => setOpen(false)}
/>
```

```tsx
// 自定义 Drawer 样式
<DesignPanel
    id="my-workflow-code"
    open={open}
    onClose={() => setOpen(false)}
    drawerClassName="my-custom-drawer"
    className="my-panel-content"
/>
```

## 注意事项

- `open` 为必填属性，组件本身不管理显示状态，需由父组件控制
- 关闭面板时会调用 `presenter.initState()` 重置 Redux 状态到初始值，再触发 `onClose`
- 面板内部使用了独立的 Redux Store（`designStore`），与外部应用的 Redux Store 隔离
- 表单导入功能依赖 `ImportFormViewPlugin` 插件注册（通过 `ViewBindPlugin.register(IMPORT_FORM_VIEW_KEY, component)`），未注册时表单设计页不显示导入按钮
- `Presenter.save()` 在保存前会通过 `FormActionContext` 收集所有注册表单的当前值并合并到 workflow 数据中
