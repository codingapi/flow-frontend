---
name: flow-approval-presenter/action-factory
module: flow-pc-approval / flow-mobile-approval / flow-design（跨包能力）
description: 动作工厂（单例模式），按 ActionType 注册并渲染审批动作组件（9 种，含减签）
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-pc-approval / @coding-flow/flow-mobile-approval / @coding-flow/flow-design"
symbols:
  - ActionFactory
content_hash: f7a515768b1b96d57764e598af53346093fa715a56a151c9bef9474c9846aaeb
---

## 解决什么问题

审批动作按类型映射到不同 React 组件，三端各自注册：

- 按 `action.type` 动态取组件；
- PC 与移动端组件实现不同；
- 设计器用另一份工厂渲染动作配置表单。

## 如何使用

### 1. 审批端（PC / 移动端）

```typescript
import { ActionFactory } from "@/components/flow-approval/components/action/factory";

const factory = ActionFactory.getInstance();
const Component = factory.getFlowActionComponent(action); // PC
factory.render(action);                                   // 移动端
```

### 2. 设计器动作表单

```typescript
import { ActionFactory } from "@/script-components/components/action/components/factory";

const FormComponent = ActionFactory.getInstance().getActionForm(actionType);
```

### 3. 支持的动作类型（9 种）

| ActionType | PC 组件 | 移动端组件 | 设计器表单 |
|------------|---------|-----------|-----------|
| PASS | PassAction | PassAction | - |
| REJECT | RejectAction | RejectAction | RejectActionForm |
| SAVE | SaveAction | SaveAction | - |
| ADD_AUDIT | AddAuditAction | AddAuditAction | AddAuditActionForm |
| REDUCE_AUDIT | ReduceAuditAction | ReduceAuditAction | ReduceAuditActionForm |
| DELEGATE | DelegateAction | DelegateAction | DelegateActionForm |
| RETURN | ReturnAction | ReturnAction | - |
| TRANSFER | TransferAction | TransferAction | TransferActionForm |
| CUSTOM | CustomAction | CustomAction | CustomActionForm |

### 4. 批量能力

| 项 | 说明 |
|---|---|
| 服务端标记 | `actions[].batchable`，缺省视为 `true` |
| 当前为 `false` | `REDUCE_AUDIT`（候选人/目标按流程实例隔离） |
| 前端行为 | 合并列表（`todos.length > 1`）不展示 `batchable=false` 的动作；进入单条流程后展示 |

## 使用实例

- `FlowApprovalActions` 遍历动作列表，逐个用工厂渲染；
- `CustomAction` 通过 `getFlowActionComponent` 渲染 `triggerType` 对应组件。
