# 版本升级 0.0.19 → 0.0.20

## Context

将所有包的版本号从 0.0.19 升级到 0.0.20。

## 操作

将以下 14 个文件的 `"version": "0.0.19"` 替换为 `"version": "0.0.20"`：

- package.json (根目录)
- apps/app-pc/package.json
- apps/app-mobile/package.json
- packages/flow-core/package.json
- packages/flow-design/package.json
- packages/flow-types/package.json
- packages/flow-icons/package.json
- packages/flow-approval-presenter/package.json
- packages/flow-pc/flow-pc-ui/package.json
- packages/flow-pc/flow-pc-form/package.json
- packages/flow-pc/flow-pc-approval/package.json
- packages/flow-mobile/flow-mobile-ui/package.json
- packages/flow-mobile/flow-mobile-form/package.json
- packages/flow-mobile/flow-mobile-approval/package.json

---

# 选择表单并导入表单配置 - 实现计划

## Context

用户需要在流程设计器的表单设计功能中增加"选择已有表单并导入表单配置"的能力。目前表单设计采用内嵌编辑模式（直接编辑字段），缺少从已有表单库中选择并导入的功能。

## 架构设计

### ViewBind 插件机制

参考现有的 TriggerPluginView、SubProcessPluginView 等实现：

1. **类型定义** - 在 `flow-design` 包中定义 `ImportFormViewPlugin` 接口
2. **插件封装** - `ImportFormPluginView` 组件通过 `ViewBindPlugin.getInstance().get(VIEW_KEY)` 获取已注册的 View
3. **按钮显示** - 仅当 `ViewBindPlugin` 中存在注册的 View 时，才显示"导入表单"按钮
4. **使用者注册** - 业务方在项目中实现并注册自定义的表单选择 View

### 现有架构

```
TabForm (index.tsx)
├── FormTable (主表)
│   ├── "添加子表" 按钮
│   └── "添加字段" 按钮
└── Tabs (子表)
    └── FormTable (每个子表)
```

## 实现方案

### 1. 新增类型定义

**文件:** `packages/flow-design/src/plugins/import-form-view-type.ts`

```typescript
import {FlowForm} from "@coding-flow/flow-types";

export const IMPORT_FORM_VIEW_KEY = 'ImportFormViewPlugin';

export interface ImportFormViewPlugin {
    /** 是否显示 */
    open: boolean;
    /** 确认回调 */
    onSelect: (form: FlowForm) => void;
    /** 取消回调 */
    onCancel: () => void;
}
```

### 2. 新增插件封装组件

**文件:** `packages/flow-design/src/components/design-panel/tabs/form/import-form-plugin-view.tsx`

```typescript
import React from "react";
import {ImportFormViewPlugin, IMPORT_FORM_VIEW_KEY} from "@/plugins/import-form-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const ImportFormPluginView: React.FC<ImportFormViewPlugin> = (props) => {
    const CustomViewComponent = ViewBindPlugin.getInstance().get(IMPORT_FORM_VIEW_KEY);

    if (!CustomViewComponent) {
        return null;
    }

    return <CustomViewComponent {...props} />;
}
```

### 3. 修改 TabForm 组件

**文件:** `packages/flow-design/src/components/design-panel/tabs/form/index.tsx`

- 添加"导入表单"按钮（**仅当 ViewBindPlugin 中存在注册的 View 时才显示**）
- 点击按钮时设置 `importFormOpen = true`
- 使用 `ImportFormPluginView` 渲染已注册的表单选择组件

```typescript
export const TabForm = () => {
    const {state, context} = useDesignContext();
    const [importFormOpen, setImportFormOpen] = useState(false);

    // 仅当存在注册的 View 时才显示按钮
    const hasImportFormView = !!ViewBindPlugin.getInstance().get(IMPORT_FORM_VIEW_KEY);

    const handleImportForm = (form: FlowForm) => {
        // 调用 presenter 导入表单
        setImportFormOpen(false);
    };

    return (
        <Panel>
            <FormTable
                name={`主表:${mainName}`}
                code={mainCode}
                mainForm={true}
                hasImportForm={hasImportFormView}  // 控制按钮显示
                onImportClick={() => setImportFormOpen(true)}
            />
            {/* ... */}
            <ImportFormPluginView
                open={importFormOpen}
                onSelect={handleImportForm}
                onCancel={() => setImportFormOpen(false)}
            />
        </Panel>
    );
};
```

### 4. 修改 FormTable 组件

**文件:** `packages/flow-design/src/components/design-panel/tabs/form/table.tsx`

- 添加 `hasImportForm` 和 `onImportClick` 可选 props
- 在主表标题栏添加"导入表单"按钮（条件渲染）

### 5. 新增 Presenter 方法

**文件:** `packages/flow-design/src/components/design-panel/presenters/index.ts`

```typescript
public importWorkflowForm(selectedForm: FlowForm) {
    const updatedForm: FlowForm = {
        ...this.state.workflow.form,
        fields: selectedForm.fields || [],
        subForms: selectedForm.subForms || [],
    };
    this.updateWorkflowForm(updatedForm);
}
```

### 6. 导出插件类型

**文件:** `packages/flow-design/src/plugins/index.ts`

```typescript
export {type ImportFormViewPlugin, IMPORT_FORM_VIEW_KEY} from "./import-form-view-type";
```

## 关键文件清单

| 操作 | 文件路径 |
|------|----------|
| 新增 | `packages/flow-design/src/plugins/import-form-view-type.ts` |
| 新增 | `packages/flow-design/src/components/design-panel/tabs/form/import-form-plugin-view.tsx` |
| 修改 | `packages/flow-design/src/components/design-panel/tabs/form/index.tsx` |
| 修改 | `packages/flow-design/src/components/design-panel/tabs/form/table.tsx` |
| 修改 | `packages/flow-design/src/components/design-panel/presenters/index.ts` |
| 修改 | `packages/flow-design/src/plugins/index.ts` |

## 使用者接入方式

业务方在项目中注册自定义表单选择 View：

```typescript
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {IMPORT_FORM_VIEW_KEY} from "@coding-flow/flow-design";
import {CustomFormSelectView} from "./custom-form-select-view";

ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, CustomFormSelectView);
```

自定义 View 需要实现的接口：

```typescript
interface ImportFormViewPlugin {
    open: boolean;
    onSelect: (form: FlowForm) => void;
    onCancel: () => void;
}
```

## 数据流

```
TabForm 渲染
    → 检查 ViewBindPlugin 中是否存在 IMPORT_FORM_VIEW_KEY
    → 存在 → 显示"导入表单"按钮
    → 不存在 → 不显示按钮

用户点击"导入表单"按钮
    → 设置 open = true
    → ImportFormPluginView 渲染已注册的 View 组件

用户选择表单并确认
    → 调用 onSelect(form)
    → Presenter.importWorkflowForm(form)
    → 更新 Redux 状态
    → 设置 open = false
```

## 验证方案

1. **未注册时** - "导入表单"按钮不显示
2. **注册后** - "导入表单"按钮显示，点击弹出自定义 View
3. **选择确认** - 选择表单后，字段正确导入到流程表单中

---

# app-pc 测试验证计划

## Context

在 app-pc 中注册表单导入插件，使用模拟数据验证功能是否正常。

## 实现步骤

### 1. 创建自定义表单选择组件

**文件:** `apps/app-pc/src/components/import-form-view/index.tsx`

```typescript
import React, {useState} from "react";
import {Modal, Table, Radio, Space, Alert} from "antd";
import type {TableProps} from "antd";
import {FlowForm} from "@coding-flow/flow-types";
import {ImportFormViewPlugin} from "@coding-flow/flow-design";

const mockFormList: FlowForm[] = [
    {
        code: "leave_form",
        name: "请假申请表单",
        fields: [
            { id: "1", code: "reason", name: "请假原因", type: "string", dataType: "STRING", required: true, hidden: false },
            { id: "2", code: "days", name: "请假天数", type: "integer", dataType: "INTEGER", required: true, hidden: false },
        ],
        subForms: []
    },
    {
        code: "expense_form",
        name: "报销申请表单",
        fields: [
            { id: "1", code: "amount", name: "报销金额", type: "double", dataType: "DOUBLE", required: true, hidden: false },
            { id: "2", code: "description", name: "报销说明", type: "string", dataType: "STRING", required: false, hidden: false },
        ],
        subForms: []
    },
    {
        code: "trip_form",
        name: "出差申请表单",
        fields: [
            { id: "1", code: "destination", name: "出差地点", type: "string", dataType: "STRING", required: true, hidden: false },
            { id: "2", code: "startDate", name: "开始日期", type: "date", dataType: "STRING", required: true, hidden: false },
        ],
        subForms: []
    }
];

export const ImportFormView: React.FC<ImportFormViewPlugin> = (props) => {
    const [selectedForm, setSelectedForm] = useState<FlowForm | null>(null);

    const columns: TableProps<FlowForm>['columns'] = [
        { title: '表单名称', dataIndex: 'name' },
        { title: '表单编码', dataIndex: 'code' },
        {
            title: '字段数量',
            render: (_, record) => record.fields?.length || 0
        },
    ];

    return (
        <Modal
            title="选择表单并导入配置"
            open={props.open}
            onCancel={props.onCancel}
            onOk={() => selectedForm && props.onSelect(selectedForm)}
            okText="导入"
            okButtonProps={{disabled: !selectedForm}}
        >
            <Space direction="vertical" style={{width: '100%'}} size="middle">
                <Alert
                    message="选择要导入的表单"
                    description="将选中表单的字段和子表导入到当前流程表单中"
                    type="info"
                    showIcon
                />
                <Table
                    columns={columns}
                    dataSource={mockFormList}
                    rowKey="code"
                    pagination={{pageSize: 10}}
                    rowSelection={{
                        type: 'radio',
                        onChange: (_, selectedRows) => setSelectedForm(selectedRows[0] || null)
                    }}
                />
            </Space>
        </Modal>
    );
};
```

### 2. 创建注册 Hook

**文件:** `apps/app-pc/src/hooks/register-import-form-view.tsx`

```typescript
import {useEffect} from "react";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {IMPORT_FORM_VIEW_KEY} from "@coding-flow/flow-design";
import {ImportFormView} from "@/components/import-form-view";

export const registerImportFormView = () => {
    ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, ImportFormView);
}
```

### 3. 在入口处调用注册

**文件:** `apps/app-pc/src/index.tsx`

在 `registerFormTypes()` 后添加 `registerImportFormView()` 调用。

## 关键文件清单

| 操作 | 文件路径 |
|------|----------|
| 新增 | `apps/app-pc/src/components/import-form-view/index.tsx` |
| 新增 | `apps/app-pc/src/hooks/register-import-form-view.tsx` |
| 修改 | `apps/app-pc/src/index.tsx` |

## 验证步骤

1. 构建 app-pc 应用
2. 启动应用进入流程设计器
3. 进入表单设计 Tab
4. 验证"导入表单"按钮是否显示
5. 点击按钮，验证 Modal 是否正确弹出
6. 选择表单并点击导入，验证字段是否正确导入
