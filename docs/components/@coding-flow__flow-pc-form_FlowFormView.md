---
module: @coding-flow/flow-pc-form
name: FlowFormView
description: 流程表单视图组件，根据是否可合并（mergeable）自动切换为单表单渲染或多条记录表格展示。单表单模式下基于 @coding-form/form-engine 的 FormView 渲染流程表单字段。
---

# FlowFormView

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-form

## 何时使用

需要渲染流程审批场景中的表单视图时使用。该组件支持两种模式：单表单模式（传入 `form` 实例直接渲染表单字段）和合并模式（`mergeable` 为 `true` 时切换为 FlowTable 表格展示多条待合并的流程记录）。

## 如何引用

```ts
import { FlowFormView } from '@coding-flow/flow-pc-form';
```

## API 说明

### Props

Props 类型为 `FormViewProps`（定义于 `@coding-flow/flow-types`）：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mergeable` | `boolean` | - | **必填**，是否为合并流程模式。为 `true` 时渲染 FlowTable 表格视图，为 `false` 时渲染单表单视图 |
| `form` | `FormInstance` | - | 表单操控对象，单表单模式下必填 |
| `data` | `FlowTodo` | - | 待办数据，单表单模式下传入当前流程待办信息 |
| `formList` | `FormData[]` | `[]` | 合并表单操控对象列表，`mergeable` 为 `true` 时使用 |
| `initData` | `any` | - | 初始化数据，传递给子表单或表格作为默认值 |
| `meta` | `FlowForm` | - | **必填**，表单元数据对象，定义表单字段结构（名称、编码、类型等） |
| `onValuesChange` | `(values: any) => void` | - | 表单数据更新事件回调，表单失焦或切换记录时触发 |
| `fieldPermissions` | `FieldPermission[]` | - | **必填**，表单字段权限配置，为空时全部字段可写 |
| `review` | `boolean` | - | **必填**，是否预览模式，为 `true` 时表单只读 |
| `onMergeRecordIdsSelected` | `(recordIds: number[]) => void` | - | 合并流程选中记录时的回调，仅在合并模式下生效 |

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `FormInstance` | `@coding-flow/flow-types` | 表单实例对象，提供 `getFieldValue`、`getFieldsValue`、`setFieldsValue`、`submit` 等方法 |
| `FlowForm` | `@coding-flow/flow-types` | 表单元数据，包含 `name`、`code`、`fields: FormField[]`、`subForms: FlowForm[]` |
| `FlowTodo` | `@coding-flow/flow-types` | 流程待办数据，包含 `recordId`、`title`、`data`、`createdOperator`、`processId` 等 |
| `FormData` | `@coding-flow/flow-types` | 合并表单操作数据，包含 `form: FormInstance` 和 `data: FlowTodo` |
| `FieldPermission` | `@coding-flow/flow-types` | 字段权限，包含 `formCode`、`fieldCode`、`type: 'READ' \| 'WRITE' \| 'HIDDEN'` |

## 核心行为

### 模式切换逻辑

- `mergeable` 为 `true`：渲染 `FlowTable` 组件，传入 `formList`、`initData`、`meta` 等属性，以表格形式展示多条可合并的流程记录
- `mergeable` 为 `false` 且 `form` 存在：渲染内部 `FlowFormView`（view.tsx），基于 `@coding-form/form-engine` 的 `FormView` 组件渲染表单字段，布局为 `vertical`（垂直布局）
- 两者都不满足时：不渲染任何内容

### 单表单模式

内部 view.tsx 组件在表单失焦（`onBlur`）时通过 `ObjectUtils.isEqual` 判断值是否变化，仅当值确实变化时才触发 `onValuesChange` 回调。同时会自动注入一个隐藏的 `recordId` 字段。

## 使用示例

```tsx
// 单表单模式：审批表单展示
import { FlowFormView } from '@coding-flow/flow-pc-form';
import type { FormViewProps } from '@coding-flow/flow-types';

const formViewProps: FormViewProps = {
    mergeable: false,
    form: formInstance,
    data: flowTodoData,
    meta: {
        name: '请假表单',
        code: 'leave-form',
        fields: [
            { id: '1', name: '请假天数', code: 'days', type: 'number', dataType: 'NUMBER', hidden: false, required: true },
            { id: '2', name: '请假原因', code: 'reason', type: 'textarea', dataType: 'STRING', hidden: false, required: false },
        ],
        subForms: [],
    },
    fieldPermissions: [
        { formCode: 'leave-form', fieldCode: 'days', type: 'READ' },
        { formCode: 'leave-form', fieldCode: 'reason', type: 'WRITE' },
    ],
    review: false,
    onValuesChange: (values) => {
        console.log('表单值变化:', values);
    },
};

<FlowFormView {...formViewProps} />
```

```tsx
// 合并模式：多条记录合并展示
import { FlowFormView } from '@coding-flow/flow-pc-form';

<FlowFormView
    mergeable={true}
    formList={[
        { form: formInstance1, data: todoData1 },
        { form: formInstance2, data: todoData2 },
    ]}
    meta={flowFormMeta}
    fieldPermissions={[]}
    review={false}
    onMergeRecordIdsSelected={(ids) => {
        console.log('选中的记录:', ids);
    }}
    onValuesChange={(values) => {
        console.log('当前表单值:', values);
    }}
/>
```

```tsx
// 预览模式：只读展示表单
<FlowFormView
    mergeable={false}
    form={formInstance}
    meta={flowFormMeta}
    fieldPermissions={[]}
    review={true}
/>
```

## 注意事项

- `mergeable`、`meta`、`fieldPermissions`、`review` 为必填属性
- 单表单模式下，表单值变化通过 `onBlur`（失焦）事件检测，而非实时 `onChange`，这是为了避免频繁触发回调
- 合并模式下，组件会委托给 `FlowTable` 组件渲染，表格列由 `meta.fields` 动态生成
- `form` 属性需要符合 `FormInstance` 接口（定义于 `@coding-flow/flow-types`），通常由上层审批组件创建并传入
- 内部依赖 `@coding-form/form-engine` 的 `FormView` 组件进行表单渲染，依赖 `antd` 的 `Form`、`Input` 组件
