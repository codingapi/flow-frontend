# flow-mobile UI 模块架构设计

> **文档编码**：ARCH-007

## 概述

flow-mobile 是 Flow Engine 前端的移动端组件库集合，包含基础 UI 组件、表单组件和审批组件，基于 Ant Design Mobile 组件库构建。

## 目录结构

```
packages/flow-mobile/
├── flow-mobile-ui/                    # 移动端基础 UI 组件库
│   └── src/
│       └── index.ts                  # 模块导出
│
├── flow-mobile-form/                  # 移动端表单组件库
│   └── src/
│       ├── index.ts                  # 模块导出
│       └── components/
│           └── form/                 # 表单组件
│               ├── index.tsx         # 表单主组件
│               └── view.tsx         # 表单视图
│
└── flow-mobile-approval/              # 移动端审批组件库
    └── src/
        ├── index.ts                  # 模块导出
        ├── components/
        │   └── flow-approval/        # 审批组件
        │       ├── layout/           # 布局组件
        │       │   ├── header.tsx
        │       │   ├── body.tsx
        │       │   └── footer.tsx
        │       ├── components/       # 功能组件
        │       │   ├── action/        # 动作组件
        │       │   │   ├── pass.tsx
        │       │   │   ├── reject.tsx
        │       │   │   ├── delegate.tsx
        │       │   │   ├── transfer.tsx
        │       │   │   ├── add-audit.tsx
        │       │   │   ├── return.tsx
        │       │   │   ├── save.tsx
        │       │   │   ├── revoke.tsx
        │       │   │   ├── urge.tsx
        │       │   │   ├── custom.tsx
        │       │   │   └── close.tsx
        │       │   ├── form-view-component.tsx
        │       │   └── flow-approval-sider.tsx
        │       └── typings/
        │           └── plugin-type.ts   # 视图 KEY 定义
        └── plugins/                    # 默认视图实现
            └── view/
                ├── add-audit-view.tsx
                ├── delegate-view.tsx
                ├── transfer-view.tsx
                ├── return-view.tsx
                ├── sign-key-view.tsx
                ├── operator-select-view.tsx
                └── manual-view.tsx
```

## 模块职责

### flow-mobile-ui

移动端基础 UI 组件库，提供原子化组件，基于 Ant Design Mobile 封装。

### flow-mobile-form

移动端表单组件库，提供表单设计和表单渲染能力：

- `FormView` - 表单渲染组件，接收 `FormViewProps`
- 表单字段渲染
- 表单数据管理

### flow-mobile-approval

移动端审批组件库，提供完整的审批流程界面：

#### 布局组件

```typescript
// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/layout/header.tsx
export const ApprovalHeader: React.FC<{
    content: FlowContent;
    review?: boolean;
    onClose?: () => void;
}> = ({ content, review, onClose }) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/layout/body.tsx
export const ApprovalBody: React.FC<{
    content: FlowContent;
    review?: boolean;
}> = ({ content, review }) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/layout/footer.tsx
export const ApprovalFooter: React.FC<{
    content: FlowContent;
}> = ({ content }) => { ... }
```

#### 动作组件

```typescript
// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/pass.tsx
export const PassAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/reject.tsx
export const RejectAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/delegate.tsx
export const DelegateAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/transfer.tsx
export const TransferAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/add-audit.tsx
export const AddAuditAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/return.tsx
export const ReturnAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/save.tsx
export const SaveAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/revoke.tsx
export const RevokeAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/urge.tsx
export const UrgeAction: React.FC = () => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/custom.tsx
export const CustomAction: React.FC<{ action: FlowAction }> = ({ action }) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/components/action/close.tsx
export const CloseAction: React.FC<{ onClose?: () => void }> = ({ onClose }) => { ... }
```

#### 默认视图实现

移动端为审批视图插件提供了基于 Ant Design Mobile 的默认实现：

```typescript
// packages/flow-mobile/flow-mobile-approval/src/plugins/view/add-audit-view.tsx
export const AddAuditView: React.FC<AddAuditViewPlugin> = (props) => {
    // 使用 ViewBindPlugin 获取已注册的自定义视图
    // 如果没有注册，则使用默认的 Select 组件
}

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/delegate-view.tsx
export const DelegateView: React.FC<DelegateViewPlugin> = (props) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/transfer-view.tsx
export const TransferView: React.FC<TransferViewPlugin> = (props) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/return-view.tsx
export const ReturnView: React.FC<ReturnViewPlugin> = (props) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/sign-key-view.tsx
export const SignKeyView: React.FC<SignKeyViewPlugin> = (props) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/operator-select-view.tsx
export const OperatorSelectView: React.FC<OperatorSelectViewPlugin> = (props) => { ... }

// packages/flow-mobile/flow-mobile-approval/src/plugins/view/manual-view.tsx
export const ManualView: React.FC<ManualViewPlugin> = (props) => { ... }
```

## 视图 KEY 定义

```typescript
// packages/flow-mobile/flow-mobile-approval/src/components/flow-approval/typings/plugin-type.ts

export const APPROVAL_HEADER_VIEW_KEY = 'APPROVAL_HEADER_VIEW_KEY';
export const APPROVAL_BODY_VIEW_KEY = 'APPROVAL_BODY_VIEW_KEY';
export const APPROVAL_FOOTER_VIEW_KEY = 'APPROVAL_FOOTER_VIEW_KEY';

export const APPROVAL_ACTION_ADD_AUDIT_KEY = 'APPROVAL_ACTION_ADD_AUDIT_KEY';
export const APPROVAL_ACTION_CLOSE_KEY = 'APPROVAL_ACTION_CLOSE_KEY';
export const APPROVAL_ACTION_CUSTOM_KEY = 'APPROVAL_ACTION_CUSTOM_KEY';
export const APPROVAL_ACTION_DELEGATE_KEY = 'APPROVAL_ACTION_DELEGATE_KEY';
export const APPROVAL_ACTION_PASS_KEY = 'APPROVAL_ACTION_PASS_KEY';
export const APPROVAL_ACTION_REJECT_KEY = 'APPROVAL_ACTION_REJECT_KEY';
export const APPROVAL_ACTION_RETURN_KEY = 'APPROVAL_ACTION_RETURN_KEY';
export const APPROVAL_ACTION_REVOKE_KEY = 'APPROVAL_ACTION_REVOKE_KEY';
export const APPROVAL_ACTION_SAVE_KEY = 'APPROVAL_ACTION_SAVE_KEY';
export const APPROVAL_ACTION_TRANSFER_KEY = 'APPROVAL_ACTION_TRANSFER_KEY';
export const APPROVAL_ACTION_URGE_KEY = 'APPROVAL_ACTION_URGE_KEY';
```

## PC 与 Mobile 差异

| 特性 | PC 端 | 移动端 |
|------|-------|--------|
| UI 库 | Ant Design | Ant Design Mobile |
| 视图实现 | Ant Design 组件 | Ant Design Mobile 组件 |
| 布局 | 多列/复杂布局 | 单列/简化布局 |
| 操作方式 | 鼠标操作 | 触摸操作 |

## 依赖关系

```
flow-mobile-ui:
  依赖: flow-core

flow-mobile-form:
  依赖: flow-core, flow-types

flow-mobile-approval:
  依赖:
    - flow-core
    - flow-types
    - flow-icons
    - flow-approval-presenter
    - flow-mobile-ui
    - flow-mobile-form
```
