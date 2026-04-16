# flow-design 模块架构设计

> **文档编码**：ARCH-005

## 概述

flow-design 是流程设计器组件库，提供可视化流程设计能力，包括节点配置、属性面板、脚本配置等功能。

## 目录结构

```
packages/flow-design/
├── src/
│   ├── index.ts                    # 模块导出
│   ├── context/                    # React Context
│   │   └── design-context.tsx
│   ├── hooks/                      # React Hooks
│   │   └── use-design-context.ts
│   ├── plugins/                    # 视图插件接口 ⭐
│   │   ├── index.ts               # 插件导出聚合
│   │   ├── view/                   # 默认视图实现
│   │   │   ├── condition-view.tsx
│   │   │   ├── error-trigger-view.tsx
│   │   │   ├── node-title-view.tsx
│   │   │   ├── operator-create-view.tsx
│   │   │   ├── operator-load-view.tsx
│   │   │   ├── router-view.tsx
│   │   │   ├── sub-process-view.tsx
│   │   │   ├── sub-process-opreator-view.tsx
│   │   │   ├── trigger-view.tsx
│   │   │   ├── action-custom-view.tsx
│   │   │   └── action-reject-view.tsx
│   │   ├── condition-view-type.ts
│   │   ├── error-trigger-view-type.ts
│   │   ├── node-title-view-type.ts
│   │   ├── operator-create-view-type.ts
│   │   ├── operator-load-view-type.ts
│   │   ├── router-view-type.ts
│   │   ├── sub-process-view-type.ts
│   │   ├── sub-process-operator-view-type.ts
│   │   ├── trigger-view-type.ts
│   │   ├── action-custom-view-type.ts
│   │   ├── action-reject-view-type.ts
│   │   ├── import-form-view-type.ts
│   │   └── design-view-plugin-action.ts
│   ├── script-components/          # 脚本组件
│   │   ├── index.ts
│   │   ├── typings/               # 类型定义
│   │   │   ├── index.ts
│   │   │   ├── script.ts          # ScriptType, GroovyVariableMapping
│   │   │   └── action.ts          # ActionSelectOption
│   │   ├── components/            # 脚本相关组件
│   │   │   ├── action/            # 动作配置
│   │   │   ├── condition/         # 条件配置
│   │   │   ├── groovy-script-modal.tsx
│   │   │   ├── advanced-script-editor.tsx
│   │   │   ├── variable-picker.tsx
│   │   │   └── groovy-script-preview.tsx
│   │   ├── modal/                # 模态框配置
│   │   ├── services/              # 服务
│   │   ├── hooks/                # Hooks
│   │   ├── utils/                # 工具
│   │   └── default-script.ts     # 默认脚本
│   ├── components/               # 设计器组件
│   │   ├── design-editor/        # 设计编辑器主组件
│   │   ├── design-panel/         # 属性面板
│   │   └── design-import/        # 设计导入
│   └── utils/                    # 工具函数
```

## 核心导出

```typescript
// packages/flow-design/src/index.ts
export * from '@/context';
export * from '@/plugins';
export * from '@/typings';
export * from '@/store';
export * from '@/hooks';
```

## 视图插件接口

### 设计器视图插件定义

```typescript
// packages/flow-design/src/plugins/condition-view-type.ts
export const VIEW_KEY = 'ConditionViewPlugin';

export interface ConditionViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/error-trigger-view-type.ts
export const VIEW_KEY = 'ErrorTriggerViewPlugin';

export interface ErrorTriggerViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/node-title-view-type.ts
export const VIEW_KEY = 'NodeTitleViewPlugin';

export interface NodeTitleViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/operator-create-view-type.ts
export const VIEW_KEY = 'OperatorCreateViewPlugin';

export interface OperatorCreateViewPlugin {
    script: string;
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/operator-load-view-type.ts
export const VIEW_KEY = 'OperatorLoadViewPlugin';

export interface OperatorLoadViewPlugin {
    script: string;
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/router-view-type.ts
export const VIEW_KEY = 'RouterViewPlugin';

export interface RouterViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/sub-process-view-type.ts
export const VIEW_KEY = 'SubProcessViewPlugin';

export interface SubProcessViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/sub-process-operator-view-type.ts
export const VIEW_KEY = 'SubProcessOperatorViewPlugin';

export interface SubProcessOperatorViewPlugin {
    value?: string;
    onChange?: (value: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/trigger-view-type.ts
export const VIEW_KEY = 'TriggerViewPlugin';

export interface TriggerViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/action-custom-view-type.ts
export const VIEW_KEY = 'ActionCustomViewPlugin';

export interface ActionCustomViewPlugin {
    value?: string;
    onChange?: (value: string) => void;
    options: ActionSelectOption[];
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/action-reject-view-type.ts
export const VIEW_KEY = 'ActionRejectViewPlugin';

export interface ActionRejectViewPlugin {
    nodeId: string;
    value?: string;
    onChange?: (value: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// packages/flow-design/src/plugins/import-form-view-type.ts
export const IMPORT_FORM_VIEW_KEY = 'ImportFormViewPlugin';

export interface ImportFormViewPlugin {
    open: boolean;
    onSelect: (form: FlowForm) => void;
    onCancel: () => void;
}
```

### 插件动作接口

```typescript
// packages/flow-design/src/plugins/design-view-plugin-action.ts

export interface DesignViewPluginAction {
    onValidate: (script: string) => Promise<boolean>;
}
```

### 插件导出聚合

```typescript
// packages/flow-design/src/plugins/index.ts

export { type ActionCustomViewPlugin, VIEW_KEY as ActionCustomViewPluginKey } from "./action-custom-view-type";
export { type ActionRejectViewPlugin, VIEW_KEY as ActionRejectViewPluginKey } from "./action-reject-view-type";
export { type ConditionViewPlugin, VIEW_KEY as ConditionViewPluginKey } from "./condition-view-type";
export { type ErrorTriggerViewPlugin, VIEW_KEY as ErrorTriggerViewPluginKey } from "./error-trigger-view-type";
export { type ImportFormViewPlugin, IMPORT_FORM_VIEW_KEY } from "./import-form-view-type";
export { type NodeTitleViewPlugin, VIEW_KEY as NodeTitleViewPluginKey } from "./node-title-view-type";
export { type OperatorCreateViewPlugin, VIEW_KEY as OperatorCreateViewPluginKey } from "./operator-create-view-type";
export { type OperatorLoadViewPlugin, VIEW_KEY as OperatorLoadViewPluginKey } from "./operator-load-view-type";
export { type RouterViewPlugin, VIEW_KEY as RouterViewPluginKey } from "./router-view-type";
export { type SubProcessViewPlugin, VIEW_KEY as SubProcessViewPluginKey } from "./sub-process-view-type";
export { type TriggerViewPlugin, VIEW_KEY as TriggerViewPluginKey } from "./trigger-view-type";
export * from "./design-view-plugin-action";
```

## 脚本类型定义

### ScriptType 枚举

```typescript
// packages/flow-design/src/script-components/typings/script.ts

export enum ScriptType {
    TITLE = 'TITLE',                 // 标题脚本
    CONDITION = 'CONDITION',         // 条件脚本
    OPERATOR_LOAD = 'OPERATOR_LOAD', // 人员加载脚本
    OPERATOR_CREATE = 'OPERATOR_LOAD', // 流程创建人脚本
    ERROR_TRIGGER = 'ERROR_TRIGGER', // 异常触发脚本
    TRIGGER = 'TRIGGER',             // 触发节点脚本
    ROUTER = 'ROUTER',              // 路由节点脚本
    SUB_PROCESS = 'SUB_PROCESS',    // 子流程节点脚本
}
```

### GroovyVariableMapping

```typescript
export interface GroovyVariableMapping {
    label: string;          // 中文显示名称
    value: string;         // 变量展示名
    type: DataType;        // 数据类型
    expression: string;    // Groovy表达式
    tag: string;           // 分组标签
    order: number;         // 排序序号
}

export enum VariableTag {
    OPERATOR = '操作人相关',
    WORKFLOW = '流程相关',
    FORM_FIELD = '表单字段',
}
```

### ActionSelectOption

```typescript
// packages/flow-design/src/script-components/typings/action.ts

export interface ActionSelectOption {
    label: any;
    value: string;
}
```

## 默认脚本

```typescript
// packages/flow-design/src/script-components/default-script.ts

// 默认发起人范围设置脚本（任意人员）
export const SCRIPT_DEFAULT_OPERATOR_CREATE = `...`;

// 默认操作人配置脚本（流程创建者）
export const SCRIPT_DEFAULT_OPERATOR_LOAD = `...`;

// 发起人设定操作人脚本
export const SCRIPT_INITIATOR_SELECT = `...`;

// 审批人设定操作人脚本
export const SCRIPT_APPROVER_SELECT = `...`;

// 默认节点标题配置脚本
export const SCRIPT_DEFAULT_NODE_TITLE = `...`;

// 默认异常触发脚本（回退至开始节点）
export const SCRIPT_DEFAULT_ERROR_TRIGGER = `...`;

// 默认条件脚本（允许执行）
export const SCRIPT_DEFAULT_CONDITION = `...`;

// 默认路由脚本（发起节点）
export const SCRIPT_DEFAULT_ROUTER = `...`;

// 默认触发脚本（打印触发日志）
export const SCRIPT_DEFAULT_TRIGGER = `...`;

// 自定义脚本（默认返回通过）
export const SCRIPT_DEFAULT_CUSTOM = `...`;

// 子流程脚本（创建当前流程）
export const SCRIPT_DEFAULT_SUB_PROCESS = `...`;
```

## 依赖关系

```
依赖：
- flow-core（ViewBindPlugin, GroovyScriptConvertorUtil）
- flow-types（FlowForm, FlowOperator, NodeOption 等）

被依赖：
- app-pc
```
