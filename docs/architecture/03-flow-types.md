# flow-types 模块架构设计

> **文档编码**：ARCH-003

## 概述

flow-types 是 Flow Engine 前端的全局类型定义库，包含流程审批相关的所有业务类型定义，供 PC 端和移动端共用。

## 目录结构

```
packages/flow-types/
├── src/
│   ├── index.ts                    # 模块导出
│   └── types/
│       ├── index.ts               # 类型聚合导出
│       ├── flow-design.ts         # 流程设计类型
│       ├── flow-approval.ts        # 审批流程类型
│       ├── form-view.ts            # 表单视图类型
│       ├── form-type.ts            # 表单基础类型
│       ├── form-instance.ts        # 表单实例类型
│       ├── form-action.ts          # 表单动作类型
│       └── icons.ts                # 图标类型
```

## 核心导出

```typescript
// packages/flow-types/src/index.ts
export * from './flow-design';
export * from './form-view';
export * from './form-type';
export * from './form-instance';
export * from './form-action';
export * from './flow-approval';
export * from './icons';
```

## 流程设计类型

### 节点类型定义

```typescript
// packages/flow-types/src/types/flow-design.ts

/**
 * 节点类型
 */
export type NodeType =
    // 审批
    "APPROVAL" |
    // 分支控制
    "CONDITION" |
    // 分支节点
    "CONDITION_BRANCH" |
    // else分支节点
    "CONDITION_ELSE_BRANCH" |
    // 延迟节点
    "DELAY" |
    // 结束
    "END" |
    // 办理
    "HANDLE" |
    // 包容控制
    "INCLUSIVE" |
    // 包容分支
    "INCLUSIVE_BRANCH" |
    // else包容分支
    "INCLUSIVE_ELSE_BRANCH" |
    // 人工控制
    "MANUAL" |
    // 人工分支
    "MANUAL_BRANCH" |
    // 抄送
    "NOTIFY" |
    // 并行控制
    "PARALLEL" |
    // 并行分支
    "PARALLEL_BRANCH" |
    // 路由
    "ROUTER" |
    // 开始
    "START" |
    // 子流程
    "SUB_PROCESS" |
    // 触发
    "TRIGGER";
```

### 操作类型定义

```typescript
/**
 * 操作类型
 */
export type ActionType =
    // 保存
    'SAVE' |
    // 通过，流程继续往下流转
    'PASS' |
    // 拒绝，拒绝时需要根据拒绝的配置流程来设置
    'REJECT' |
    // 加签，指定给其他人一块审批，以会签模式来处理
    'ADD_AUDIT' |
    // 委派，委派给其他人员来审批，当人员审批完成以后再流程给自己审批
    'DELEGATE' |
    // 退回，退回时需要设置退回的节点
    'RETURN' |
    // 转办，将流程转移给指定用户来审批，需要配置人员匹配范围
    'TRANSFER' |
    // 自定义，自定义按钮，需要配置脚本
    'CUSTOM';

export const actionOptions = [
    { label: '保存', value: 'SAVE' },
    { label: '通过', value: 'PASS' },
    { label: '拒绝', value: 'REJECT' },
    { label: '加签', value: 'ADD_AUDIT' },
    { label: '委派', value: 'DELEGATE' },
    { label: '退回', value: 'RETURN' },
    { label: '转办', value: 'TRANSFER' },
    { label: '自定义', value: 'CUSTOM' },
]
```

## 审批流程类型

### FlowOperator - 流程操作人对象

```typescript
// packages/flow-types/src/types/flow-approval.ts

export interface FlowOperator {
    /** 人员id */
    id: number;
    /** 人员名称 */
    name: string;
}
```

### FlowContent - 流程审批内容对象

```typescript
export interface FlowContent {
    /** 记录id */
    recordId: number;
    /** 流程id */
    processId: string;
    /** 流程设计id */
    workId: string;
    /** 流程设计编码 */
    workCode: string;
    /** 流程设计标题 */
    workTitle: string;
    /** 流程设计备注 */
    workDescription: string;
    /** 流程创建时间，发起时为0 */
    createTime: number;
    /** 节点id */
    nodeId: string;
    /** 节点名称 */
    nodeName: string;
    /** 节点类型 */
    nodeType: string;
    /** 流程标题 */
    title: string;
    /** 视图名称 */
    view: string;
    /** 是否必填意见 */
    adviceRequired: boolean;
    /** 是否必填签名 */
    signRequired: boolean;
    /** 表单元数据 */
    form: FlowForm;
    /** 表单字段权限 */
    fieldPermissions: FieldPermission[];
    /** 待办记录 */
    todos: FlowTodo[];
    /** 操作按钮 */
    actions: FlowAction[];
    /** 是否合并 */
    mergeable: boolean;
    /** 流程创建人 */
    createOperator: FlowOperator;
    /** 当前流程 */
    currentOperator: FlowOperator;
    /** 流程状态 */
    flowState: number;
    /** 记录状态 */
    recordState: number;
    /** 审批记录 */
    histories: History[];
    /** 所有节点 */
    nodes: NodeOption[];
    /** 支持撤销 */
    revoke: boolean;
    /** 支持催办 */
    urge: boolean;
}
```

### FlowTodo - 流程待办对象

```typescript
export interface FlowTodo {
    /** 记录id */
    recordId: number;
    /** 流程发起人 */
    createdOperator: FlowOperator;
    /** 流程提交人 */
    submitOperator?: FlowOperator;
    /** 流程标题 */
    title: string;
    /** 流程数据 */
    data: Record<string, any>;
    /** 记录状态 */
    recordState: number;
    /** 流程状态 */
    flowState: number;
    /** 流程创建时间 */
    createTime: number;
    /** 流程id */
    processId: string;
    /** 流程标题 */
    workTitle: string;
    /** 节点id */
    nodeId: string;
    /** 节点名称 */
    nodeName: string;
    /** 节点类型 */
    nodeType: string;
}
```

### FlowAction - 流程操作对象

```typescript
export interface FlowActionDisplay {
    /** 标题 */
    title: string;
    /** 样式 */
    style: string;
    /** 图标 */
    icon: string;
}

export interface FlowAction {
    /** 操作id */
    id: string;
    /** 按钮名称 */
    title: string;
    /** 动作类型 */
    type: ActionType;
    /** 展示样式 */
    display: FlowActionDisplay;
    /** 是否启用 */
    enable: boolean;
    /** 自定义脚本 */
    script?: string;
}
```

### ProcessNode - 流程节点对象

```typescript
export interface ProcessNode {
    /** 节点id */
    nodeId: string;
    /** 节点名称 */
    nodeName: string;
    /** 节点类型 */
    nodeType: string;
    /** 状态 -1 历史 0 当前 1 未执行 */
    state: number;
    /** 审批人员 */
    operators: FlowApprovalOperator[];
}
```

## 表单相关类型

### FlowForm - 表单元数据

```typescript
// packages/flow-types/src/types/form-type.ts

export interface FlowForm {
    /** 表单名称 */
    name: string;
    /** 表单编码 */
    code: string;
    /** 表单字段 */
    fields: FormField[];
    /** 子表单 */
    subForms: FlowForm[];
}
```

### FormField - 流程表单字段元数据

```typescript
export interface FieldAttribute {
    /** 属性key */
    key: string;
    /** 属性名称 */
    label?: string;
    /** 属性值 */
    value?: string;
}

export interface FormField {
    /** 字段id */
    id: string;
    /** 字段名称 */
    name: string;
    /** 字段编码 */
    code: string;
    /** 字段类型 */
    type: string;
    /** 数据类型 */
    dataType: DataType;
    /** 是否隐藏 */
    hidden: boolean;
    /** 是否必填 */
    required: boolean;
    /** 默认值 */
    defaultValue?: string;
    /** 输入提示 */
    placeholder?: string;
    /** 提醒提示 */
    tooltip?: string;
    /** 帮助提示 */
    help?: string;
    /** 附加属性 */
    attributes?: FieldAttribute[];
}
```

### DataType - 数据类型枚举

```typescript
export enum DataType {
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    DOUBLE = 'DOUBLE',
    BOOLEAN = 'BOOLEAN',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    TEXT = 'TEXT',
    FILE = 'FILE',
}
```

### FormViewProps - 表单视图属性

```typescript
// packages/flow-types/src/types/form-view.ts

export interface FormData {
    /** 表单操控对象 */
    form: FormInstance;
    /** 待办数据 */
    data: FlowTodo;
}

export interface FormViewProps {
    /** 流程合并 */
    mergeable: boolean;
    /** 合并表单操控对象 */
    formList?: FormData[];
    /** 表单操控对象 */
    form?: FormInstance;
    /** 待办数据 */
    data?: FlowTodo;
    /** 初始化数据 **/
    initData?: any;
    /** 表单数据更新事件 */
    onValuesChange?: (values: any) => void;
    /** 当合并流程选中了流程记录的回掉 **/
    onMergeRecordIdsSelected?: (recordIds: number[]) => void;
    /** 表单元数据对象 */
    meta: FlowForm;
    /** 表单字段权限,为空时全部可写 */
    fieldPermissions: FieldPermission[];
    /** 是否预览模式 */
    review: boolean;
}
```

## 表单动作类型

### IFormAction 接口

```typescript
// packages/flow-types/src/types/form-action.ts

export interface IFormAction {
    save(): any;
    key(): string;
    validate(): Promise<any>;
}
```

### FormActionContext 类

```typescript
export class FormActionContext {
    private readonly formActions: IFormAction[];

    constructor();
    addAction(submit: IFormAction): void;
    removeAction(key: string): void;
    save(): any;
    validate(): Promise<any>;
}
```

## 依赖该模块的包

- flow-approval-presenter
- flow-design
- flow-pc-form
- flow-pc-approval
- flow-mobile-form
- flow-mobile-approval
- app-pc
- app-mobile
