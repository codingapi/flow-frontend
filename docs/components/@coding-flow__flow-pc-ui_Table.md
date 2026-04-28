---
module: "@coding-flow/flow-pc-ui"
name: Table
description: 数据表格组件，基于 Ant Design Table 封装，内置分页、远程数据请求和工具栏渲染能力，适用于需要服务端分页的标准列表页面。
---

# Table

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-ui

## 何时使用

需要展示带有服务端分页的数据列表时使用。该组件内置了远程数据请求、分页管理和工具栏渲染能力，将 Ant Design Table 包裹在 Card 容器中，提供开箱即用的列表页面体验。适合用于审批记录列表、流程实例列表、用户管理等标准 CRUD 页面。

## 如何引用

```ts
import { Table } from '@coding-flow/flow-pc-ui';
```

## API 说明

### Props

继承 Ant Design `TableProps<RecordType>`，以下为扩展属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `actionType` | `React.Ref<ActionType>` | - | 组件命令式操作引用，可通过 `ref.current.reload()` 刷新表格数据 |
| `request` | `(params: ParamRequest) => Promise<Result<any>>` | - | 远程数据请求函数，传入时启用服务端分页；不传时分页配置为 `false` |
| `toolBarRender` | `() => React.ReactElement[]` | - | 工具栏渲染函数，返回的元素显示在表格右上角 |
| `columns` | `ColumnsType<RecordType>` | - | 继承自 Ant Design Table，列配置 |
| `dataSource` | `any[]` | - | 当使用 `request` 时由组件内部管理，不建议同时传入 |
| `pagination` | `false \| TablePaginationConfig` | - | 当使用 `request` 时组件自动生成分页配置；也可传入自定义分页配置覆盖 |

### 继承属性

该组件继承 Ant Design `TableProps<RecordType>` 的所有属性，如 `columns`、`rowKey`、`rowSelection`、`loading`、`scroll`、`onChange` 等。详见 [Ant Design Table API](https://ant.design/components/table#api)。

### 核心类型

| 类型 | 定义 | 说明 |
|------|------|------|
| `ParamRequest` | `{ current: number; pageSize: number; [key: string]: any }` | 请求参数，包含分页信息和自定义扩展字段 |
| `Result<T>` | `{ data: T[]; total: number; success: boolean }` | 请求结果，包含数据列表、总条数和成功标识 |
| `ActionType` | `{ reload(): void }` | 命令式操作接口，`reload` 方法重置到第 1 页并重新请求数据 |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `request` | `(params: ParamRequest) => Promise<Result<any>>` | 远程数据请求回调，组件自动调用并处理分页 |

### Slots / Children

无显式插槽。工具栏通过 `toolBarRender` 函数渲染。

## 核心行为

### 数据请求流程

1. 组件挂载时自动调用 `request({ current: 1, pageSize: 10 })` 加载首页数据
2. 切换页码或每页条数时，自动调用 `request` 并传入新的分页参数
3. `request` 返回 `Result` 对象后，组件自动更新 `dataSource` 和分页状态

### 分页配置

当传入 `request` 时，组件自动生成分页配置：
- 默认当前页：1
- 默认每页条数：10
- 启用页码快速跳转（`showQuickJumper: true`）
- 启用每页条数切换（`showSizeChanger: true`）
- 分页变化时自动重新请求数据

当不传 `request` 时，分页配置为 `false`（不显示分页）。

### 工具栏

工具栏区域位于 Card 容器内表格上方右侧，通过 `toolBarRender` 渲染，适合放置"新增"、"导出"等操作按钮。

## 使用示例

```tsx
// 基础用法：带远程分页的数据表格
import { Table } from '@coding-flow/flow-pc-ui';
import type { ParamRequest, Result } from '@coding-flow/flow-core';
import { Button } from 'antd';

const UserList = () => {
    const columns = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '年龄', dataIndex: 'age', key: 'age' },
        { title: '地址', dataIndex: 'address', key: 'address' },
    ];

    const fetchData = async (params: ParamRequest): Promise<Result<any>> => {
        const res = await fetch(`/api/users?current=${params.current}&pageSize=${params.pageSize}`);
        const data = await res.json();
        return { data: data.list, total: data.total, success: true };
    };

    return (
        <Table
            rowKey="id"
            columns={columns}
            request={fetchData}
            toolBarRender={() => [<Button key="add" type="primary">新增</Button>]}
        />
    );
};
```

```tsx
// 使用 ref 刷新表格
import { Table } from '@coding-flow/flow-pc-ui';
import { useRef } from 'react';
import type { ActionType } from '@coding-flow/flow-core';

const OrderList = () => {
    const actionRef = useRef<ActionType>();

    return (
        <div>
            <button onClick={() => actionRef.current?.reload()}>刷新</button>
            <Table
                actionType={actionRef}
                columns={columns}
                request={fetchOrders}
            />
        </div>
    );
};
```

## 注意事项

- 当传入 `request` 时，`dataSource` 由组件内部管理，不建议外部同时传入 `dataSource`
- `actionType` 的 `reload()` 方法会重置分页到第 1 页（`current=1, pageSize=10`），而非刷新当前页
- 组件内部使用 `React.useImperativeHandle` 暴露 `reload` 方法，依赖 `total`、`current`、`pageSize` 三个状态作为依赖项
- 表格外层包裹了一个 Card 组件，自带卡片容器样式
