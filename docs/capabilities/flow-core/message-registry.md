---
name: flow-core/message-registry
module: flow-core
description: 流程消息注册表（单例模式），将所有消息提示从硬编码中解耦，支持下游 App 通过字符串模板或函数模板自定义消息内容，运行时上下文数据由 Presenter 自动注入
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-core"
symbols:
  - FlowMessageRegistry
  - FlowMessageKey
  - MessageTemplate
content_hash: 7d8f2a1b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
---

## 解决什么问题

项目中所有消息提示（"操作成功""流程已保存""脚本编译成功"等）原本硬编码在各组件的 `message.success()` / `Toast.show()` 调用中。下游集成方如果需要：
- 修改提示文案（如国际化、业务术语调整）
- 根据运行时上下文展示差异化内容（如开始节点保存 vs 非开始节点保存）
- 在提示中加入流程名称、操作人等动态信息

就必须修改框架源码，无法做到开箱即用。

`FlowMessageRegistry` 将消息内容与消息展示分离：
- **框架**只负责定义消息键（`FlowMessageKey`）和提供运行时上下文数据
- **下游 App** 通过 `register()` 自由定制每条消息的内容，支持字符串模板和函数模板
- 组件代码不关心具体文案，只传键名 + 上下文数据

## 核心概念

```
┌──────────────────────────────────────────────────┐
│ App 初始化                                       │
│   registry.register('approval.save', (data) =>   │
│     data.isStartNode                             │
│       ? `流程 ${data.flowName} 已发起`             │
│       : `流程 ${data.flowName} 数据已更新`          │
│   );                                             │
└────────────────┬─────────────────────────────────┘
                 │ 覆盖默认值
┌────────────────▼─────────────────────────────────┐
│ FlowMessageRegistry（单例）                        │
│   get(key, data) → string                        │
└────────────────┬─────────────────────────────────┘
                 │ 调用
┌────────────────▼─────────────────────────────────┐
│ 组件                                             │
│   message.success(                               │
│     registry.get('approval.save',                │
│       presenter.buildActionContext())            │
│   );                                             │
└──────────────────────────────────────────────────┘
```

## 如何使用

### 1. 在 App 入口注册自定义消息

框架内置了所有默认消息（与改造前硬编码内容一致）。**不做任何注册就不影响现有行为**。

需要定制时，在 App 初始化阶段调用 `register()` 或 `registerAll()`：

```typescript
import { FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";

const registry = FlowMessageRegistry.getInstance();

// 方式一：注册单个消息
registry.register(FlowMessageKey.APPROVAL_PASS, '审批通过');

// 方式二：批量注册
registry.registerAll({
  [FlowMessageKey.APPROVAL_PASS]: '审批通过',
  [FlowMessageKey.APPROVAL_REJECT]: '审批已拒绝',
  [FlowMessageKey.DESIGN_SAVE]: '流程设计已保存',
});
```

### 2. 使用字符串模板（`{placeholder}`）

当消息中包含动态字段时，使用 `{placeholder}` 语法：

```typescript
registry.register(FlowMessageKey.DESIGN_DOWNLOAD_SUCCESS, '下载 {format} 成功');

// 组件调用时传入 data
registry.get(FlowMessageKey.DESIGN_DOWNLOAD_SUCCESS, { format: 'JSON' });
// → "下载 JSON 成功"
```

### 3. 使用函数模板

当消息内容需要根据上下文变量做条件判断时，使用函数模板：

```typescript
// 保存按钮 — 根据是否开始节点展示不同提示
registry.register(FlowMessageKey.APPROVAL_SAVE, (data) =>
  data.isStartNode
    ? `流程 ${data.flowName} 已发起，操作人：${data.currentOperator}`
    : `流程 ${data.flowName} 数据已更新`
);

// 脚本编译失败 — 动态拼接后端错误信息
registry.register(FlowMessageKey.DESIGN_SCRIPT_COMPILE_FAILED, (data) =>
  `脚本编译失败：${data.message}`
);
```

### 4. 在组件中使用

组件不做任何业务判断，只负责传键名和上下文数据：

```typescript
// PC 端（使用 antd message）
import { FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";
const registry = FlowMessageRegistry.getInstance();

// 审批保存
const actionCtx = actionPresenter.buildActionContext(action.id);
actionPresenter.action(action.id).then((res) => {
  if (res.success) {
    message.success(registry.get(FlowMessageKey.APPROVAL_SAVE, actionCtx));
  }
});

// 移动端（使用 antd-mobile Toast）
import { Toast } from "antd-mobile";
Toast.show(registry.get(FlowMessageKey.APPROVAL_SAVE, actionCtx));
```

### 5. 审批动作上下文数据参考

`FlowActionPresenter.buildActionContext(actionId?)` 返回以下字段，下游消息模板可任意取用：

| 字段 | 类型 | 说明 |
|------|------|------|
| `flowName` | `string` | 流程设计标题（来自 `workTitle`） |
| `workCode` | `string` | 流程设计编码 |
| `recordId` | `number \| null` | 流程记录 ID，开始节点时为 `null` |
| `isStartNode` | `boolean` | 是否为发起节点（`!recordId`），**保存消息分流的关键字段** |
| `actionName` | `string` | 当前动作名称（如"通过""驳回""保存"） |
| `nodeType` | `string` | 当前节点类型 |
| `nodeName` | `string` | 当前节点名称 |
| `currentOperator` | `string` | 当前操作人姓名 |
| `createOperator` | `string` | 流程创建人姓名 |
| `flowState` | `number` | 流程状态码 |
| `recordState` | `number` | 记录状态码 |
| `title` | `string` | 流程实例标题 |

### 6. 设计器组件的上下文数据

设计器组件调用 `registry.get()` 时直接传入裸对象，不需要 Presenter。常用键的数据格式：

- `DESIGN_DOWNLOAD_SUCCESS` — 传入 `{ format: 'JSON' | 'SVG' | 'PNG' }`
- `DESIGN_SCRIPT_COMPILE_FAILED` — 传入 `{ message: string }`（后端错误信息）

其他设计器消息键（`DESIGN_SAVE`、`DESIGN_VERSION_SAVED` 等）均为静态字符串，无需传 data。

### 7. 完整消息键列表

#### HTTP 系统层

| 键 | 默认值 | 说明 |
|------|------|------|
| `http.token.expired` | `登录已过期，请退出再重新打开` | token 失效时自动触发 |
| `http.no_permission` | `抱歉，该账户无权限访问` | 403 / 无数据时自动触发 |

#### 审批动作

| 键 | 默认值 | 说明 |
|------|------|------|
| `approval.save` | `流程数据已保存`（函数模板） | 含 `isStartNode`，可区分开始/非开始节点 |
| `approval.pass` | `操作成功` | 审批通过 |
| `approval.reject` | `操作成功` | 审批驳回 |
| `approval.delegate` | `操作成功` | 委托 |
| `approval.add_audit` | `操作成功` | 加签 |
| `approval.transfer` | `操作成功` | 转交 |
| `approval.return` | `操作成功` | 退回 |
| `approval.revoke` | `流程已撤回` | 撤回 |
| `approval.urge` | `已发送催办提醒.` | 催办 |
| `approval.custom` | `操作成功` | 自定义动作 |
| `approval.no_selected` | `请先选择审批流程.` | 合并审批未选流程 |

#### 流程设计器

| 键 | 默认值 | 说明 |
|------|------|------|
| `design.save` | `流程已经保存.` | 保存流程设计 |
| `design.version_saved` | `版本已保存` | 版本保存 |
| `design.version_deleted` | `版本已删除` | 版本删除 |
| `design.import_success` | `流程已导入成功` | 导入成功 |
| `design.download_success` | `下载 {format} 成功` | 下载，需传 `{format}` |
| `design.script_compile_success` | `脚本编译成功` | 脚本编译通过 |
| `design.script_compile_failed` | `脚本编译失败: {message}`（函数模板） | 编译失败，需传 `{message}` |
| `design.script_compile_error` | `脚本编译请求失败` | 编译请求失败 |
| `design.view_code_save_success` | `保存成功` | 代码视图保存 |
| `design.groovy_meta_failed` | `获取脚本元数据失败` | Groovy 元数据获取失败 |

#### App 层

| 键 | 默认值 | 说明 |
|------|------|------|
| `app.login_success` | `login success` | 登录成功 |
| `app.user_deleted` | `用户已删除` | 用户删除 |
| `app.user_saved` | `用户已保存` | 用户保存 |
| `app.workflow.status_changed` | `状态已变更` | 流程状态变更 |
| `app.workflow.deleted` | `流程已删除` | 流程删除 |

### 8. 新 App 集成步骤

1. **导入模块**

   ```typescript
   import { FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";
   ```

2. **App 初始化时注册自定义消息（可选）**

   ```typescript
   const registry = FlowMessageRegistry.getInstance();
   registry.registerAll({
     [FlowMessageKey.APPROVAL_PASS]: '审批已通过',
     [FlowMessageKey.APPROVAL_SAVE]: (data) =>
       data.isStartNode ? `流程 ${data.flowName} 已发起` : `保存成功`,
   });
   ```

3. **组件中无需改动** — 框架内的组件已经通过 `registry.get(key, data)` 调用，无需关心消息内容。

## 使用实例

项目中所有消息提示均已通过 FlowMessageRegistry 管理：

- **审批组件（PC/移动）**：`flow-pc-approval/components/action/*.tsx`、`flow-mobile-approval/components/action/*.tsx` 中的 save/pass/reject/delegate/transfer/return/revoke/urge/custom/add-audit 共 11 种动作
- **流程设计器**：`flow-design` 中的 header 保存、版本管理、导入、下载、脚本编译、代码视图等
- **HTTP 拦截器**：`flow-core/src/http.ts` 中 token 过期和权限不足的自动提示
- **示例 App**：`app-pc` 中登录、用户管理、工作流管理的提示
