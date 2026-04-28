---
module: @coding-flow/flow-mobile-form
name: FlowFormView
description: 移动端流程表单视图组件，根据 mergeable 属性自动切换为单表单渲染模式或合并表单列表模式，支持表单字段权限控制和预览模式。
---

# FlowFormView

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-form

## 何时使用

在移动端审批场景中需要渲染流程表单时使用。该组件根据 `mergeable` 属性自动判断渲染模式：当 `mergeable` 为 `true` 时，渲染合并表单列表（`FlowList`），允许多条待办合并处理；当 `mergeable` 为 `false` 时，渲染单表单视图（内部 `FormView`），展示单个表单内容。

## 如何引用

```ts
import { FlowFormView } from '@coding-flow/flow-mobile-form';
```

## API 说明

### Props

Props 类型继承自 `FormViewProps`（定义于 `@coding-flow/flow-types`）。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mergeable` | `boolean` | - | **必填**，是否为合并流程模式。`true` 时渲染 `FlowList`，`false` 时渲染单个表单视图 |
| `formList` | `FormData[]` | `[]` | 合并表单操控对象数组，仅在 `mergeable` 为 `true` 时使用 |
| `form` | `FormInstance` | - | 表单操控对象，仅在 `mergeable` 为 `false` 时使用 |
| `data` | `FlowTodo` | - | 待办数据，仅在 `mergeable` 为 `false` 时使用 |
| `initData` | `any` | - | 初始化数据，传递给表单或列表组件 |
| `onValuesChange` | `(values: any) => void` | - | 表单数据更新时的回调函数 |
| `onMergeRecordIdsSelected` | `(recordIds: number[]) => void` | - | 合并流程模式下选中流程记录的回调函数 |
| `meta` | `FlowForm` | - | **必填**，表单元数据对象，包含表单名称、编码、字段定义和子表单 |
| `fieldPermissions` | `FieldPermission[]` | - | **必填**，表单字段权限配置，为空时全部可写 |
| `review` | `boolean` | - | **必填**，是否为预览模式，预览模式下表单字段只读 |

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `FormData` | `@coding-flow/flow-types` | 合并表单数据，包含 `form: FormInstance` 和 `data: FlowTodo` |
| `FormInstance` | `@coding-flow/flow-types` | 表单实例对象，提供 `getFieldValue`、`setFieldValue`、`getFieldsValue`、`resetFields`、`setFieldsValue`、`submit` 等方法 |
| `FlowTodo` | `@coding-flow/flow-types` | 流程待办对象，包含 `recordId`、`createdOperator`、`title`、`data`、`createTime` 等字段 |
| `FlowForm` | `@coding-flow/flow-types` | 表单元数据，包含 `name`、`code`、`fields: FormField[]`、`subForms: FlowForm[]` |
| `FieldPermission` | `@coding-flow/flow-types` | 字段权限，包含 `formCode`、`fieldCode`、`type: 'READ' | 'WRITE' | 'HIDDEN'` |

### Slots / Children

无显式插槽。组件内部根据 `mergeable` 属性自动选择渲染 `FlowList` 或内部 `FormView`。

## 核心行为

### 渲染逻辑

1. 当 `mergeable` 为 `true` 时，渲染 `FlowList` 组件，传入 `formList`、`onMergeRecordIdsSelected` 等属性
2. 当 `mergeable` 为 `false` 且 `form` 存在时，渲染内部 `FlowFormView`（`view.tsx`），传入 `form`、`data`、`meta` 等属性
3. 当 `mergeable` 为 `false` 且 `form` 不存在时，组件不渲染任何内容

### 内部表单视图

内部 `FlowFormView`（`view.tsx`）使用 `@coding-form/form-engine` 的 `FormView` 组件渲染表单，布局方式为垂直布局（`vertical`），同时隐藏一个 `recordId` 字段用于记录关联。

## 使用示例

```tsx
// 单表单模式：展示流程审批表单
import { FlowFormView } from '@coding-flow/flow-mobile-form';
import type { FormViewProps } from '@coding-flow/flow-types';

const FormPage: React.FC = () => {
    const props: FormViewProps = {
        mergeable: false,
        form: formInstance,
        data: flowTodo,
        meta: flowForm,
        initData: { department: '技术部' },
        onValuesChange: (values) => {
            console.log('表单值变更:', values);
        },
        fieldPermissions: [
            { formCode: 'main', fieldCode: 'title', type: 'WRITE' },
            { formCode: 'main', fieldCode: 'amount', type: 'READ' },
        ],
        review: false,
    };

    return <FlowFormView {...props} />;
};
```

```tsx
// 合并流程模式：批量处理多条待办
import { FlowFormView } from '@coding-flow/flow-mobile-form';

const MergeFormPage: React.FC = () => {
    return (
        <FlowFormView
            mergeable={true}
            formList={formDataList}
            meta={flowForm}
            fieldPermissions={[]}
            review={false}
            onMergeRecordIdsSelected={(recordIds) => {
                console.log('选中的记录ID:', recordIds);
            }}
        />
    );
};
```

```tsx
// 预览模式：只读展示表单内容
<FlowFormView
    mergeable={false}
    form={formInstance}
    meta={flowForm}
    fieldPermissions={[]}
    review={true}
/>
```

## 注意事项

- `meta`、`fieldPermissions`、`review`、`mergeable` 为必填属性
- `formList` 默认值为空数组 `[]`，在合并模式下需传入有效的 `FormData[]`
- 内部表单视图使用 `@coding-form/form-engine` 的 `FormView` 组件，需确保该依赖已安装（已在 `package.json` 的 `dependencies` 中声明）
- 组件内部隐藏了一个 `recordId` 字段，用于表单与流程记录的关联
- `onValuesChange` 回调接收的 `values` 参数是表单全量值对象（由 `FormView` 的 `onValuesChange` 第二个参数传入）
