---
name: flow-approval-presenter/action-factory
module: flow-pc-approval / flow-mobile-approval / flow-design（跨包能力）
description: 动作工厂（单例模式），按 ActionType 注册并渲染对应的审批动作组件（Pass/Reject/Save/AddAudit/Delegate/Return/Transfer/Custom）
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-pc-approval / @coding-flow/flow-mobile-approval / @coding-flow/flow-design"
symbols:
  - ActionFactory
content_hash: f7a515768b1b96d57764e598af53346093fa715a56a151c9bef9474c9846aaeb
---

## 解决什么问题

流程审批支持 8 种动作类型（Pass、Reject、Save、AddAudit、Delegate、Return、Transfer、Custom），每种动作对应不同的 UI 组件和交互逻辑。ActionFactory 通过工厂模式实现：

- 按动作类型动态获取对应的 React 组件
- PC 端和移动端各自注册不同的组件实现
- 设计器中也有独立的 ActionFactory 用于配置表单

## 如何使用

### 1. PC 端 / 移动端审批组件

```typescript
import { ActionFactory } from "@/components/flow-approval/components/action/factory";

const factory = ActionFactory.getInstance();

// PC 端：获取组件类型
const Component = factory.getFlowActionComponent(action);
// 渲染: <Component action={action} />

// 移动端：直接渲染
factory.render(action);  // 返回 JSX
```

### 2. 设计器中的动作表单工厂

```typescript
import { ActionFactory } from "@/script-components/components/action/components/factory";

const factory = ActionFactory.getInstance();
const FormComponent = factory.getActionForm(actionType);
// 渲染: <FormComponent {...props} />
```

### 3. 支持的动作类型

| ActionType | PC 组件 | 移动端组件 | 设计器表单 |
|------------|---------|-----------|-----------|
| PASS | PassAction | PassAction | - |
| REJECT | RejectAction | RejectAction | RejectActionForm |
| SAVE | SaveAction | SaveAction | - |
| ADD_AUDIT | AddAuditAction | AddAuditAction | AddAuditActionForm |
| DELEGATE | DelegateAction | DelegateAction | DelegateActionForm |
| RETURN | ReturnAction | ReturnAction | - |
| TRANSFER | TransferAction | TransferAction | TransferActionForm |
| CUSTOM | CustomAction | CustomAction | CustomActionForm |

## 使用实例

- `FlowApprovalActions` 组件通过 ActionFactory 遍历流程节点的动作列表，逐个渲染对应的动作组件
- `CustomAction` 组件通过 ActionFactory（`getFlowActionComponent`）获取 `triggerType` 对应的动作组件
