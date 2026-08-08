# 插件定制机制

> 本文面向集成方，系统介绍 Flow Frontend 提供的全部扩展点。文档内容均对应实际源码，可按章节标注的源码路径核对。
>
> 涉及包：
> - `@coding-flow/flow-core` — 无 UI 内核（packages/flow-core）
> - `@coding-flow/flow-types` — 全局类型（packages/flow-types）
> - `@coding-flow/flow-approval-presenter` — 审批展示器框架（packages/flow-approval-presenter）
> - `@coding-flow/flow-pc-approval` — PC 审批组件（packages/flow-pc/flow-pc-approval）
> - `@coding-flow/flow-mobile-approval` — 移动审批组件（packages/flow-mobile/flow-mobile-approval）
> - `@coding-flow/flow-design` — 流程设计器（packages/flow-design）

---

## 1. 扩展点总览

前端框架的扩展点按**分层**组织，越靠下层越通用：

| 层级 | 包 | 扩展点 | 能力 |
|------|-----|--------|------|
| 内核层 | flow-core | ViewBindPlugin | 全局视图组件注册中心（替换任意 UI） |
| 内核层 | flow-core | EventBus | 全局发布-订阅事件总线 |
| 内核层 | flow-core | BasePresenter / PresenterHooks | Presenter 模式（业务逻辑与视图分离） |
| 内核层 | flow-core | HttpClient / MessageBox | HTTP 客户端与消息提示 |
| 内核层 | flow-core | FlowMessageRegistry / FlowMessageKey | 全局消息文案 |
| 内核层 | flow-core | GroovyScriptConvertorUtil | Groovy 脚本解析工具 |
| 审批领域层 | flow-approval-presenter | FlowApprovalApi 接口 | 替换审批后端 API 实现 |
| 审批领域层 | flow-approval-presenter | 7 个子视图插件 | 替换选人/签名/节点选择视图 |
| 审批领域层 | flow-approval-presenter | ActionInterceptor | 审批动作拦截器（提交前拦截） |
| 审批领域层 | flow-approval-presenter | FlowMockContext / mockKey | Mock 模式支持 |
| 审批领域层 | flow-approval-presenter | operator-count 工具 | 选人数量限制适配 |
| 审批领域层 | flow-types | FormActionContext | 自定义表单数据注入 |
| 表面层(P端) | flow-pc-approval | 布局/动作 key + ActionFactory | 替换审批页布局与按钮 |
| 表面层(移动端) | flow-mobile-approval | 布局/动作 key + ActionFactory | 同上（移动端实现） |
| 表面层 | flow-pc-approval / flow-mobile-approval | registerFormItems | 注册自定义表单字段类型 |
| 设计器 | flow-design | FlowNodeRegistry | 节点类型注册（19 种内置） |
| 设计器 | flow-design | 11 个视图插件 key | 替换脚本编辑器/导入视图等 |
| 设计器 | flow-design | ActionFactory | 动作表单注册 |
| 设计器 | flow-design | Strategy 策略组件 | 节点配置策略 |

所有机制遵循 **「注册即覆盖，不注册用默认」** 原则，对现有行为零影响。

---

## 2. 内核层扩展点（@coding-flow/flow-core）

### 2.1 ViewBindPlugin — 全局视图组件注册中心

**源码**：`packages/flow-core/src/view-plugin.ts`

ViewBindPlugin 是框架最核心的定制入口，几乎所有 UI 组件都可以通过它被替换。它是一个**单例**，通过 `register(name, component)` 注册、`get(name)` 获取。

```typescript
export class ViewBindPlugin {
    public static getInstance(): ViewBindPlugin;
    public register(name: string, view: React.ComponentType<any>): void;
    public get(name: string): React.ComponentType<any> | undefined;
}
```

**工作原理**：框架在每个关键组件渲染前，都会先通过 `ViewBindPlugin.get(key)` 查找是否已有注册组件。若找到则直接渲染该组件（`<XxxComponent {...props} />`），否则渲染框架默认实现。这是各插件视图组件（见 §2.1 之后的各章）的统一定制模式：

```tsx
// 框架内部逻辑示例（任一插件视图组件）
const XxxComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
if (XxxComponent) {
    return <XxxComponent {...props} />;  // 已注册 → 渲染自定义组件
}
// 未注册 → 渲染内置默认 UI
```

**注册示例**（真实案例，`apps/app-pc/src/hooks/register-plugin-view.tsx`）：

```tsx
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { IMPORT_FORM_VIEW_KEY } from "@coding-flow/flow-design";

export const registerPluginView = () => {
    if (!registerRef) {   // 建议用模块级标记保证只注册一次
        registerRef = new RegisterRef();
        ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, ImportFormView);
    }
}
```

> **注意**：`register` 以 key 为索引，后注册的组件会覆盖先注册的。key 常量与 Props 契约见后续各章。

### 2.2 EventBus — 全局事件总线

**源码**：`packages/flow-core/src/event.ts`

EventBus 提供发布-订阅模式的事件通信，允许集成方监听框架内部事件，也可用于自定义动作的前端事件触发。

```typescript
export class EventBus {
    public static getInstance(): EventBus;
    public on(eventName: string, callback: Function): void;
    public emit(eventName: string, ...args: any[]): void;
    public off(eventName: string, callback?: Function): void;  // 不传 callback 则移除该事件全部监听
}
```

**使用场景一：自定义动作的前端事件触发**

后端可通过 `FlowAction.triggerFrontEvent` 字段配置一个事件名。当该动作按钮被点击时，框架会自动 `emit` 该事件：

```typescript
// 后端配置 flowAction.triggerFrontEvent = 'compile' 后，前端 App 层监听：
EventBus.getInstance().on('compile', () => {
    // 处理前端事件
});
```

**使用场景二：自定义组件中与其他模块通信**

```typescript
// 自定义 Header 组件中发送事件
const MyHeader = () => {
    const handleClick = () => {
        EventBus.getInstance().emit('header:refresh');
    };
    return <button onClick={handleClick}>刷新</button>;
};
```

> **注意**：`emit` 会逐个执行回调，单个回调抛出的异常会被捕获并 `console.error`，不会中断后续回调的执行。

### 2.3 BasePresenter / PresenterHooks — Presenter 模式

**源码**：`packages/flow-core/src/presenter.ts`、`packages/flow-core/src/hooks.ts`、`packages/flow-core/src/dispatch.ts`

Presenter 模式是框架业务逻辑与视图分离的核心机制：业务类（class）持有 `state + dispatch + model` 三要素，通过 `PresenterHooks.create()` 桥接 React useState，自动同步 state。

```typescript
// dispatch 类型
export type Dispatch<T> = (updater: ((prevState: T) => T) | T) => void;

// 基类
export class BasePresenter<S, M> {
    protected state: S;
    protected readonly dispatch: Dispatch<S>;
    protected readonly model: M;
    public constructor(state: S, dispatch: Dispatch<S>, model: M);
    public syncState(state: S): void;   // 外部 state 变化后同步内部快照
}

// 构造器类型
export type PresenterConstructor<P extends BasePresenter<S, M>, S, M> = {
    new(state: S, dispatch: Dispatch<S>, model: M): P;
};

// 桥接 React（注意：参数名源码拼写为 initStata）
export class PresenterHooks {
    public static create<P, S, M>(
        PresenterClass: PresenterConstructor<P, S, M>,
        initStata: S,
        model: M
    ): { state: S; presenter: P };
}
```

**使用方式**：

```typescript
import { BasePresenter, PresenterHooks } from "@coding-flow/flow-core";

interface MyState { count: number }
interface MyModel { api: MyApi }

class MyPresenter extends BasePresenter<MyState, MyModel> {
    public increment() {
        this.dispatch(prev => ({ ...prev, count: prev.count + 1 }));
    }
}

// 在 React 组件中：
const { state, presenter } = PresenterHooks.create(MyPresenter, { count: 0 }, { api });
```

**ContextScope 模式**：业务模块还会用 `ContextScope` 类封装 Presenter 并注入 React Context。审批模块的 `ApprovalContextScope`（见 §3）与设计器的 `NodeScope` 均采用此模式，集成方**无需自行实现**，只需通过对外 hook（如 `useApprovalContext()`）访问。

> **扩展场景**：Presenter 模式的扩展点在于——集成方可以**继承框架的 Presenter 类**（如 `FlowActionPresenter`）或**自定义 Presenter + ContextScope** 注入自己的 Context，从而在不改视图的前提下扩展业务逻辑。

### 2.4 HttpClient / MessageBox — HTTP 层

**源码**：`packages/flow-core/src/http.ts`

框架通过 `HttpClient` 封装 HTTP 请求。集成方可自定义超时、消息提示盒子与基础路径。

```typescript
export interface MessageBox {
    success: (msg: string) => void;
    error: (msg: string) => void;
}

export class HttpClient {
    public constructor(timeout: number, messageBox: MessageBox, baseUrl?: string);
    public setMessageBox(messageBox: MessageBox): void;   // 动态替换消息提示
    public get<T>(url: string, params?: any): Promise<Response<T>>;
    public post<T>(url: string, data: any): Promise<Response<T>>;
    public page<T>(url: string, params: any, sort: any, filter: any, match: any): Promise<...>;
    public postDownload(url: string, data: any, filename?: string): Promise<...>;
}
```

**使用方式**：

```typescript
import { HttpClient } from "@coding-flow/flow-core";

const myMessageBox: MessageBox = {
    success: (msg) => Notify.success(msg),
    error: (msg) => Notify.error(msg),
};

// 方式一：构造时注入
const httpClient = new HttpClient(30000, myMessageBox, '/api');

// 方式二：动态替换
httpClient.setMessageBox(myMessageBox);
```

> **提示**：message 文案本身可以通过 [FlowMessageRegistry 消息提示定制](./message-customization.md) 进一步自定义。审批模块的默认 `httpClient` 实现见 `flow-pc-approval/src/api/index.ts` / `flow-mobile-approval/src/api/index.ts`。

### 2.5 FlowMessageRegistry / FlowMessageKey — 消息文案

**源码**：`packages/flow-core/src/message.ts`

框架所有消息提示（HTTP 错误、审批成功/失败、设计器编译等）的文案都通过 `FlowMessageRegistry` 管理。`FlowMessageKey` 约 27 个常量，如：

- `FlowMessageKey.HTTP_TOKEN_EXPIRED`（`'http.token.expired'`）
- `FlowMessageKey.APPROVAL_PASS`（`'approval.pass'`）
- 设计器脚本编译：`DESIGN_SCRIPT_COMPILE_SUCCESS / FAILED / ERROR`

```typescript
export class FlowMessageRegistry {
    public static getInstance(): FlowMessageRegistry;
    public register(key: string, value: string | ((data?: any) => string)): void;
    public registerAll(messages: Record<string, string | ((data?: any) => string)>): void;
    public get(key: string, data?: any): string;
}
```

**使用方式**（支持函数式文案，接收 `FlowActionPresenter.buildActionContext()` 构建的上下文）：

```typescript
import { FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";

FlowMessageRegistry.getInstance().registerAll({
    [FlowMessageKey.APPROVAL_PASS]: '审批通过',
    [FlowMessageKey.APPROVAL_SAVE]: (data) =>
        data.isStartNode ? '流程已发起' : '已保存',
});
```

> 详细清单见 [消息提示定制](./message-customization.md)。

### 2.6 GroovyScriptConvertorUtil — Groovy 脚本工具

**源码**：`packages/flow-core/src/groovy.ts`

设计器与审批的动作脚本都是 Groovy 字符串，脚本头部带 `// @SCRIPT_TITLE`、`// @SCRIPT_META`、`// @CUSTOM_SCRIPT` 标记。`GroovyScriptConvertorUtil` 提供解析与转换工具：

```typescript
export class GroovyScriptConvertorUtil {
    public static isCustomScript(script: string): boolean;   // 是否为高级（自定义）脚本
    public static toCustomScript(script: string): string;    // 给脚本加 @CUSTOM_SCRIPT 标记
    public static getScriptTitle(script: string): string;    // 读取 @SCRIPT_TITLE
    public static getScriptMeta(script: string): string;     // 读取 @SCRIPT_META（JSON 字符串）
    public static formatScript(script: string): string;      // 格式化脚本
}
```

典型用法（设计器 `useScriptMetaData` hook，`flow-design/src/script-components/hooks/use-script-meta-data.ts`）：

```typescript
export const useScriptMetaData = (script: string) => {
    const meta = GroovyScriptConvertorUtil.getScriptMeta(script);
    if (meta) { return JSON.parse(meta); } else { return {}; }
};
```

---

## 3. 审批领域扩展点（@coding-flow/flow-approval-presenter）

### 3.1 FlowApprovalApi — 替换后端 API 实现

**源码**：`packages/flow-approval-presenter/src/typings/index.ts`

审批模块的所有后端调用都经由 `FlowApprovalApi` 接口。默认实现为 `FlowApprovalApiImpl`（底层调用 `HttpClient` 请求 `/api/cmd/record/*` 与 `/api/query/record/*`）。集成方实现该接口即可适配自有后端。

```typescript
export interface FlowApprovalApi {
    create(body: Record<string, any>, mockKey: string): Promise<number>;
    processNodes(body: Record<string, any>, mockKey: string): Promise<ProcessNode[]>;
    action(body: Record<string, any>, mockKey: string): Promise<any>;
    revoke(id: any, mockKey: string): Promise<any>;
    urge(id: any, mockKey: string): Promise<any>;
}
```

**注入方式**：`createApprovalContext(props, api)` 是一个 **React Hook**（内含 `useRef`/`useDispatch`/`useSelector`），必须在组件内调用。框架内部通过 `useApprovalContext()` 返回的 ContextScope 访问 Presenter。

```tsx
import { createApprovalContext } from "@coding-flow/flow-approval-presenter";

const myApi: FlowApprovalApi = {
    create: async (body, mockKey) => { /* 自定义实现 */ },
    processNodes: async (body, mockKey) => { /* ... */ },
    action: async (body, mockKey) => { /* ... */ },
    revoke: async (id, mockKey) => { /* ... */ },
    urge: async (id, mockKey) => { /* ... */ },
};

// 在 React 组件中（不能脱离组件调用）：
const { state, context } = createApprovalContext(props, myApi);
```

**替换默认实现**：框架默认在 `layout/index.tsx` 中调用 `createApprovalContext(props, new FlowApprovalApiImpl())`。集成方若要替换，需自行实现 `ApprovalLayout`/`ApprovalPanel` 的等价入口（参考 `flow-pc-approval/src/components/flow-approval/layout/index.tsx` 与 `view.tsx`），将自定义 API 传入。

### 3.2 审批上下文 hooks

**源码**：`packages/flow-approval-presenter/src/hooks/use-approval-context.ts`、`packages/flow-approval-presenter/src/hooks/use-mock-context.tsx`

审批模块通过 `Provider store={approvalStore}` + `ApprovalContext.Provider` 注入全局状态，向集成方暴露两个 hook：

```typescript
// 审批上下文：state 为 Redux 响应式状态，context 为 ContextScope（含 Presenter 访问入口）
export const useApprovalContext = () => {
    // 返回 { state, context }
    // state: ApprovalState = { flow?: FlowContent; review?: boolean; actionLoading?: boolean }
    // context.getPresenter().getFlowActionPresenter() / getFormActionContext() 等
}

// Mock 上下文：返回 FlowMockContext 注入的 mockKey（默认为 undefined）
export const useMockContext = () => { ... }
```

**在自定义组件中访问框架业务逻辑**：

```tsx
const MyCustomView = () => {
    const { state, context } = useApprovalContext();
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    // 提交审批
    const res = await actionPresenter.action(actionId, params);
    // 校验动作可见性
    const hidden = FlowActionPresenter.isActionHidden(state.flow?.actions || [], actionId);
    return null;
};
```

### 3.3 审批子视图插件（7 个）

**源码**：`packages/flow-approval-presenter/src/plugins/*-type.ts`（key 常量与 Props 接口）、`flow-pc-approval/src/plugins/view/*.tsx` 与 `flow-mobile-approval/src/plugins/view/*.tsx`（默认实现）

审批动作的**人员选择、签名、节点选择**等子视图均为可替换插件。key 常量与 Props 接口定义在 `@coding-flow/flow-approval-presenter`，默认实现组件在 PC/移动端各有一份。**注册即整体替换默认实现**。

| key 常量（导出名） | key 值 | 默认 UI（PC） | 默认 UI（移动端） | 使用位置 |
|---|---|---|---|---|
| `AddAuditViewPluginKey` | `'AddAuditViewPlugin'` | antd Select | antd-mobile Selector | 加签动作 |
| `DelegateViewPluginKey` | `'DelegateViewPlugin'` | antd Select | Selector | 委托动作 |
| `TransferViewPluginKey` | `'TransferViewPlugin'` | antd Select | Selector | 转办动作 |
| `ReturnViewPluginKey` | `'ReturnViewPlugin'` | antd Select（退回节点） | Selector | 退回动作 |
| `SignKeyViewPluginKey` | `'SignKeyViewPlugin'` | antd Input.TextArea | antd-mobile TextArea | 通过/驳回动作（签名） |
| `OperatorSelectViewPluginKey` | `'OperatorSelectViewPlugin'` | ResizableModal + antd Form | PopupModal + Selector | 通过动作（指定下一节点操作人） |
| `ManualViewPluginKey` | `'ManualViewPlugin'` | ResizableModal + antd Select | PopupModal + Selector | 手动节点走向选择 |

**组件 Props 契约**（自定义组件必须兼容）：

```typescript
// 选人类（加签/委托/转办）— 三个接口字段完全一致
interface AddAuditViewPlugin {   // DelegateViewPlugin / TransferViewPlugin 同构
    onChange?: (value: string | string[]) => void;   // 返回用户
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;    // 动作控制
    maxOperatorCount?: number;                       // 最大可选人数，-1/缺省=不限制
}

// 退回节点选择（无 maxOperatorCount）
interface ReturnViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// 签名
interface SignKeyViewPlugin {
    current: FlowOperator;                            // 当前用户
    onChange?: (value: string) => void;
    value?: string;
    action?: React.Ref<ApprovalViewPluginAction>;
}

// 指定操作人（通过动作中 responseType === 'OPERATOR_SELECT' 时弹出）
interface OperatorSelectViewPlugin {
    onChange: (value: Record<string, number[]>) => void;  // { nodeId: userId[] }
    options: NodeOption[];
}

// 手动节点走向选择
interface ManualViewPlugin {
    onChange: (value: string) => void;   // 返回下级节点 id
    options: NodeOption[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// 动作控制接口：暴露验证方法给框架在提交前调用
interface ApprovalViewPluginAction {
    onValidate: () => Promise<boolean>;
}
```

`NodeOption`（`flow-types/src/types/flow-approval.ts`）：

```typescript
export interface NodeOption {
    id: string;
    name: string;
    type: string;
    display: boolean;
    operators?: ProcessNodeOperator[];   // 可选人员范围；为空/缺省表示不限范围
    maxOperatorCount?: number;           // 最大可选人数，-1/缺省=不限制，1=单选
}
```

**注册示例**：

```tsx
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { SignKeyViewPluginKey } from "@coding-flow/flow-approval-presenter";

const MySignatureView: React.FC<SignKeyViewPlugin> = (props) => (
    <div>
        <input value={props.value} onChange={e => props.onChange?.(e.target.value)} />
    </div>
);

ViewBindPlugin.getInstance().register(SignKeyViewPluginKey, MySignatureView);
```

> **重要**：`maxOperatorCount` 由框架从 `FlowAction.maxOperatorCount` 透传给选人视图（`add-audit.tsx`/`delegate.tsx`/`transfer.tsx` 中 `maxOperatorCount={action.maxOperatorCount}`）。自定义选人组件**必须**据此限制可选人数：`maxOperatorCount === 1` 时单选，正整数时限制多选上限，`-1`/缺省不限制。

### 3.4 maxOperatorCount — 选人数量限制能力

**背景**：issue-195 引入的能力。人员限制不仅作用于业务层，且 `maxOperatorCount` 会传递到前端组件，使前端据此适配组件呈现（单选 / 多选上限 / 不限制）。

**取值语义**（全框架统一）：

| 值 | 语义 |
|----|------|
| `-1` 或缺省 | 不限制可选人数 |
| `1` | 单人选 |
| `正整数 n` | 最多可选 n 人 |

**出现位置**：

| 位置 | 类型 | 说明 |
|------|------|------|
| `FlowAction.maxOperatorCount` | 审批动作 | 加签/委托/转办动作的选人上限 |
| `NodeOption.maxOperatorCount` | 节点选项 | 指定操作人节点、手动节点选项的选人上限 |
| `OperatorLoadStrategy.maxOperatorCount` | 设计器策略 | 操作人配置（仅 `INITIATOR_SELECT`/`APPROVER_SELECT` 范围模式显示） |
| 动作表单 `maxOperatorCount` 字段 | 设计器动作配置 | 加签/委托/转办动作表单顶部「最大可选人数」 |

**前端适配工具**（`flow-approval-presenter/src/utils/operator-count.ts`）：

```typescript
export const normalizeOperatorIds = (val: unknown): number[];
export const buildOperatorInitialValues = (options: NodeOption[]): Record<string, any>;
export const isSingleOperatorMode = (maxOperatorCount?: number): boolean;   // (max ?? -1) === 1
export const hasOperatorCountLimit = (maxOperatorCount?: number): boolean;  // (max ?? -1) >= 0
```

**自定义选人组件适配示例**：

```tsx
import { isSingleOperatorMode, hasOperatorCountLimit } from "@coding-flow/flow-approval-presenter";

const MyUserSelect: React.FC<AddAuditViewPlugin> = (props) => {
    const single = isSingleOperatorMode(props.maxOperatorCount);
    const limited = hasOperatorCountLimit(props.maxOperatorCount);
    // single → 单选组件；limited → multiple + maxCount={props.maxOperatorCount}；否则多选不限
    return <MySelect mode={single ? undefined : 'multiple'} maxCount={props.maxOperatorCount} />;
};
```

### 3.5 ActionInterceptor — 审批动作拦截器

**源码**：`packages/flow-approval-presenter/src/interceptor/action-interceptor.ts`、`packages/flow-approval-presenter/src/presenters/action.ts`

所有审批操作按钮（通过/驳回/暂存/加签/委托/退回/转办/自定义）点击后、真正提交前会按订阅顺序执行拦截器。**任一拦截器返回 `false` 即短路**，终止本次操作。

```typescript
export interface ActionInterceptorContext {
    actionId: string;
    action: FlowAction | null;
    params?: any;
}
export type ActionInterceptor = (context: ActionInterceptorContext) => boolean | Promise<boolean>;

export class ActionInterceptorManager {
    public add(interceptor: ActionInterceptor): () => void;   // 返回取消订阅函数
    public remove(interceptor: ActionInterceptor): void;
    public clear(): void;
    public size(): number;
    public async intercept(context: ActionInterceptorContext): Promise<boolean>;  // 任一 false 短路
}
```

**注入入口** — `FlowActionPresenter`：

```typescript
public addActionInterceptor(interceptor: ActionInterceptor): () => void;      // 订阅
public removeActionInterceptor(interceptor: ActionInterceptor): void;        // 取消
public async interceptAction(actionId: string, params?: any): Promise<boolean>; // 手动触发拦截
public async action(actionId: string, params?: any): Promise<any>;            // 提交（自动先拦截）
```

- `action()` 提交前自动调用 `interceptAction(actionId, params)`，被拦截时返回 `{ success: false, intercepted: true }`。
- 配置了 `triggerFrontEvent` 的自定义按钮不会走 `action()`，需在自定义组件中手动调用 `interceptAction` 保持「点击即拦截」语义。

**使用方式**：

```tsx
const MyActionView = () => {
    const { context } = useApprovalContext();
    useEffect(() => {
        // 在提交前校验自定义表单，不通过则拦截
        const unsubscribe = context.getPresenter()
            .getFlowActionPresenter()
            .addActionInterceptor(async ({ actionId }) => {
                const form = await myFormRef.current?.validateFields().catch(() => null);
                return form !== null;
            });
        return unsubscribe;   // 组件卸载时务必取消订阅
    }, []);
    return null;
};
```

### 3.6 FormActionContext — 表单数据注入

**源码**：`packages/flow-types/src/types/form-action.ts`

当自定义表单视图（通过 ViewBindPlugin 注册）需要把自己的数据注入框架提交流程时，使用 FormActionContext。提交时框架会合并所有已注册表单的数据。

```typescript
export interface IFormAction {
    save(): any;                 // 返回表单数据
    key(): string;               // 唯一标识，用于去重
    validate(): Promise<any>;    // 表单校验
}

export class FormActionContext {
    public addAction(submit: IFormAction): void;   // 按 key 去重，重复注册忽略
    public removeAction(key: string): void;
    public save(): any;                            // 合并所有已注册表单数据（顺序 Object.assign）
    public async validate(): Promise<any>;         // 串行校验所有已注册表单
}
```

**使用方式**：

```tsx
const MyCustomFormView = () => {
    const { context } = useApprovalContext();
    const formActionContext = context.getPresenter().getFormActionContext();

    useEffect(() => {
        const formActionKey = 'my-custom-form';
        formActionContext.addAction({
            key: () => formActionKey,
            save: () => myFormRef.current?.getFieldsValue(),
            validate: () => myFormRef.current?.validateFields(),
        });
        return () => formActionContext.removeAction(formActionKey);
    }, []);

    return <MyForm ref={myFormRef} />;
};
```

> **关键点**：`FlowActionPresenter.action()` 内，通过动作（PASS 及其 triggerType = PASS 的自定义动作）会先 `FormActionContext.validate()` 再提交；其他动作 `save()` 直接提交。组件卸载时务必 `removeAction()` 清理。

### 3.7 FlowMockContext / mockKey — Mock 模式

**源码**：`packages/flow-approval-presenter/src/context/mock.tsx`、`packages/flow-approval-presenter/src/hooks/use-mock-context.tsx`

审批模块支持 Mock 模式：所有 `FlowApprovalApi` 调用都会附带 `mockKey` query 参数，后端据此分流到 Mock 仓储。`FlowMockContext` 由 PC 端 `FlowMock` 组件（`flow-pc-approval/src/components/flow-mock/index.tsx`）注入。

```tsx
import { FlowMockContext } from "@coding-flow/flow-approval-presenter";

// 在 App 顶层包裹 Mock 上下文
<FlowMockContext.Provider value={mockKey}>
    <ApprovalPanel ... />
</FlowMockContext.Provider>
```

集成方可直接使用框架导出的 `FlowMock` 组件（PC 端）快速搭建 mock 流程；mock 数据通过 `/api/cmd/workflow/mock` 创建、`/api/cmd/workflow/cleanMock` 清理。

---

## 4. PC / 移动端审批扩展点

### 4.1 入口组件

**源码**：`flow-pc-approval/src/components/flow-approval/view.tsx`、`flow-mobile-approval/src/components/flow-approval/view.tsx`、`flow-approval-presenter/src/typings/index.ts`

| 组件 | 包 | 说明 |
|------|-----|------|
| `ApprovalPanel` | 两包均有 | 内联审批面板 |
| `ApprovalPanelDrawer` | 仅 PC | Drawer 包裹的审批面板 |
| `FlowTitle` | 仅 PC | 流程标题 |
| `WorkflowSelectModal` | 仅 PC | 流程选择弹窗 |
| `FlowMock` | 仅 PC | Mock 流程创建/清理 |

```tsx
// 公共 Props（两包一致）
interface ApprovalPanelProps {
    initData?: any;          // 初始化表单数据
    workflowCode?: string;   // 流程设计编码
    recordId?: string;       // 流程记录 id（有值=审批，无值=发起）
    onClose?: () => void;
    review?: boolean;        // 查看详情（非审批）时为 true
    className?: string;
}

// 仅 PC 端
interface ApprovalPanelDrawerProps extends ApprovalPanelProps {
    open: boolean;
    onClose: () => void;
    drawerClassName?: string;
}
```

```tsx
// PC 端
import { ApprovalPanelDrawer } from "@coding-flow/flow-pc-approval";

<ApprovalPanelDrawer
    workflowCode={workflowCode}
    recordId={recordId}
    open={visible}
    review={isReview}
    onClose={() => setVisible(false)}
/>

// 移动端
import { ApprovalPanel } from "@coding-flow/flow-mobile-approval";

<ApprovalPanel
    workflowCode={workflowCode}
    recordId={recordId}
    review={isReview}
    onClose={() => navigate(-1)}
/>
```

### 4.2 审批布局 key

**源码**：两包各自 `src/components/flow-approval/typings/plugin-type.ts`；消费点 PC `layout/header.tsx`、`layout/body.tsx`、`layout/footer.tsx`、`components/flow-approval-sider.tsx`，移动端 `layout/header.tsx`、`layout/body.tsx`、`layout/footer.tsx`

| key 常量 | PC | 移动端 | 默认内容 |
|----------|----|--------|----------|
| `APPROVAL_HEADER_VIEW_KEY` | ✅ | ✅ | PC：标题 + 动作按钮条；移动：NavBar + 标题 |
| `APPROVAL_BODY_VIEW_KEY` | ✅ | ✅ | PC：表单 + 侧边栏；移动：表单内容 |
| `APPROVAL_FOOTER_VIEW_KEY` | ✅ | ✅ | PC：空；移动：动作底栏 |
| `APPROVAL_BODY_SIDER_VIEW_KEY` | ✅ | ❌ | 可折叠 Sider（流程记录 `FlowNodeHistory`） |

### 4.3 审批动作按钮 key

**源码**：同上 `plugin-type.ts`；各动作组件（`action/*.tsx`）内 `ViewBindPlugin.getInstance().get(KEY)`，命中即替换整个按钮。

| key 常量 | PC | 移动端 | 默认动作 |
|----------|----|--------|----------|
| `APPROVAL_ACTION_PASS_KEY` | ✅ | ✅ | 通过 |
| `APPROVAL_ACTION_REJECT_KEY` | ✅ | ✅ | 驳回 |
| `APPROVAL_ACTION_SAVE_KEY` | ✅ | ✅ | 保存 |
| `APPROVAL_ACTION_ADD_AUDIT_KEY` | ✅ | ✅ | 加签 |
| `APPROVAL_ACTION_DELEGATE_KEY` | ✅ | ✅ | 委托 |
| `APPROVAL_ACTION_RETURN_KEY` | ✅ | ✅ | 退回 |
| `APPROVAL_ACTION_TRANSFER_KEY` | ✅ | ✅ | 转办 |
| `APPROVAL_ACTION_CUSTOM_KEY` | ✅ | ✅ | 自定义动作 |
| `APPROVAL_ACTION_REVOKE_KEY` | ✅ | ✅ | 撤回 |
| `APPROVAL_ACTION_URGE_KEY` | ✅ | ✅ | 催办 |
| `APPROVAL_ACTION_CLOSE_KEY` | ✅ | ❌ | 关闭（仅 PC） |

> 动作按钮的 key 值即常量名本身（如 `'APPROVAL_ACTION_PASS_KEY'`）。替换时自定义组件会**完全接管**该按钮的渲染与交互，建议参考默认实现中的 `actionPresenter.action()` 提交流程。

### 4.4 ActionFactory — 动作组件工厂

**源码**：`flow-pc-approval/src/components/flow-approval/components/action/factory.tsx`、`flow-mobile-approval/.../action/factory.tsx`

`ActionFactory` 是单例，按 `ActionType` 注册 8 种动作组件。**注意：工厂没有公开的 register 方法**，动作替换一律通过 ViewBindPlugin 的 key 完成（见 §4.3）。

```typescript
// ActionType（flow-types/src/types/flow-design.ts）
type ActionType = 'SAVE' | 'PASS' | 'REJECT' | 'ADD_AUDIT' | 'DELEGATE' | 'RETURN' | 'TRANSFER' | 'CUSTOM';

// 工厂内部注册表（两包一致）
// ADD_AUDIT → AddAuditAction、CUSTOM → CustomAction、DELEGATE → DelegateAction、
// PASS → PassAction、REJECT → RejectAction、RETURN → ReturnAction、
// SAVE → SaveAction、TRANSFER → TransferAction

// PC 端
export class ActionFactory {
    public static getInstance(): ActionFactory;
    public getFlowActionComponent(action: FlowAction): React.ComponentType<FlowActionProps> | undefined;
}

// 移动端
export class ActionFactory {
    public static getInstance(): ActionFactory;
    public render(action: FlowAction): React.FC<FlowActionProps> | undefined;  // 直接返回元素
}
```

> `REVOKE`/`URGE`/`CLOSE` 不在工厂内，由 `FlowApprovalActions` 直接渲染（PC：撤指+催办+关闭；移动：撤回+催办）。

**FlowActionProps**（工厂组件的统一 props，PC 与移动端不一致）：

```typescript
// PC 端（action/type.ts）
interface FlowActionProps {
    action: FlowAction;
    onClickCheck?: (actionId: string) => boolean;   // 合并审批校验
    hidden: boolean;                                // 是否隐藏（FlowActionPresenter.isActionHidden 计算）
}

// 移动端（action/type.tsx）
interface FlowActionProps {
    action: FlowAction;
}
```

**自定义动作（CUSTOM）的分发优先级**（`action/custom.tsx`）：

```text
ViewBindPlugin.get(APPROVAL_ACTION_CUSTOM_KEY) 命中 → 渲染自定义组件
  → 配置了 triggerFrontEvent → EventBus.emit(triggerFrontEvent)（PC 端先 interceptAction 再 emit）
  → 配置了 triggerType → ActionFactory 复用对应类型组件（如 triggerType='PASS' 渲染通过组件）
  → 均未配置 → 无渲染
```

### 4.5 CustomStyleButton / FlowActionDisplay — 动作样式

**源码**：两包 `src/components/flow-approval/components/custom-style-button.tsx`；类型在 `flow-types/src/types/flow-approval.ts`

审批动作按钮外观由后端返回的 `FlowAction.display` 驱动，**通常无需前端代码修改**。

```typescript
export interface FlowActionDisplay {
    title: string;   // 标题
    style: string;   // 样式（JSON 字符串）
    icon: string;    // 图标名（@coding-flow/flow-icons 渲染）
}
export interface DisplayStyle {
    borderColor?: string;      // 边框色（不带 #，渲染时补 #）
    backgroundColor?: string;  // 背景色（同上）
    borderSize?: string;       // 边框宽度 px（映射 CSS borderWidth）
    borderRadius?: string;     // 圆角 px
    script?: string;           // 展示按钮控制脚本
}
```

`CustomStyleButton` 解析逻辑（两包一致）：

```typescript
const data = JSON.parse(display.style) as DisplayStyle | undefined;
if (data.backgroundColor) style = Object.assign(data, { backgroundColor: `#${data.backgroundColor}` });
if (data.borderColor)     style = Object.assign(data, { borderColor: `#${data.borderColor}` });
if (data.borderRadius)    style = Object.assign(data, { borderRadius: Number.parseInt(data.borderRadius) });
if (data.borderSize)      style = Object.assign(data, { borderWidth: Number.parseInt(data.borderSize) });
```

### 4.6 registerFormItems — 注册自定义表单字段类型

**来源**：`@coding-form/form-engine`（外部依赖）

表单引擎通过 `registerFormItems` 注册自定义字段渲染组件。字段类型由流程设计器创建字段时选择，定义在 `@coding-flow/flow-types` 的 `FormTypeContext` 中。

```typescript
import { registerFormItems } from "@coding-form/form-engine";
import { Form } from "antd";

registerFormItems(Form, [
    { type: 'string', componentType: MyStringInput },
    { type: 'integer', componentType: MyIntegerInput },
    { type: 'custom-selector', componentType: MyCustomSelector },
]);
```

> **注意**：`FormTypeContext.register` 是**整体替换**（替换该类型现有注册项），注册前请确认会覆盖框架默认字段组件。

### 4.7 审批动作按钮样式 & 动作数据模型

`FlowAction`（`flow-types/src/types/flow-approval.ts`）是审批动作的数据模型，后端在 `FlowContent.actions` 中返回：

```typescript
export interface FlowAction {
    id: string;
    title: string;
    type: ActionType;
    display: FlowActionDisplay;
    enable: boolean;
    script?: string;                 // 自定义脚本
    maxOperatorCount?: number;       // 最大可选人数，-1=不限制，正整数=上限（转办/委托/加签选人时使用）
    triggerType?: string;            // 触发类型，自定义脚本使用（转发为其他动作类型）
    triggerFrontEvent?: string;      // 前端触发事件（点击时 EventBus.emit）
}
```

---

## 5. 流程设计器扩展点（@coding-flow/flow-design）

### 5.1 包公开 API

**源码**：`flow-design/src/index.ts`

```typescript
export * from '@/components/design-panel';   // DesignPanel
export * from '@/components/design-import';  // DesignImport
export * from '@/plugins';                   // 11 个视图插件 key + 类型
```

| 导出 | 说明 |
|------|------|
| `DesignPanel` | 设计面板入口（Drawer 包裹），`props: { id?, open, onClose?, drawerClassName?, className? }` |
| `DesignImport` | 流程导入组件，`props: { open, onClose }` |
| 11 个插件 key + 类型 | 见 §5.3 |

> **注意**：`FlowEditor`、`FlowNodeRegistry`、`FlowNodeRegistries`、`FlowNodeRegistry` 类型**不是**包公开 API（`dist/index.d.ts` 与源码一致）。自定义节点类型需在框架源码内扩展（见 §5.2）。

### 5.2 FlowNodeRegistry — 节点类型注册

**源码**：`flow-design/src/components/design-editor/typings/node.tsx`（接口）、`flow-design/src/components/design-editor/nodes/index.ts`（19 种注册项）

设计器基于 `@flowgram.ai/fixed-layout-editor`，通过 `FlowNodeRegistry` 接口定义节点元数据并注册。内置 19 种节点类型与 `flow-types` 的 `NodeType` 联合类型一一对应。

```typescript
export interface FlowNodeRegistry extends FlowNodeRegistryDefault {
    meta?: FlowNodeMeta;                                    // 扩展：sidebarDisable / style / editTitleDisable
    info: { icon: string; description: string; };
    canAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
    canDelete?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
    onAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => FlowNodeJSON;
}
```

| 注册常量 | type | extend | 特性 |
|----------|------|--------|------|
| `StartNodeRegistry` | `'START'` | — | 开始节点，不可删除/复制/添加 |
| `EndNodeRegistry` | `'END'` | `'end'` | 结束节点，`sidebarDisable` |
| `ApprovalNodeRegistry` | `'APPROVAL'` | — | 审批节点 |
| `HandleNodeRegistry` / `DelayNodeRegistry` / `NotifyNodeRegistry` / `TriggerNodeRegistry` / `SubProcessNodeRegistry` | 对应类型 | — | 办理/延时/通知/触发/子流程 |
| `RouterNodeRegistry` | `'ROUTER'` | `'end'` | 路由，`canAdd` 仅条件分支内可添加 |
| `ConditionNodeRegistry` / `ParallelNodeRegistry` / `InclusiveNodeRegistry` / `ManualNodeRegistry` | 对应类型 | `DYNAMIC_SPLIT` | 分支容器 |
| `ConditionBranchNodeRegistry` 等 6 个分支节点 | 对应类型 | `'block'` | 分支块，`onAdd` 生成节点 |

**注册链路**：`FlowNodeRegistries` 数组 → `useEditorProps(initialData, FlowNodeRegistries)` → `<FixedLayoutEditorProvider>`。**当前没有运行时注册 API**，扩展自定义节点类型的方式是：

1. 在 `nodes/index.ts` 数组中追加一个 `FlowNodeRegistry` 对象（复刻现有条目结构）；
2. 确保后端 `api.createNode(type)` 支持该类型（节点初始数据由后端决定）。

**添加节点 UI**：`Adder`（`components/node-adder`）弹出 `NodeList`（`components/node-list`），逻辑为 `FlowNodeRegistries.filter(r => !r.meta?.addDisable)`，`canAdd` 返回 false 的节点禁用。

### 5.3 设计器视图插件（11 个 key）

**源码**：`flow-design/src/plugins/index.ts`（导出）、`flow-design/src/plugins/*-type.ts`（接口）、`flow-design/src/plugins/view/*.tsx`（默认实现）

所有插件接口共用动作控制字段 `action?: React.Ref<DesignViewPluginAction>`：

```typescript
export interface DesignViewPluginAction {
    onValidate: (script: string) => Promise<boolean>;
}
```

| key 常量 | key 值 | Props 接口 | 默认实现 |
|----------|--------|------------|----------|
| `OperatorLoadViewPluginKey` | `'OperatorLoadViewPlugin'` | `{ script, onChange, action? }` | `OperatorLoadPluginView` |
| `OperatorCreateViewPluginKey` | `'OperatorCreateViewPlugin'` | 同上 | `OperatorCreatePluginView` |
| `ConditionViewPluginKey` | `'ConditionViewPlugin'` | `{ type, script, variables, onChange, action? }` | `ConditionPluginView` |
| `RouterViewPluginKey` | `'RouterViewPlugin'` | 同上 | `RouterPluginView` |
| `SubProcessViewPluginKey` | `'SubProcessViewPlugin'` | 同上 | `SubProcessPluginView` |
| `TriggerViewPluginKey` | `'TriggerViewPlugin'` | 同上 + **`scriptKey`** | `TriggerPluginView` |
| `NodeTitleViewPluginKey` | `'NodeTitleViewPlugin'` | `{ type, script, variables, onChange, action? }` | `NodeTitlePluginView` |
| `ErrorTriggerViewPluginKey` | `'ErrorTriggerViewPlugin'` | 同上 + `nodeOnly?` | `ErrorTriggerPluginView` |
| `ActionCustomViewPluginKey` | `'ActionCustomViewPlugin'` | `{ scriptKey, value?, onChange?, action? }` | `ActionCustomView` |
| `ActionRejectViewPluginKey` | `'ActionRejectViewPlugin'` | `{ nodeId, value?, onChange?, action? }` | `ActionRejectView` |
| `IMPORT_FORM_VIEW_KEY` | `'ImportFormViewPlugin'` | `{ open, onSelect, onCancel }` | 无默认实现（未注册返回 null） |

其中：

- `GroovyVariableMapping`（`flow-design/src/script-components/typings/script.ts`）：`{ label, value, type, expression, tag, order }`，`tag` 取值 `VariableTag.OPERATOR/WORKFLOW/FORM_FIELD`。
- `ScriptType` 枚举：`TITLE / CONDITION / OPERATOR_LOAD / OPERATOR_CREATE / ERROR_TRIGGER / TRIGGER / ROUTER / SUB_PROCESS / SUB_PROCESS_RESULT / CUSTOM_ACTION / ACTION_DISPLAY`（注意：`OPERATOR_CREATE` 与 `OPERATOR_LOAD` 字面量同值 `'OPERATOR_LOAD'`，为源码现状）。
- `IMPORT_FORM_VIEW_KEY` 是官方注册示例（见 §2.1 的 `apps/app-pc` 案例），未注册时“导入表单”视图返回 null。

**默认脚本常量**（`flow-design/src/script-components/default-script.ts`）：

| 常量 | @SCRIPT_TITLE | 用途 |
|------|---------------|------|
| `SCRIPT_DEFAULT_OPERATOR_CREATE` | 任意用户 | 发起人范围 |
| `SCRIPT_DEFAULT_OPERATOR_LOAD` | 流程创建者 | 操作人配置 |
| `SCRIPT_INITIATOR_SELECT` | 发起人设定 | 操作人范围 |
| `SCRIPT_APPROVER_SELECT` | 审批人设定 | 操作人范围 |
| `SCRIPT_DEFAULT_NODE_TITLE` | 您有一条待办消息 | 节点标题 |
| `SCRIPT_DEFAULT_ERROR_TRIGGER` | 回退至开始节点 | 异常触发 |
| `SCRIPT_DEFAULT_CONDITION` / `SCRIPT_DEFAULT_ROUTER` / `SCRIPT_DEFAULT_TRIGGER` / `SCRIPT_DEFAULT_CUSTOM` | 对应默认值 | 条件 / 路由 / 触发 / 自定义动作 |
| `SCRIPT_DEFAULT_SUB_PROCESS` / `SCRIPT_DEFAULT_SUB_PROCESS_RESULT` | 创建当前流程 / 全部结束后继续 | 子流程 |

### 5.4 设计器动作表单 ActionFactory

**源码**：`flow-design/src/script-components/components/action/components/factory.tsx`

设计器侧边栏「按钮配置」的动作表单也通过单例工厂分发。**同样没有公开 register 方法**，扩展需修改 `initialize()`。

```typescript
export class ActionFactory {
    public static getInstance(): ActionFactory;
    public getActionForm(type: ActionType): React.ComponentType<ActionFormProps> | undefined;
    // 内部注册：ADD_AUDIT / CUSTOM / DELEGATE / REJECT / TRANSFER（SAVE/PASS/RETURN 无专属表单）
}
```

`ActionFormProps`（`flow-design/src/script-components/typings/action.ts`）：

```typescript
export interface ActionFormProps {
    nodeId: string;
    manager: FlowActionManager;
    form: FormInstance<any>;
    onFinish: (values: any) => void;
}
```

**加签/委托/转办动作表单**（`components/add-audit.tsx`、`delegate.tsx`、`transfer.tsx`）包含两个表单项：

- `maxOperatorCount`（`MaxOperatorCountInput`，label「最大可选人数」，帮助文案说明 -1 不限制 / 1 即单选）—— 位于表单**顶部**；
- `script`（内嵌 `OperatorLoadPluginView` 作为人员范围选择，label「加签/委派/转办人员范围」）。

`MaxOperatorCountInput`（`components/max-operator-count.tsx`）：`min=-1`，空值按 `DEFAULT_MAX_OPERATOR_COUNT = -1` 处理，避免 null 落库。

### 5.5 脚本加载与编辑骨架

**源码**：`flow-design/src/script-components/components/groovy-script-modal.tsx`、`groovy-script-loader.tsx`、`flow-design/src/api/script.ts`

**GroovyScriptModal** — 脚本弹窗骨架：

```typescript
export interface GroovyScriptModalProps {
    open: boolean; type: ScriptType; script: string; scriptKey: string;
    resetScript?: () => string; variables: GroovyVariableMapping[];
    onConfirm: (script: string) => void; onCancel: () => void;
    width?: number | string; title?: string;
    content: React.ComponentType<GroovyScriptContent>;
}
export interface GroovyScriptContent {
    title?: string; type: ScriptType; script: string; scriptKey: string;
    variables: GroovyVariableMapping[]; onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>; resetScript?: () => string; readonly?: boolean;
}
```

确认流程：`actionRef.current.onValidate(content).then(res => res && onConfirm(content))`——即 `DesignViewPluginAction.onValidate` 在此被消费。

**GroovyScriptLoader** — 脚本按 key 持久化加载器：

```typescript
export interface GroovyScriptLoaderProps {
    value?: string;   // scriptKey
    onChange?: (value: string) => void;
    content: React.ComponentType<GroovyScriptLoaderContent>;  // { scriptKey, value?, onChange? }
}
```

按 `scriptKey` 通过 `getScript(key)`（GET `/api/groovy-script/getScript`）回读，变更时 `save({key, script})`（POST `/api/groovy-script/save`）保存，多实例经 `EventBus` 广播 `'groovy-script-updated'` 同步。配套 API：`compile`（POST `/api/groovy-script/compile`）、`getMetadata`（GET `/api/groovy-script/getMetadata`）。

**各场景 ConfigModal**（`script-components/modal/`）统一模式：`isCustomScript(script)` 为 true 时用 `AdvancedScriptEditor`，否则用对应 PluginView。已有：`operator-load-config-modal.tsx`、`operator-create-config-modal.tsx`、`condition-config-modal.tsx`、`router-config-modal.tsx`、`trigger-config-modal.tsx`、`node-title-config-modal.tsx`、`error-trigger-config-modal.tsx`、`sub-process-config-modal.tsx`、`sub_process_result_config_modal.tsx`、`action-config-modal.tsx`。

### 5.6 节点策略（Strategy）机制

**源码**：`flow-design/src/components/design-editor/node-components/strategy/`（策略组件）、`flow-design/src/components/design-panel/manager/node.ts`（转换）、`flow-design/src/components/design-editor/nodes/*/form-meta.tsx`（组合）

节点配置由 **Strategy 策略组件** 组合而成，字段名模式 `<策略名>.<字段>`。各节点通过 `formMeta.render` 组合策略：

| 节点 | 策略组合 |
|------|----------|
| `APPROVAL` | View + OperatorLoad + NodeTitle + MultiOperatorAudit + SameOperatorAudit + ErrorTrigger + Resubmit + Advice + Timeout + RecordMerge + Revoke |
| `HANDLE` | 同 APPROVAL，无 Revoke |
| `NOTIFY` | View + OperatorLoad + NodeTitle + ErrorTrigger（`hiddenAction`） |
| `START` | View + NodeTitle + Revoke |
| `DELAY` / `ROUTER` / `TRIGGER` / `SUB_PROCESS` | 各自策略（SubProcess 另含 ErrorTrigger `nodeOnly`） |
| 分支节点 | ManualTitle + NodeHint |

**策略持久化**：画布数据中策略是 `data.XxxStrategy.*` 平铺字段（`NodeConvertorManager.toRender/toItemRender`）；落库时收集所有以 `Strategy` 结尾的键为 `strategies` 数组（`toData/toDataItem`，`STRATEGY_SUFFIX = 'Strategy'`、`STRATEGY_KEY = 'strategyType'`）。

**OperatorLoadStrategy**（`strategy/operator-load.tsx`）字段：

- `OperatorLoadStrategy.selectType`：`SCRIPT`（指定脚本）/ `INITIATOR_SELECT`（发起人设定）/ `APPROVER_SELECT`（审批人设定）
- `OperatorLoadStrategy.script`：GroovyScriptLoader → `OperatorLoadConfigModal` → `OperatorLoadPluginView`
- `OperatorLoadStrategy.maxOperatorCount`：仅范围模式（`INITIATOR_SELECT`/`APPROVER_SELECT`）显示，`MaxOperatorCountInput`

---

## 6. 完整集成示例

以下是一个 App 初始化阶段的完整定制示例：

```typescript
// main.tsx — App 入口

import { ViewBindPlugin, EventBus, FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";
import { registerFormItems } from "@coding-form/form-engine";
import {
    APPROVAL_HEADER_VIEW_KEY,
    APPROVAL_BODY_VIEW_KEY,
    APPROVAL_ACTION_PASS_KEY,
    APPROVAL_ACTION_REJECT_KEY,
    APPROVAL_ACTION_SAVE_KEY,
} from "@coding-flow/flow-pc-approval";
import { SignKeyViewPluginKey } from "@coding-flow/flow-approval-presenter";
import { IMPORT_FORM_VIEW_KEY } from "@coding-flow/flow-design";
import { Form } from "antd";

const plugin = ViewBindPlugin.getInstance();
const msgRegistry = FlowMessageRegistry.getInstance();

// ── 1. 替换审批布局组件 ──
plugin.register(APPROVAL_HEADER_VIEW_KEY, MyCustomHeader);
plugin.register(APPROVAL_BODY_VIEW_KEY, MyCustomBody);

// ── 2. 替换审批动作按钮 ──
plugin.register(APPROVAL_ACTION_PASS_KEY, MyPassButton);
plugin.register(APPROVAL_ACTION_REJECT_KEY, MyRejectButton);

// ── 3. 替换审批子视图（签名 / 选人）──
plugin.register(SignKeyViewPluginKey, MySignatureView);

// ── 4. 替换设计器视图（导入表单 / 操作人配置）──
plugin.register(IMPORT_FORM_VIEW_KEY, MyImportFormDialog);
plugin.register('OperatorLoadViewPlugin', MyOperatorLoadView);

// ── 5. 定制消息提示 ──
msgRegistry.registerAll({
    [FlowMessageKey.APPROVAL_PASS]: '审批通过',
    [FlowMessageKey.APPROVAL_SAVE]: (data) =>
        data.isStartNode ? '流程已发起' : '已保存',
});

// ── 6. 监听事件 ──
EventBus.getInstance().on('compile', () => { /* ... */ });

// ── 7. 注册表单字段 ──
registerFormItems(Form, [
    { type: 'string', componentType: MyStringInput },
    { type: 'custom-field', componentType: MyCustomField },
]);
```

**审批动作拦截示例**（自定义组件内）：

```tsx
const MyTodoList = () => {
    const { context } = useApprovalContext();
    useEffect(() => {
        const unsubscribe = context.getPresenter()
            .getFlowActionPresenter()
            .addActionInterceptor(async ({ actionId }) => {
                // 自定义校验：不满足条件则拦截
                return await myCheck(actionId);
            });
        return unsubscribe;
    }, []);
    return null;
};
```

---

## 7. 定制优先级总览

当同一能力存在多个定制机制时，优先级规则如下：

```text
审批动作按钮渲染优先级：
  ViewBindPlugin（完全替换）
    → 无注册 → ActionFactory 默认组件
    → 默认组件内部 → CustomStyleButton（根据 display.style 渲染样式）

自定义动作分发优先级（CustomAction 内部）：
  ViewBindPlugin（完全替换）
    → triggerFrontEvent（EventBus 事件触发）
    → triggerType（转发为其他动作类型）
    → 均未配置时无渲染

审批布局渲染优先级：
  ViewBindPlugin（完全替换）
    → 无注册 → 默认 Header/Body/Footer/Sider

审批子视图渲染优先级：
  ViewBindPlugin（完全替换）
    → 无注册 → 默认 Select / Selector / TextArea 等

审批表单视图优先级：
  ViewBindPlugin.get(state.flow?.view)（后端指定的 key）
    → 无注册 → FlowFormView（flow-pc-form / flow-mobile-form）

审批动作提交拦截：
  按 addActionInterceptor 订阅顺序依次执行，任一返回 false 短路

消息提示优先级：
  FlowMessageRegistry.register()（完全覆盖）
    → 未覆盖 → 内置默认值
```

---

## 8. 注意事项

1. **注册时机** — ViewBindPlugin 和 EventBus 的注册应在组件首次渲染前完成，建议在 `main.tsx` 或 App 组件顶层 `useEffect` 中执行，并用模块级标记保证只注册一次（参考 `apps/app-pc/src/hooks/register-plugin-view.tsx`）。
2. **组件卸载清理** — 通过 FormActionContext 注册的表单数据、ActionInterceptor 订阅、EventBus `on()` 监听，都必须在组件卸载时清理（`removeAction()` / 订阅返回的取消函数 / `off()`）。
3. **完全替换** — ViewBindPlugin 注册的组件会完全接管渲染，不会叠加默认组件内容。如需在默认内容基础上扩展，请自行引用默认实现。
4. **Props 兼容性** — 替换时确保自定义组件兼容对应接口（尤其是 `maxOperatorCount` 选人组件必须据此限制人数）。推荐引用框架导出的 TS 接口保证类型。
5. **ActionFactory 无公开注册 API** — PC/移动/设计器三份 ActionFactory 的注册表都是私有的。替换动作**一律通过 ViewBindPlugin 的 key** 完成；设计器动作表单如需新增类型，需修改框架源码 `initialize()`。
6. **不要循环依赖** — 自定义组件内部调用框架 API（如 `actionPresenter.action()`）是推荐做法；但如果在自定义组件内部引用框架组件并注册回同一个 key，会导致死循环。
7. **非公开 API 提醒** — flow-design 的 `FlowEditor`/`FlowNodeRegistry`/`FlowNodeRegistries` 不是包公开导出；自定义节点类型需在 `nodes/index.ts` 数组内扩展并配合后端 `createNode(type)`。`SubProcessOperatorViewPlugin` 类型存在但未从 `plugins/index.ts` 导出。
8. **mockKey 传递** — 所有 `FlowApprovalApi` 调用都携带 `mockKey`，集成方实现自定义 API 时需透传该参数；未使用 mock 模式时传入 `undefined` 即可。