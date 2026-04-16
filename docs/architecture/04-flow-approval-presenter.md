# flow-approval-presenter 模块架构设计

> **文档编码**：ARCH-004

## 概述

flow-approval-presenter 是流程审批展示器框架，基于 Redux Toolkit 的状态管理，提供了审批流程的上下文管理、Presenter 业务逻辑处理和视图插件接口定义。

## 目录结构

```
packages/flow-approval-presenter/
├── src/
│   ├── index.ts                    # 模块导出
│   ├── context/                    # React Context
│   │   ├── index.ts
│   │   ├── approval.tsx            # ApprovalContext
│   │   └── mock.tsx                # MockContext
│   ├── presenters/                 # 业务逻辑
│   │   ├── index.ts
│   │   ├── approval.tsx            # ApprovalPresenter
│   │   └── action.ts               # FlowActionPresenter
│   ├── plugins/                    # 视图插件接口 ⭐
│   │   ├── index.ts
│   │   ├── add-audit-type.ts       # AddAuditViewPlugin
│   │   ├── delegate-type.ts        # DelegateViewPlugin
│   │   ├── transfer-type.ts       # TransferViewPlugin
│   │   ├── return-type.ts          # ReturnViewPlugin
│   │   ├── sign-key-type.ts        # SignKeyViewPlugin
│   │   ├── operator-select-type.ts # OperatorSelectViewPlugin
│   │   ├── manual-key-type.ts      # ManualViewPlugin
│   │   └── approval-view-plugin-action.ts
│   ├── store/                      # Redux Store
│   │   └── index.tsx               # approvalSlice
│   ├── hooks/                      # React Hooks
│   │   ├── index.ts
│   │   ├── use-approval-context.ts
│   │   └── use-mock-context.ts
│   ├── typings/                    # 类型定义
│   │   └── index.ts                # ApprovalState, ApprovalLayoutProps
│   └── api/                        # API 定义
│       └── flow-approval-api.ts
```

## 核心导出

```typescript
// packages/flow-approval-presenter/src/index.ts
export * from '@/context';
export * from '@/plugins';
export * from '@/typings';
export * from '@/store';
export * from '@/hooks';
```

## 状态管理

### Redux Store 配置

```typescript
// packages/flow-approval-presenter/src/store/index.tsx

export type ApprovalStoreAction = {
    updateState: (
        state: ApprovalState,
        action: PayloadAction<Partial<ApprovalState> | ((prev: ApprovalState) => Partial<ApprovalState>)>
    ) => void;
}

export const approvalSlice = createSlice<ApprovalState, ApprovalStoreAction, "approval", {}>({
    name: 'approval',
    initialState: {
        ...initStateData
    },
    reducers: {
        updateState: (state, action) => {
            if (typeof action.payload === 'function') {
                const currentState = original(state) as ApprovalState;
                Object.assign(state, action.payload(currentState));
            } else {
                Object.assign(state, action.payload);
            }
        },
    },
});

export const approvalStore = configureStore({
    reducer: {
        approval: approvalSlice.reducer
    },
});

export type ApprovalReduxState = ReturnType<typeof approvalStore.getState>;
```

### 状态类型

```typescript
// packages/flow-approval-presenter/src/typings/index.ts

export type ApprovalState = {
    flow?: FlowContent;
    review?: boolean;
};
```

## Context 架构

### ApprovalContextScope

```typescript
// packages/flow-approval-presenter/src/context/approval.tsx

export class ApprovalContextScope {
    private readonly presenter: ApprovalPresenter;
    private readonly props: ApprovalLayoutProps;

    constructor(presenter: ApprovalPresenter, props: ApprovalLayoutProps);

    syncState(state: ApprovalState): void;
    getPresenter(): ApprovalPresenter;
    getInitData(): any;
    close(): void;
    initialState(): void;
}

export const ApprovalContext = React.createContext<ApprovalContextScope | undefined>(undefined);
```

### Hook 使用方式

```typescript
// packages/flow-approval-presenter/src/hooks/use-approval-context.ts

export const useApprovalContext = () => {
    const context = React.useContext(ApprovalContext);
    const state = useSelector((state: ApprovalReduxState) => state.approval);
    if (!context) {
        throw new Error("ApprovalContext must be used within useContext");
    }
    return {
        state,
        context,
    };
}

export const createApprovalContext = (props: ApprovalLayoutProps, flowApprovalApi: FlowApprovalApi) => {
    // 创建并返回 Context
}
```

## Presenter 架构

### ApprovalPresenter

```typescript
// packages/flow-approval-presenter/src/presenters/approval.tsx

export class ApprovalPresenter {
    private state: ApprovalState;
    private readonly mockKey: string;
    private readonly dispatch: Dispatch<ApprovalState>;
    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private readonly flowActionPresenter: FlowActionPresenter;

    constructor(
        state: ApprovalState,
        dispatch: Dispatch<ApprovalState>,
        api: FlowApprovalApi,
        mockKey: string
    );

    syncState(state: ApprovalState): void;
    getFormActionContext(): FormActionContext;
    getFlowActionPresenter(): FlowActionPresenter;
    initialState(state: ApprovalState): void;
    processNodes(): Promise<ProcessNode[]>;
}
```

### FlowActionPresenter

处理流程动作的核心逻辑：

```typescript
// packages/flow-approval-presenter/src/presenters/action.ts

export class FlowActionPresenter {
    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private state: ApprovalState;
    private readonly mockKey: string;
    private submitRecordIds: number[];

    constructor(
        state: ApprovalState,
        api: FlowApprovalApi,
        formActionContext: FormActionContext,
        mockKey: string
    );

    setSubmitRecordIds(submitRecordIds: number[]): void;
    getSubmitRecordIds(): number[];
    syncState(state: ApprovalState): void;

    // 流程动作
    processNodes(): Promise<ProcessNode[]>;
    revoke(): Promise<any>;
    urge(): Promise<any>;
    action(actionId: string, params?: any): Promise<any>;

    // 内部方法
    private submitAction(actionId: string, formData: any, params?: any): Promise<any>;
    private executeAction(actionId: string, params?: any): Promise<any>;
    private isPassAction(actionId: string): boolean;
    private getFormDataByRecordId(recordId: number): any;
}
```

## 视图插件接口

### 插件接口定义

```typescript
// packages/flow-approval-presenter/src/plugins/add-audit-type.ts
export const VIEW_KEY = 'AddAuditViewPlugin';

export interface AddAuditViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// packages/flow-approval-presenter/src/plugins/delegate-type.ts
export const VIEW_KEY = 'DelegateViewPlugin';

export interface DelegateViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// packages/flow-approval-presenter/src/plugins/transfer-type.ts
export const VIEW_KEY = 'TransferViewPlugin';

export interface TransferViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// packages/flow-approval-presenter/src/plugins/return-type.ts
export const VIEW_KEY = 'ReturnViewPlugin';

export interface ReturnViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// packages/flow-approval-presenter/src/plugins/sign-key-type.ts
export const VIEW_KEY = 'SignKeyViewPlugin';

export interface SignKeyViewPlugin {
    current: FlowOperator;
    onChange?: (value: string) => void;
    value?: string;
    action?: React.Ref<ApprovalViewPluginAction>;
}

// packages/flow-approval-presenter/src/plugins/operator-select-type.ts
export const VIEW_KEY = 'OperatorSelectViewPlugin';

export interface OperatorSelectViewPlugin {
    onChange: (value: Record<string, number[]>) => void;
    options: NodeOption[];
}

// packages/flow-approval-presenter/src/plugins/manual-key-type.ts
export const VIEW_KEY = 'ManualViewPlugin';

export interface ManualViewPlugin {
    onChange: (value: string) => void;
    options: NodeOption[];
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

### 插件动作接口

```typescript
// packages/flow-approval-presenter/src/plugins/approval-view-plugin-action.ts

export interface ApprovalViewPluginAction {
    onValidate: () => Promise<boolean>;
}
```

### 插件导出聚合

```typescript
// packages/flow-approval-presenter/src/plugins/index.ts

export { type AddAuditViewPlugin, VIEW_KEY as AddAuditViewPluginKey } from "./add-audit-type";
export { type DelegateViewPlugin, VIEW_KEY as DelegateViewPluginKey } from "./delegate-type";
export { type ReturnViewPlugin, VIEW_KEY as ReturnViewPluginKey } from "./return-type";
export { type SignKeyViewPlugin, VIEW_KEY as SignKeyViewPluginKey } from "./sign-key-type";
export { type TransferViewPlugin, VIEW_KEY as TransferViewPluginKey } from "./transfer-type";
export { type OperatorSelectViewPlugin, VIEW_KEY as OperatorSelectViewPluginKey } from "./operator-select-type";
export { type ManualViewPlugin, VIEW_KEY as ManualViewPluginKey } from "./manual-key-type";
export * from "./approval-view-plugin-action";
```

## API 接口定义

```typescript
// packages/flow-approval-presenter/src/typings/index.ts

export interface FlowApprovalApi {
    create(body: Record<string, any>, mockKey: string): Promise<number>;
    processNodes(body: Record<string, any>, mockKey: string): Promise<ProcessNode[]>;
    action(body: Record<string, any>, mockKey: string): Promise<any>;
    revoke(id: any, mockKey: string): Promise<any>;
    urge(id: any, mockKey: string): Promise<any>;
}
```

## 使用方式

### 应用集成示例

```typescript
import { createApprovalContext } from "@flow-engine/flow-approval-presenter";
import { FlowApprovalApi } from "@flow-engine/flow-approval-presenter";

// 创建 API 实现
const flowApprovalApi: FlowApprovalApi = {
    async create(body, mockKey) { /* ... */ },
    async processNodes(body, mockKey) { /* ... */ },
    async action(body, mockKey) { /* ... */ },
    async revoke(id, mockKey) { /* ... */ },
    async urge(id, mockKey) { /* ... */ },
};

// 在组件中使用
const { state, context } = createApprovalContext(props, flowApprovalApi);
```

## 依赖关系

```
依赖：
- flow-core（ViewBindPlugin, Dispatch, GroovyScriptConvertorUtil）
- flow-types（FlowContent, FlowForm, FlowOperator, ProcessNode, NodeOption, FormActionContext）

被依赖：
- flow-pc-approval
- flow-mobile-approval
- app-pc
- app-mobile
```
