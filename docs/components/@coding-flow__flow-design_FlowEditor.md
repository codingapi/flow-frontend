---
module: @coding-flow/flow-design
name: FlowEditor
description: 流程可视化画布编辑器组件，基于 @flowgram.ai/fixed-layout-editor 提供固定布局的流程节点编排能力，支持 19 种节点类型的拖拽、连线、属性编辑、版本管理及自动保存。
---

# FlowEditor

- **来源**: 自有
- **所属 module**: @coding-flow/flow-design

## 何时使用

需要在流程设计面板中嵌入可视化流程画布编辑器时使用。该组件提供基于固定布局（纵向）的流程节点编排画布，支持节点的增删改、分支管理、撤销/重做、缩略图导航、版本切换等功能。通常在 `DesignPanel` 的"流程设计"标签页中作为核心画布使用。

## 如何引用

```ts
import { FlowEditor } from '@coding-flow/flow-design';
```

## API 说明

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `actionRef` | `React.Ref<FlowEditorAction>` | - | 命令式操作引用，用于获取画布数据或重置画布 |
| `initialData` | `FlowDocumentJSON` | 默认初始数据（包含开始和结束节点） | 画布初始数据，包含节点列表 |

### FlowEditorAction 接口

通过 `actionRef` 暴露的命令式方法：

| 方法 | 类型 | 说明 |
|------|------|------|
| `getData` | `() => FlowDocumentJSON` | 获取当前画布的 JSON 数据（包含所有节点） |
| `resetData` | `(data: FlowDocumentJSON) => void` | 重置画布数据。若传入数据为空或无节点，则恢复为默认初始数据 |

### 关键类型

| 类型 | 说明 |
|------|------|
| `FlowDocumentJSON` | `{ nodes: FlowNodeJSON[] }`，画布文档的 JSON 结构 |
| `FlowNodeJSON` | 继承自 `@flowgram.ai/fixed-layout-editor` 的 `FlowNodeJSONDefault`，扩展了 `data.title`、`data.actions`、`data.order` 等字段 |
| `FlowNodeRegistry` | 继承自 `FlowNodeRegistryDefault`，扩展了 `meta`（侧边栏禁用、样式、标题编辑禁用）、`info`（图标和描述）、`canAdd`/`canDelete`/`onAdd` 钩子 |

### Events / Callbacks

无显式事件回调。组件内部通过 `useEditorProps` Hook 配置画布行为，包括拖拽回调、历史记录变更回调等。

### Slots / Children

无显式插槽。画布内容（工具栏、节点、侧边栏）由组件内部根据注册表和插件自动渲染。

## 核心行为

### 内部架构

`FlowEditor` 采用分层架构：

- **FixedLayoutEditorProvider**：由 `@flowgram.ai/fixed-layout-editor` 提供的固定布局编辑器上下文，管理画布状态、节点引擎、变量引擎等
- **EditorRenderer**：画布渲染器，负责绘制节点和连线
- **EditorTools**：工具栏组件，提供缩放、适应视图、缩略图、只读切换、撤销/重做、下载等功能
- **EditorVersion**：版本管理组件，显示当前版本数量并支持版本切换

### 画布配置（useEditorProps）

通过 `useEditorProps` Hook 配置画布的全部行为：

| 配置项 | 说明 |
|--------|------|
| `background` | 启用画布背景 |
| `playground` | 画布交互配置，启用鼠标交互，阻止 Mac 浏览器手势翻页 |
| `readonly` | 默认 `false`，非只读模式 |
| `defaultLayout` | 固定为纵向固定布局（`VERTICAL_FIXED_LAYOUT`） |
| `history` | 启用撤销/重做，监听节点数据变更，防抖 100ms 后自动调用 `presenter.syncNodes()` 同步到 DesignPanel 的 Presenter |
| `nodeEngine` | 启用节点引擎，支持节点内表单渲染 |
| `variableEngine` | 启用变量引擎 |
| `scroll` | 启用滚动限制，防止节点滚动出可视范围 |

### 支持的节点类型（19 种）

通过 `FlowNodeRegistries` 注册以下节点类型：

| 节点类型 | 注册名称 | 说明 |
|----------|----------|------|
| `START` | StartNodeRegistry | 开始节点 |
| `END` | EndNodeRegistry | 结束节点 |
| `APPROVAL` | ApprovalNodeRegistry | 审批节点 |
| `HANDLE` | HandleNodeRegistry | 处理节点 |
| `NOTIFY` | NotifyNodeRegistry | 通知节点 |
| `MANUAL` | ManualNodeRegistry | 人工节点 |
| `ROUTER` | RouterNodeRegistry | 路由节点 |
| `SUB_PROCESS` | SubProcessNodeRegistry | 子流程节点 |
| `DELAY` | DelayNodeRegistry | 延时节点 |
| `TRIGGER` | TriggerNodeRegistry | 触发器节点 |
| `CONDITION` | ConditionNodeRegistry | 条件分支节点 |
| `CONDITION_BRANCH` | ConditionBranchNodeRegistry | 条件分支子节点 |
| `CONDITION_ELSE_BRANCH` | ConditionElseBranchNodeRegistry | 条件 Else 分支节点 |
| `PARALLEL` | ParallelNodeRegistry | 并行节点 |
| `PARALLEL_BRANCH` | ParallelBranchNodeRegistry | 并行分支子节点 |
| `INCLUSIVE` | InclusiveNodeRegistry | 包容节点 |
| `INCLUSIVE_BRANCH` | InclusiveBranchNodeRegistry | 包容分支子节点 |
| `INCLUSIVE_ELSE_BRANCH` | InclusiveElseBranchNodeRegistry | 包容 Else 分支节点 |
| `MANUAL_BRANCH` | ManualBranchNodeRegistry | 人工分支子节点 |

### 自定义渲染组件

| 组件 | 用途 |
|------|------|
| `BaseNode` | 替代默认节点渲染器，点击节点时打开右侧属性侧边栏 |
| `Adder` | 节点之间的"+"按钮，点击弹出节点选择列表 |
| `BranchAdder` / `BranchAdderRender` | 分支添加按钮，通过 Presenter 创建新分支节点 |
| `Collapse` | 折叠/展开控制组件 |

### 插件系统

| 插件 | 说明 |
|------|------|
| `createMinimapPlugin` | 缩略图插件，在右下角显示画布全局缩略图 |
| `createDownloadPlugin` | 下载插件，支持将画布导出为图片 |
| `createPanelManagerPlugin` | 面板管理插件，注册 `nodeFormPanelFactory` 实现点击节点时弹出右侧属性面板 |

### 工具栏功能（EditorTools）

| 工具 | 说明 |
|------|------|
| `Interactive` | 交互模式切换 |
| `SwitchVertical` | 纵向布局切换 |
| `ZoomSelect` | 缩放比例选择 |
| `FitView` | 适应视图（自动调整画布使所有节点可见） |
| `MinimapSwitch` | 缩略图开关 |
| `Minimap` | 缩略图面板 |
| `Readonly` | 只读模式切换 |
| `Undo` / `Redo` | 撤销/重做 |
| `DownloadTool` | 下载画布图片 |

### 版本管理（EditorVersion）

- 通过 `useVersionPresenter` Hook 初始化 `VersionPresenter`
- 监听 `VersionChangeEvent` 事件（通过 `EventBus`），事件触发时刷新版本列表
- 显示版本总数按钮，点击弹出版本列表 Popover
- 支持切换版本、修改版本名称、删除版本等操作

### 侧边栏（SidebarRenderer）

- 通过 `nodeFormPanelFactory` 注册为面板管理器的右侧面板
- 点击节点时自动打开，宽度 400px
- 支持自动关闭：失去选中、只读模式切换、节点被删除时自动关闭侧边栏
- 使用 `IsSidebarContext` 区分侧边栏内渲染和画布内渲染

### 自动保存

`history.onApply` 配置了防抖（100ms）的自动保存回调：
1. 监听画布数据变更
2. 调用 `ctx.document.toJSON()` 获取最新数据
3. 调用 `presenter.syncNodes(data.nodes)` 将节点数据同步到 DesignPanel 的 Presenter

### 与 DesignPanel 的集成

`FlowEditor` 通过 `useDesignContext` 获取 DesignPanel 的上下文：
- 获取 `presenter` 实例用于节点同步和创建
- 获取 `state.workflow.id` 用于版本管理

## 使用示例

```tsx
// 基础用法：使用默认初始数据
import { FlowEditor } from '@coding-flow/flow-design';
import { useRef } from 'react';

const App = () => {
    const editorRef = useRef<FlowEditorAction>(null);

    const handleSave = () => {
        const data = editorRef.current?.getData();
        console.log('当前画布数据：', data);
    };

    const handleReset = () => {
        editorRef.current?.resetData({
            nodes: [
                { id: 'start', type: 'START', data: { title: '开始节点' } },
                { id: 'end', type: 'END', data: { title: '结束节点' } },
            ],
        });
    };

    return (
        <>
            <button onClick={handleSave}>获取数据</button>
            <button onClick={handleReset}>重置画布</button>
            <FlowEditor actionRef={editorRef} />
        </>
    );
};
```

```tsx
// 使用自定义初始数据
<FlowEditor
    initialData={{
        nodes: [
            { id: 'start', type: 'START', data: { title: '开始' } },
            { id: 'approval1', type: 'APPROVAL', data: { title: '审批节点' } },
            { id: 'end', type: 'END', data: { title: '结束' } },
        ],
    }}
/>
```

```tsx
// 在 DesignPanel 中使用（典型集成场景）
// FlowEditor 通常在 DesignPanel 的流程设计标签页中使用
// 无需手动传入 initialData，由 DesignPanel 的 Presenter 管理数据
<FlowEditor actionRef={editorActionRef} />
```

## 注意事项

- `FlowEditor` 是一个重型组件，依赖 `@flowgram.ai/fixed-layout-editor` 及其插件生态
- 组件默认使用纵向固定布局（`VERTICAL_FIXED_LAYOUT`），不支持动态切换为横向布局
- `actionRef` 为可选属性，若需要外部获取画布数据或重置画布时才需传入
- 未传 `initialData` 时，默认只包含一个开始节点和一个结束节点
- `resetData` 传入空数据或无节点的数据时，会自动恢复为默认初始数据（开始+结束节点）
- 自动保存功能通过防抖（100ms）实现，避免频繁触发后端同步
- 版本管理依赖 `EventBus` 的 `VersionChangeEvent` 事件，需确保事件正确触发
- 侧边栏宽度固定为 400px，由 `nodeFormPanelFactory.defaultSize` 配置
- 组件内部使用了 Ant Design 的 `theme.useToken()` 获取主题色，确保与 Ant Design 主题一致
