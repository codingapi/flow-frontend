---
module: @coding-flow/flow-pc-approval
name: FlowMock
description: 流程模拟测试组件，提供完整的模拟审批测试环境，包含待办、已办、抄送、全部流程四个标签页，支持发起流程、办理审批、查看详情等操作，适用于开发调试和功能演示。
---

# FlowMock

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-approval

## 何时使用

需要进行流程审批功能的模拟测试或演示时使用。该组件提供完整的模拟审批环境，集成待办列表、已办列表、抄送列表和全部流程列表四个标签页，支持发起新流程、办理待办审批、查看审批详情以及催办、撤回等操作。适用于开发阶段的端到端测试和功能演示。

## 如何引用

```ts
import { FlowMock } from '@coding-flow/flow-pc-approval';
```

## API 说明

### Props

无。该组件不接受任何 Props。

### Events / Callbacks

无。

### Slots / Children

无。

## 核心行为

### 内部架构

`FlowMock` 组件采用 Presenter 模式管理模拟状态：

1. **useMockPresenter**: 自定义 Hook，创建 `FlowMockPresenter` 实例，管理模拟环境的 mock 标识（`mockKey`）
2. **FlowMockContext.Provider**: 来自 `@coding-flow/flow-approval-presenter`，将 `mockKey` 注入到子组件树中，所有 API 请求都会携带该标识
3. **MockTodoPage**: 核心页面组件，包含完整的模拟测试界面

### MockTodoPage 功能

组件内部渲染 `MockTodoPage`，提供以下功能标签页：

| 标签页 Key | 标签 | 数据来源 API | 说明 |
|-----------|------|-------------|------|
| `todo` | 我的待办 | `todo(request, mockKey)` | 显示当前用户待办审批列表，操作列显示"办理"按钮 |
| `done` | 我的已办 | `done(request, mockKey)` | 显示已完成的审批记录，操作列显示"详情"按钮 |
| `notify` | 我的抄送 | `notify(request, mockKey)` | 显示抄送给当前用户的流程记录 |
| `all` | 全部流程 | `list(request, mockKey)` | 显示所有流程记录 |

### 表格列

模拟列表的表格包含以下列：

| 字段 | 标题 | 说明 |
|------|------|------|
| `recordId` | 编号 | 流程记录 ID |
| `processId` | 流程编码 | 流程定义编码 |
| `title` | 流程名称 | 通过 `FlowTitle` 渲染，支持富文本 |
| `readTime` | 读取状态 | 显示"已读"或"未读" |
| `nodeName` | 节点名称 | 当前所处节点名称 |
| `createTime` | 创建时间 | 格式化为 YYYY-MM-DD HH:mm:ss |
| `currentOperatorName` | 审批人 | 当前审批人姓名 |
| `recordState` | 状态 | 显示"已办"或"待办" |
| `option` | 操作 | 待办显示"办理"，其他显示"详情" |

### 操作按钮

页面顶部右侧提供两个操作按钮：

- **发起流程**: 打开 `WorkflowSelectModal` 选择流程后，通过 `ApprovalPanelDrawer` 发起新流程
- **关闭模拟**: 调用 `presenter.cleanMock()` 清理模拟数据，然后调用 `window.close()` 关闭窗口

### 模拟标识管理

- `FlowMockPresenter` 在初始化时生成唯一的 `mockKey`（字符串类型）
- 该 `mockKey` 通过 `FlowMockContext` 传递给所有子组件
- 所有 API 请求都会携带 `mockKey` 参数，后端据此识别为模拟请求
- 组件卸载时自动调用 `cleanMock()` 清理服务端模拟数据

## 使用示例

```tsx
// 基础用法：直接渲染模拟测试页面
import { FlowMock } from '@coding-flow/flow-pc-approval';

const MockPage = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <FlowMock />
        </div>
    );
};
```

```tsx
// 作为路由页面使用
import { FlowMock } from '@coding-flow/flow-pc-approval';

const routes = [
    {
        path: '/mock',
        element: <FlowMock />,
    },
];
```

## 注意事项

- 该组件无 Props，所有配置和数据加载均在内部自动完成
- 关闭模拟时会调用 `window.close()` 尝试关闭浏览器窗口，仅在由脚本打开的窗口中有效
- 组件卸载时会自动清理服务端模拟数据（`cleanMock()`），确保测试数据不会残留
- 模拟环境中的所有 API 请求都携带 `mockKey`，后端需要支持 mock 参数以区分正式数据和测试数据
- 内部使用了 `FlowTitle`、`WorkflowSelectModal`、`ApprovalPanelDrawer` 等组件，形成了完整的模拟审批链路
