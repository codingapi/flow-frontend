---
module: @coding-flow/flow-mobile-form
name: FlowList
description: 移动端合并流程列表组件，支持批量审批（多选模式）和逐条审批（单选模式）两种模式切换，内部使用 ListFormPresenter 管理表单数据。
---

# FlowList

- **来源**: 自有
- **所属 module**: @coding-flow/flow-mobile-form

## 何时使用

在移动端审批场景中需要合并处理多条流程待办时使用。该组件提供两种审批模式：批量审批（多选模式，默认）和逐条审批（单选模式），用户可通过顶部链接在两种模式间切换。批量审批模式下可全选或勾选多条记录后统一提交；逐条审批模式下可点击单条记录进入详情表单查看和审批。

## 如何引用

```ts
import { FlowList } from '@coding-flow/flow-mobile-form';
```

## API 说明

### Props

Props 类型为 `FlowListProps`（定义于本地 `@/components/list/types`）。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `formList` | `FormData[]` | - | **必填**，合并表单操控对象数组，每项包含 `form`（表单实例）和 `data`（待办数据） |
| `initData` | `any` | - | 初始化数据，会合并到列表每条记录的数据源中 |
| `onValuesChange` | `(values: any) => void` | - | 表单数据更新时的回调函数（逐条审批模式下使用） |
| `meta` | `FlowForm` | - | **必填**，表单元数据对象，包含表单名称、编码、字段定义和子表单 |
| `fieldPermissions` | `FieldPermission[]` | - | **必填**，表单字段权限配置，为空时全部可写 |
| `review` | `boolean` | - | **必填**，是否为预览模式，预览模式下表单字段只读 |
| `onMergeRecordIdsSelected` | `(recordIds: number[]) => void` | - | 批量审批模式下选中记录的回调函数，参数为选中的记录 ID 数组 |

### 关键依赖类型

| 类型 | 来源 | 说明 |
|------|------|------|
| `FormData` | `@coding-flow/flow-types` | 合并表单数据，包含 `form: FormInstance` 和 `data: FlowTodo` |
| `FlowForm` | `@coding-flow/flow-types` | 表单元数据，包含 `name`、`code`、`fields: FormField[]`、`subForms: FlowForm[]` |
| `FieldPermission` | `@coding-flow/flow-types` | 字段权限，包含 `formCode`、`fieldCode`、`type: 'READ' \| 'WRITE' \| 'HIDDEN'` |
| `FormInstance` | `@coding-flow/flow-types` | 表单实例对象，提供字段读写和表单提交等方法 |

### Events / Callbacks

| 回调 | 触发时机 | 参数 |
|------|----------|------|
| `onMergeRecordIdsSelected` | 批量审批模式下选中项变化时触发 | `recordIds: number[]` - 选中的流程记录 ID 数组 |
| `onValuesChange` | 逐条审批模式下表单值变更时触发 | `values: any` - 表单全量值 |

### Slots / Children

无显式插槽。组件内部根据当前模式自动渲染 `FlowMultipleList`（批量审批）或 `FlowSingleList`（逐条审批）。

## 核心行为

### 模式切换

组件内部通过 `multiple` 状态控制当前显示模式：

- **批量审批模式**（默认）：渲染 `FlowMultipleList`，使用 `antd-mobile` 的 `CheckList` 组件展示待办列表，支持多选和全选
- **逐条审批模式**：渲染 `FlowSingleList`，使用 `antd-mobile` 的 `List` 组件展示待办列表，点击某条记录后展开该记录的表单详情

### 批量审批模式（FlowMultipleList）

- 顶部提供"逐条审批"切换链接和全选复选框
- 使用 `CheckList` 组件展示列表项，每项显示标题、发起人、提交人和创建时间
- 选中项通过 `CheckCircleFilled` 图标标识，未选中项显示 `CheckCircleTwoTone`
- 选中项变化时自动触发 `onMergeRecordIdsSelected` 回调

### 逐条审批模式（FlowSingleList）

- 顶部提供"批量审批"切换链接
- 查看某条记录详情时，顶部显示"返回列表"按钮
- 点击列表项后，通过 `ListFormPresenter.getFormDataByRecordId()` 获取对应的表单实例，并渲染内部 `FlowFormView` 表单视图

### ListFormPresenter

内部使用 `ListFormPresenter` 类管理数据：

- `getDatasource(initData)`：将 `formList` 中所有表单数据与待办数据合并，生成列表展示数据源，每项包含表单字段值、待办信息、操作人信息和初始化数据
- `getFormDataByRecordId(id)`：根据记录 ID 查找对应的 `FormData` 对象

### 列表数据项结构

每条列表项包含以下展示信息：

| 字段 | 说明 |
|------|------|
| `title` | 流程标题 |
| `submitOperatorName` | 提交人姓名 |
| `createdOperatorName` | 发起人姓名 |
| `createTime` | 创建时间（格式化为 `YYYY-DD-MM HH:mm:ss`） |

## 使用示例

```tsx
// 批量审批模式
import { FlowList } from '@coding-flow/flow-mobile-form';
import type { FormData, FlowForm, FieldPermission } from '@coding-flow/flow-types';

const BatchApprovalPage: React.FC<{
    formList: FormData[];
    meta: FlowForm;
}> = ({ formList, meta }) => {
    return (
        <FlowList
            formList={formList}
            meta={meta}
            fieldPermissions={[]}
            review={false}
            onMergeRecordIdsSelected={(recordIds) => {
                console.log('选中的记录:', recordIds);
                // 调用后端批量审批接口
            }}
        />
    );
};
```

```tsx
// 带初始化数据
<FlowList
    formList={formList}
    meta={meta}
    initData={{ customField: 'defaultValue' }}
    fieldPermissions={[
        { formCode: 'main', fieldCode: 'title', type: 'WRITE' },
        { formCode: 'main', fieldCode: 'amount', type: 'READ' },
    ]}
    review={false}
    onValuesChange={(values) => {
        console.log('表单值变更:', values);
    }}
    onMergeRecordIdsSelected={(recordIds) => {
        console.log('选中记录:', recordIds);
    }}
/>
```

```tsx
// 预览模式
<FlowList
    formList={formList}
    meta={meta}
    fieldPermissions={[]}
    review={true}
/>
```

## 注意事项

- `formList`、`meta`、`fieldPermissions`、`review` 为必填属性
- 组件内部使用 `useRef` 缓存 `ListFormPresenter` 实例，在组件生命周期内仅初始化一次
- 批量审批模式默认显示（`multiple` 状态初始值为 `true`），切换到逐条审批后不会自动切回
- 逐条审批模式下的表单渲染依赖 `@coding-form/form-engine` 的 `FormView` 组件
- `initData` 会合并到每条列表数据项中，可用于传递额外的默认字段值
- 列表项的创建时间格式为 `YYYY-DD-MM`（与源码中 `dayjs` 格式化一致），如需调整需修改组件源码
