# 插件定制机制

> 本文面向集成方，介绍 Flow Frontend 提供的全部扩展点与插件机制，指导如何替换框架默认的 UI 组件、行为逻辑和数据流。

---

## 概述

Flow Frontend 框架通过 **8 类插件机制** 实现了高度的可定制性。集成方可以在不修改框架源码的情况下，完成以下定制：

| 定制目标 | 使用机制 | 粒度 |
|----------|----------|------|
| 替换审批页面的 Header/Body/Footer/Sider | ViewBindPlugin | 页面级布局 |
| 替换审批动作按钮（通过/驳回/保存/委派...） | ViewBindPlugin | 按钮级 |
| 替换人员选择/签名/节点选择等子视图 | ViewBindPlugin | 弹窗/子视图级 |
| 替换设计器的脚本编辑器、节点标题等视图 | ViewBindPlugin | 编辑器视图级 |
| 替换后端指定的动态表单视图 | ViewBindPlugin | 表单级 |
| 监听和触发前端事件 | EventBus | 事件级 |
| 自定义审批动作的执行逻辑 | EventBus（triggerFrontEvent）+ triggerType 转发 | 动作级 |
| 向审批框架注入自定义表单数据 | FormActionContext | 数据级 |
| 替换后端 API 调用 | FlowApprovalApi 接口 | 接口级 |
| 替换 HTTP 层的消息提示实现 | HttpClient.setMessageBox | 通知级 |
| 注册自定义表单字段类型 | registerFormItems | 字段级 |
| 自定义审批动作按钮样式 | FlowActionDisplay（后端配置） | 样式级 |

所有机制遵循 **"注册即覆盖，不注册用默认"** 的原则，对现有行为零影响。

---

## 1. ViewBindPlugin — 全局视图组件注册中心

ViewBindPlugin 是框架最核心的定制入口，几乎所有 UI 组件都可以通过它被替换。

### API

```typescript
// 注册自定义组件
ViewBindPlugin.getInstance().register(key: string, component: React.ComponentType<any>): void

// 获取已注册的组件
ViewBindPlugin.getInstance().get(key: string): React.ComponentType<any> | undefined
```

### 工作原理

框架在每个关键组件渲染前，都会先通过 `ViewBindPlugin.get(key)` 查找是否有已注册的自定义组件。若找到则直接渲染自定义组件，否则渲染框架默认实现。

```tsx
// 框架内部逻辑示例（Header 组件）
const HeaderView = ViewBindPlugin.getInstance().get(APPROVAL_HEADER_VIEW_KEY);
if (HeaderView) {
    return <HeaderView />;  // 渲染自定义组件
}
// 渲染默认 Header
```

### 可替换的组件清单

#### 审批页面布局（PC 端 & 移动端）

| Key 常量 | Key 值 | 替换对象 |
|----------|--------|----------|
| `APPROVAL_HEADER_VIEW_KEY` | `"APPROVAL_HEADER_VIEW_KEY"` | 审批页顶部标题栏 + 操作按钮区 |
| `APPROVAL_BODY_VIEW_KEY` | `"APPROVAL_BODY_VIEW_KEY"` | 审批页主内容区（表单 + 审批历史） |
| `APPROVAL_FOOTER_VIEW_KEY` | `"APPROVAL_FOOTER_VIEW_KEY"` | 审批页底部操作区 |
| `APPROVAL_BODY_SIDER_VIEW_KEY` | `"APPROVAL_BODY_SIDER_VIEW_KEY"` | 审批页侧边栏（仅 PC 端，流程记录面板） |

```typescript
// 替换审批页 Header
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { APPROVAL_HEADER_VIEW_KEY } from "@coding-flow/flow-pc-approval";

ViewBindPlugin.getInstance().register(APPROVAL_HEADER_VIEW_KEY, MyCustomHeader);
```

#### 审批动作按钮（PC 端 & 移动端）

| Key 常量 | Key 值 | 对应的默认动作 |
|----------|--------|----------------|
| `APPROVAL_ACTION_PASS_KEY` | `"APPROVAL_ACTION_PASS_KEY"` | 审批通过 |
| `APPROVAL_ACTION_REJECT_KEY` | `"APPROVAL_ACTION_REJECT_KEY"` | 审批驳回 |
| `APPROVAL_ACTION_SAVE_KEY` | `"APPROVAL_ACTION_SAVE_KEY"` | 保存 |
| `APPROVAL_ACTION_DELEGATE_KEY` | `"APPROVAL_ACTION_DELEGATE_KEY"` | 委托 |
| `APPROVAL_ACTION_ADD_AUDIT_KEY` | `"APPROVAL_ACTION_ADD_AUDIT_KEY"` | 加签 |
| `APPROVAL_ACTION_TRANSFER_KEY` | `"APPROVAL_ACTION_TRANSFER_KEY"` | 转交 |
| `APPROVAL_ACTION_RETURN_KEY` | `"APPROVAL_ACTION_RETURN_KEY"` | 退回 |
| `APPROVAL_ACTION_REVOKE_KEY` | `"APPROVAL_ACTION_REVOKE_KEY"` | 撤回 |
| `APPROVAL_ACTION_URGE_KEY` | `"APPROVAL_ACTION_URGE_KEY"` | 催办 |
| `APPROVAL_ACTION_CUSTOM_KEY` | `"APPROVAL_ACTION_CUSTOM_KEY"` | 自定义动作 |
| `APPROVAL_ACTION_CLOSE_KEY` | `"APPROVAL_ACTION_CLOSE_KEY"` | 关闭（仅 PC 端） |

> **重要提示**：当替换审批动作按钮时，自定义组件会完全接管该按钮的渲染和交互逻辑。建议参考默认实现中的 action 执行流程（调用 `actionPresenter.action()` 后处理 `res.success`）。
>
> **注意**：`APPROVAL_ACTION_CLOSE_KEY`（关闭）为 PC 端专属按钮，移动端无关闭动作。

#### 审批子视图（弹窗 / 选择器）

| Key 常量 | Key 值 | 用途 |
|----------|--------|------|
| `AddAuditViewPluginKey` | `"AddAuditViewPlugin"` | 加签人员选择 |
| `DelegateViewPluginKey` | `"DelegateViewPlugin"` | 委托人员选择 |
| `ReturnViewPluginKey` | `"ReturnViewPlugin"` | 退回节点选择 |
| `TransferViewPluginKey` | `"TransferViewPlugin"` | 转交人员选择 |
| `SignKeyViewPluginKey` | `"SignKeyViewPlugin"` | 审批签名输入 |
| `OperatorSelectViewPluginKey` | `"OperatorSelectViewPlugin"` | 操作人选择 |
| `ManualViewPluginKey` | `"ManualViewPlugin"` | 手动节点走向选择 |

这些子视图组件有标准的 Props 接口契约，见下文"组件 Props 接口契约"章节。

#### 设计器视图（`@coding-flow/flow-design`）

| Key 常量 | Key 值 | 用途 |
|----------|--------|------|
| `ConditionViewPluginKey` | `"ConditionViewPlugin"` | 条件节点的脚本编辑器 |
| `RouterViewPluginKey` | `"RouterViewPlugin"` | 路由节点的脚本编辑器 |
| `SubProcessViewPluginKey` | `"SubProcessViewPlugin"` | 子流程节点的脚本编辑器 |
| `TriggerViewPluginKey` | `"TriggerViewPlugin"` | 触发器脚本编辑器 |
| `ErrorTriggerViewPluginKey` | `"ErrorTriggerViewPlugin"` | 异常触发器视图 |
| `NodeTitleViewPluginKey` | `"NodeTitleViewPlugin"` | 节点标题视图 |
| `OperatorCreateViewPluginKey` | `"OperatorCreateViewPlugin"` | 操作人创建视图 |
| `OperatorLoadViewPluginKey` | `"OperatorLoadViewPlugin"` | 操作人加载视图 |
| `ActionCustomViewPluginKey` | `"ActionCustomViewPlugin"` | 自定义动作脚本编辑 |
| `ActionRejectViewPluginKey` | `"ActionRejectViewPlugin"` | 拒绝动作脚本编辑 |
| `IMPORT_FORM_VIEW_KEY` | `"ImportFormViewPlugin"` | 导入流程选择视图 |

#### 动态表单视图

后端 `FlowContent.view` 字段指定了一个视图 key，框架通过这个 key 从 ViewBindPlugin 中获取对应的表单组件。这使得不同流程可以使用完全不同的表单 UI。

```typescript
// 为特定流程注册自定义表单
ViewBindPlugin.getInstance().register('my-custom-form', MyCustomFormView);

// 如果后端返回的 FlowContent.view === 'my-custom-form'
// 框架将自动渲染 MyCustomFormView
```

### 组件 Props 接口契约

替换 ViewBindPlugin 中的组件时，需遵循对应的 Props 接口约定：

```typescript
// 审批子视图通用 Props
interface AddAuditViewPlugin {
    onChange?: (value: string | string[]) => void;
    value?: string | string[];
    action?: React.Ref<ApprovalViewPluginAction>;
}

// ApprovalViewPluginAction — 暴露验证方法给框架调用
interface ApprovalViewPluginAction {
    onValidate: () => Promise<boolean>;
}

// 设计器视图通用 Props
interface ConditionViewPlugin {
    type: ScriptType;
    script: string;
    variables: GroovyVariableMapping[];
    onChange: (script: string) => void;
    action?: React.Ref<DesignViewPluginAction>;
}

// DesignViewPluginAction — 暴露验证方法给框架调用
interface DesignViewPluginAction {
    onValidate: (script: string) => Promise<boolean>;
}

// 导入表单视图 Props
interface ImportFormViewPlugin {
    open: boolean;
    onSelect: (form: FlowForm) => void;
    onCancel: () => void;
}
```

> **实现自定义组件时请注意**：如果你的组件需要在点击"保存"或"提交"前由框架做校验，请将验证逻辑通过 `action` Ref 暴露出去。

---

## 2. EventBus — 全局事件总线

EventBus 提供发布-订阅模式的事件通信，允许集成方监听框架内部事件，也可用于自定义动作的前端事件触发。

### API

```typescript
// 注册事件监听
EventBus.getInstance().on(eventName: string, callback: (...args: any[]) => void): void

// 触发事件
EventBus.getInstance().emit(eventName: string, ...args: any[]): void

// 取消监听：移除特定回调；不传 callback 则移除事件的所有监听
EventBus.getInstance().off(eventName: string, callback?: Function): void
```

### 使用场景

**场景一：自定义动作的前端事件触发**

后端可通过 `FlowAction` 对象的 `triggerFrontEvent` 字段配置一个事件名。当该动作按钮被点击时，框架会自动 `emit` 该事件，无需编写任何前端代码。

```typescript
// App 层监听该事件
EventBus.getInstance().on('compile', () => {
    alert('触发了编译事件');
});
```

**场景二：在自定义 ViewBindPlugin 组件中与其他模块通信**

```typescript
// 自定义 Header 组件中发送事件
const MyHeader = () => {
    const handleClick = () => {
        EventBus.getInstance().emit('header:refresh');
    };
    return <button onClick={handleClick}>刷新</button>;
};
```

> **注意**：事件回调中的异常会被框架捕获并 console.error，不会中断后续回调的执行。

---

## 3. FormActionContext — 表单数据注入

当你在审批页面中使用了自定义的表单视图（通过 ViewBindPlugin 注册），需要将自己表单的数据注入到框架的提交流程中时，使用 FormActionContext。

### API

```typescript
interface IFormAction {
    save(): any;           // 返回表单数据
    key(): string;         // 唯一标识，用于去重
    validate(): Promise<any>;  // 表单校验
}

class FormActionContext {
    addAction(submit: IFormAction): void;
    removeAction(key: string): void;
    save(): any;              // 合并所有已注册表单的数据
    validate(): Promise<any>; // 串行校验所有已注册表单
}
```

### 使用方式

在自定义 ViewBindPlugin 组件中获取 FormActionContext 并注册：

```typescript
import { useApprovalContext } from "@coding-flow/flow-approval-presenter";

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

> **关键点**：框架在提交审批时会调用 `FormActionContext.save()` 和 `FormActionContext.validate()`，确保所有已注册表单的数据被合并提交。组件卸载时务必调用 `removeAction()` 清理。

---

## 4. FlowApprovalApi — 替换后端 API 实现

通过实现 `FlowApprovalApi` 接口，可以完全替换框架的 API 调用逻辑，适配自有后端。

### 接口定义

```typescript
interface FlowApprovalApi {
    create(body: Record<string, any>, mockKey: string): Promise<number>;
    processNodes(body: Record<string, any>, mockKey: string): Promise<ProcessNode[]>;
    action(body: Record<string, any>, mockKey: string): Promise<any>;
    revoke(id: any, mockKey: string): Promise<any>;
    urge(id: any, mockKey: string): Promise<any>;
}
```

### 使用方式

在创建审批上下文时注入自定义 API 实现：

```typescript
import { createApprovalContext } from "@coding-flow/flow-approval-presenter";

const myApi: FlowApprovalApi = {
    create: async (body, mockKey) => { /* 自定义实现 */ },
    processNodes: async (body, mockKey) => { /* 自定义实现 */ },
    action: async (body, mockKey) => { /* 自定义实现 */ },
    revoke: async (id, mockKey) => { /* 自定义实现 */ },
    urge: async (id, mockKey) => { /* 自定义实现 */ },
};

const context = createApprovalContext(props, myApi);
```

---

## 5. HttpClient.setMessageBox — 替换 HTTP 层消息提示

框架的 HTTP 拦截器在 token 失效、无权限等场景会自动触发提示。可通过替换 `MessageBox` 实现自定义通知方式。

### 接口定义

```typescript
interface MessageBox {
    success: (msg: string) => void;
    error: (msg: string) => void;
}
```

### 使用方式

```typescript
import { HttpClient } from "@coding-flow/flow-core";

const myMessageBox: MessageBox = {
    success: (msg) => Notify.success(msg),
    error: (msg) => Notify.error(msg),
};

const httpClient = new HttpClient(30000, myMessageBox, '/api');
// 或动态替换
httpClient.setMessageBox(myMessageBox);
```

> **提示**：message 文案本身可以通过 [FlowMessageRegistry 消息提示定制](./message-customization.md) 进一步自定义。

---

## 6. CustomStyleButton — 审批动作按钮样式定制

审批动作按钮的样式（颜色、圆角、图标等）由 `FlowActionDisplay` 对象驱动，该对象由后端在 `FlowAction.display` 字段中返回。**集成员通常无需前端代码修改**，通过后端配置即可改变按钮外观。

### 后端可配置的样式字段

| 字段 | 示例值 | 效果 |
|------|--------|------|
| `backgroundColor` | `"1890ff"` | 按钮背景色（自动添加 `#` 前缀） |
| `borderColor` | `"ff4d4f"` | 边框颜色 |
| `borderRadius` | `"8"` | 圆角大小（px） |
| `borderSize` | `"2"` | 边框宽度（px） |
| `icon` | 图标名称 | 按钮图标（通过 `@coding-flow/flow-icons` 渲染） |
| `title` | `"自定义文本"` | 按钮标题 |

### 架构说明

```
后端 FlowAction.display.style (JSON string)
  → CustomStyleButton 组件解析为 DisplayStyle 对象
  → 渲染带样式的 antd Button
```

所有审批动作按钮（通过/拒绝/保存/委派/加签/转交/退回/自定义）内部均使用 `CustomStyleButton` 渲染外观。

---

## 7. registerFormItems — 注册自定义表单字段类型

Flow Frontend 使用 `@coding-form/form-engine` 作为表单引擎，通过 `registerFormItems` 可以注册自定义的表单字段渲染组件。

### API

```typescript
registerFormItems(Form: any, items: FormItemType[]): void;

interface FormItemType {
    type: string;         // 字段类型标识（如 'string', 'integer', 'date'）
    componentType: React.ComponentType<any>;  // 对应的渲染组件
}
```

### 使用示例

```typescript
import { registerFormItems } from "@coding-form/form-engine";
import { Form } from "antd";

// 注册自定义字段类型
registerFormItems(Form, [
    { type: 'string', componentType: MyStringInput },
    { type: 'integer', componentType: MyIntegerInput },
    { type: 'date', componentType: MyDatePicker },
    { type: 'boolean', componentType: MySwitch },
    { type: 'custom-selector', componentType: MyCustomSelector },
]);
```

> 表单字段类型由流程设计器创建字段时选择，具体类型在 `@coding-flow/flow-types` 的 `FormTypeContext` 中定义。

---

## 8. ApprovalPanel / ApprovalPanelDrawer — 审批入口组件

集成方通过审批入口组件将审批能力嵌入到自己的页面中。框架提供了两套入口：

### PC 端：ApprovalPanelDrawer

```tsx
import { ApprovalPanelDrawer } from "@coding-flow/flow-pc-approval";

<ApprovalPanelDrawer
    workflowCode={workflowCode}     // 流程设计编码
    open={visible}                  // 是否显示
    recordId={recordId}            // 流程记录 ID（有值=审批，无值=发起）
    review={isReview}              // 是否预览模式（只看不操作）
    onClose={() => setVisible(false)}
/>
```

### 移动端：ApprovalPanel

```tsx
import { ApprovalPanel } from "@coding-flow/flow-mobile-approval";

<ApprovalPanel
    workflowCode={workflowCode}     // 流程设计编码
    recordId={recordId}            // 流程记录 ID（有值=审批，无值=发起）
    review={isReview}              // 是否预览模式
    onClose={() => navigate(-1)}
    initData={initialFormData}     // 可选的初始化表单数据
/>
```

---

## 完整集成示例

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
import { IMPORT_FORM_VIEW_KEY } from "@coding-flow/flow-design";

const plugin = ViewBindPlugin.getInstance();
const msgRegistry = FlowMessageRegistry.getInstance();

// ── 1. 替换布局组件 ──
plugin.register(APPROVAL_HEADER_VIEW_KEY, MyCustomHeader);
plugin.register(APPROVAL_BODY_VIEW_KEY, MyCustomBody);

// ── 2. 替换动作按钮 ──
plugin.register(APPROVAL_ACTION_PASS_KEY, MyPassButton);
plugin.register(APPROVAL_ACTION_REJECT_KEY, MyRejectButton);

// ── 3. 替换子视图 ──
plugin.register('SignKeyViewPlugin', MySignatureView);
plugin.register('AddAuditViewPlugin', MyUserSelector);

// ── 4. 替换设计器视图 ──
plugin.register(IMPORT_FORM_VIEW_KEY, MyImportFormDialog);
plugin.register('ConditionViewPlugin', MyCodeEditor);

// ── 5. 替换动态表单视图 ──
plugin.register('my-custom-form', MyCustomForm);
plugin.register('default', MyDefaultForm);

// ── 6. 定制消息提示 ──
msgRegistry.registerAll({
    [FlowMessageKey.APPROVAL_PASS]: '审批通过',
    [FlowMessageKey.APPROVAL_SAVE]: (data) =>
        data.isStartNode ? '流程已发起' : '已保存',
});

// ── 7. 监听事件 ──
EventBus.getInstance().on('compile', () => { /* ... */ });
EventBus.getInstance().on('notify:refresh', () => { /* ... */ });

// ── 8. 注册表单字段 ──
registerFormItems(Form, [
    { type: 'string', componentType: MyStringInput },
    { type: 'custom-field', componentType: MyCustomField },
]);
```

---

## 定制优先级总览

当同一能力存在多个定制机制时，优先级规则如下：

```
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

审批表单视图优先级：
  ViewBindPlugin.get(state.flow?.view)（后端指定的 key）
    → 无注册 → FlowFormView（@coding-flow/flow-pc-form / flow-mobile-form）

消息提示优先级：
  FlowMessageRegistry.register()（完全覆盖）
    → 未覆盖 → 内置默认值
```

---

## 注意事项

1. **注册时机** — ViewBindPlugin 和 EventBus 的注册应在组件首次渲染前完成，建议在 `main.tsx` 或 App 组件顶层 `useEffect` 中执行
2. **组件卸载清理** — 通过 FormActionContext 注册的表单数据，务必在组件卸载时调用 `removeAction()` 清理；EventBus 的 `on()` 也应在 `useEffect` 的 cleanup 中调用 `off()`
3. **完全替换** — ViewBindPlugin 注册的组件会完全接管渲染，不会叠加默认组件的内容。如需在默认内容基础上增加 UI，需自行引用默认组件
4. **Props 兼容性** — 替换 ViewBindPlugin 中的组件时，请确保你的自定义组件能接收对应的 Props 类型。推荐使用 TypeScript 并在开发时引用框架的 Props 接口
5. **不要循环依赖** — 自定义组件内部调用框架 API（如 `actionPresenter.action()`）是推荐做法；但如果在自定义组件内部调用框架的组件并注册回同一个 key，会导致死循环
