---
module: @coding-flow/flow-pc-form
name: FlowTable
description: 合并流程表格组件，以 Ant Design Table 形式展示多条待合并的流程记录，支持行选择、记录查看切换和表单详情展示。适用于多条流程记录合并审批场景。
---

# FlowTable

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-form

## 何时使用

需要在合并审批场景中以表格形式展示多条流程记录时使用。该组件展示所有待合并记录的数据表格，支持通过复选框选择要合并的记录，点击"查看"可切换到单条记录的表单详情视图。

## 如何引用

```ts
import { FlowTable } from '@coding-flow/flow-pc-form';
```

## API 说明

### Props

Props 类型为 `FlowTableProps`（定义于组件内部 `@/components/table/types`）：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `formList` | `FormData[]` | - | **必填**，合并表单操控对象列表，每项包含 `form`（表单实例）和 `data`（待办数据） |
| `initData` | `any` | - | 初始化数据，会被合并到表格数据源中作为默认值 |
| `meta` | `FlowForm` | - | **必填**，表单元数据对象，定义表单字段结构，字段会映射为表格列 |
| `onValuesChange` | `(values: any) => void` | - | 表单数据更新事件回调，在切换查看某条记录详情时触发 |
| `fieldPermissions` | `FieldPermission[]` | - | **必填**，表单字段权限配置，传递给内部 FlowFormView 使用 |
| `review` | `boolean` | - | **必填**，是否预览模式，传递给内部 FlowFormView 使用 |
| `onMergeRecordIdsSelected` | `(recordIds: number[]) => void` | - | 合并流程选中记录时的回调，当用户勾选表格行时触发 |

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `FormData` | `@coding-flow/flow-types` | 合并表单操作数据，包含 `form: FormInstance` 和 `data: FlowTodo` |
| `FlowForm` | `@coding-flow/flow-types` | 表单元数据，包含 `name`、`code`、`fields: FormField[]`、`subForms: FlowForm[]` |
| `FieldPermission` | `@coding-flow/flow-types` | 字段权限，包含 `formCode`、`fieldCode`、`type: 'READ' \| 'WRITE' \| 'HIDDEN'` |

### Events / Callbacks

| 事件 | 触发时机 | 参数 |
|------|----------|------|
| `onValuesChange` | 切换到某条记录的详情视图时触发 | `values: any`（当前记录的表单值） |
| `onMergeRecordIdsSelected` | 用户勾选/取消勾选表格行时触发（仅当有选中项时） | `recordIds: number[]`（选中行的 recordId 数组） |

## 核心行为

### 内部架构

`FlowTable` 内部使用 MVP 模式：

- **TableFormPresenter**：业务逻辑层，管理表格列生成、数据源构建和按 recordId 查询表单数据
- **useTableFormPresenter**：Hook，通过 `useRef` 保持 Presenter 实例稳定，避免重复创建

### 表格列生成

由 `TableFormPresenter.getColumns()` 自动生成，列结构为：

| 列 | dataIndex | 说明 |
|----|-----------|------|
| 编号 | `recordId` | 记录 ID |
| 流程标题 | `title` | 流程标题 |
| 流程提交人 | `submitOperatorName` | 提交人姓名 |
| 流程发起人 | `createdOperatorName` | 发起人姓名 |
| 动态字段列 | `field.code` | 根据 `meta.fields` 中定义的字段动态生成 |
| 操作 | - | 固定列，包含"查看"链接 |

### 数据源构建

`TableFormPresenter.getDatasource(initData)` 遍历 `formList`，将每条记录的表单值、待办数据、提交人信息和 `initData` 合并为一行数据。

### 视图切换

- **默认状态**：显示表格视图，展示所有记录
- **查看详情**：点击"查看"后，隐藏表格，显示对应记录的表单详情视图和"返回"按钮
- **返回**：点击"返回"按钮，恢复表格视图

### 行选择

表格支持 `checkbox` 多选，选中行变化时通过 `onMergeRecordIdsSelected` 回调通知父组件。

## 使用示例

```tsx
// 基础用法：合并审批场景
import { FlowTable } from '@coding-flow/flow-pc-form';

const formList = [
    { form: formInstance1, data: todoData1 },
    { form: formInstance2, data: todoData2 },
    { form: formInstance3, data: todoData3 },
];

const meta = {
    name: '报销表单',
    code: 'expense-form',
    fields: [
        { id: '1', name: '金额', code: 'amount', type: 'number', dataType: 'NUMBER', hidden: false, required: true },
        { id: '2', name: '事由', code: 'reason', type: 'input', dataType: 'STRING', hidden: false, required: false },
    ],
    subForms: [],
};

<FlowTable
    formList={formList}
    meta={meta}
    fieldPermissions={[]}
    review={false}
    onMergeRecordIdsSelected={(ids) => {
        console.log('选中的记录 ID:', ids);
    }}
    onValuesChange={(values) => {
        console.log('当前查看记录的表单值:', values);
    }}
/>
```

```tsx
// 带初始数据的合并表格
<FlowTable
    formList={formList}
    initData={{ batchNo: 'BATCH-001' }}
    meta={meta}
    fieldPermissions={[]}
    review={true}
/>
```

## 注意事项

- `formList`、`meta`、`fieldPermissions`、`review` 为必填属性
- 表格数据源由 `formList` 中每条记录的表单值与待办数据合并而成，确保每条记录的 `data.recordId` 唯一
- `onMergeRecordIdsSelected` 回调仅在 `recordIdList.length > 0` 时触发，即至少选中一条记录
- 点击"查看"进入详情视图后，会立即触发 `onValuesChange`，参数为该记录表单的当前值
- 内部依赖 `antd` 的 `Table`、`Button`、`Flex` 组件和 `@ant-design/icons` 的 `CaretLeftOutlined` 图标
- `TableFormPresenter` 通过 `useRef` 保持实例稳定，`meta` 和 `formList` 变化时不会自动更新 Presenter 实例
