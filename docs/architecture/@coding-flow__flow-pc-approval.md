# @coding-flow/flow-pc-approval

PC 端审批组件库，提供审批布局、8 种审批操作按钮、审批侧边栏、节点历史、流程选择弹窗、Mock 审批及审批插件默认视图。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @flow-example/app-pc | apps/app-pc |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-approval-presenter | workspace:* | 审批展示器框架（Presenter、Redux Store、Context、插件类型） |
| @coding-flow/flow-core | workspace:* | 基础框架库（HttpClient、ObjectUtils） |
| @coding-flow/flow-icons | workspace:* | 图标库 |
| @coding-flow/flow-pc-ui | workspace:* | PC 端基础 UI 组件（Drawer） |
| @coding-flow/flow-pc-form | workspace:* | PC 端表单组件库（FlowFormView） |
| @coding-flow/flow-types | workspace:* | 类型定义 |
| @coding-form/form-engine | ^0.0.16 | 表单渲染引擎（外部 npm 包） |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| @reduxjs/toolkit | ^2.11.2 | Redux 状态管理 |
| react-redux | ^9.2.0 | React Redux 绑定 |
| immer | ^11.1.3 | 不可变数据处理 |
| antd | ^6.2.1 | Ant Design 组件库 |
| dayjs | ^1.11.19 | 日期处理 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-pc/flow-pc-approval/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                              # 入口：导出 4 个子模块
    ├── type.d.ts                             # 全局类型声明
    ├── api/
    │   ├── index.ts                          # HttpClient 实例（10s 超时）
    │   ├── record.ts                         # 记录 API（detail/create/action/revoke/urge/list/todo/done/notify）
    │   └── workflow.ts                       # 工作流 API（mock/cleanMock/options）
    ├── components/
    │   ├── flow-approval/                    # 审批布局核心
    │   │   ├── index.ts                      # 导出
    │   │   ├── view.tsx                      # ApprovalPanel + ApprovalPanelDrawer
    │   │   ├── layout/
    │   │   │   ├── index.tsx                 # ApprovalLayout（Redux Provider + Context + 三段式）
    │   │   │   ├── header.tsx                # 头部（标题、流程信息）
    │   │   │   ├── body.tsx                  # 内容区（表单 + 侧边栏）
    │   │   │   └── footer.tsx                # 底部（操作按钮栏）
    │   │   ├── model/
    │   │   │   └── index.ts                  # FlowApprovalApiImpl（实现 FlowApprovalApi）
    │   │   ├── components/
    │   │   │   ├── action/                   # 8 种审批操作按钮
    │   │   │   │   ├── factory.tsx           #   ActionFactory（单例工厂）
    │   │   │   │   ├── type.ts               #   FlowActionProps 接口
    │   │   │   │   ├── pass.tsx              #   通过
    │   │   │   │   ├── reject.tsx            #   拒绝
    │   │   │   │   ├── save.tsx              #   保存
    │   │   │   │   ├── add-audit.tsx         #   加签
    │   │   │   │   ├── delegate.tsx          #   委派
    │   │   │   │   ├── return.tsx            #   退回
    │   │   │   │   ├── transfer.tsx          #   转办
    │   │   │   │   ├── custom.tsx            #   自定义
    │   │   │   │   ├── revoke.tsx            #   撤销
    │   │   │   │   ├── urge.tsx              #   催办
    │   │   │   │   └── close.tsx             #   关闭
    │   │   │   ├── flow-approval-actions.tsx # 操作按钮组
    │   │   │   ├── flow-approval-content.tsx # 审批内容区
    │   │   │   ├── flow-approval-sider.tsx   # 审批侧边栏
    │   │   │   ├── flow-approval-title.tsx   # 审批标题
    │   │   │   ├── flow-node-history.tsx     # 节点历史记录
    │   │   │   ├── flow-time-node.tsx        # 时间节点
    │   │   │   ├── form-view-component.tsx   # 表单视图组件
    │   │   │   └── custom-style-button.tsx   # 自定义样式按钮
    │   │   └── typings/
    │   │       ├── index.ts                  # 布局常量
    │   │       └── plugin-type.ts            # 审批插件 VIEW_KEY 常量
    │   ├── flow-title/
    │   │   └── index.tsx                     # FlowTitle（HTML 安全渲染）
    │   ├── workflow-select-modal/
    │   │   └── index.tsx                     # WorkflowSelectModal（流程选择弹窗）
    │   └── flow-mock/                        # Mock 审批
    │       ├── index.tsx                     # FlowMock
    │       ├── presenter.ts                  # MockPresenter
    │       ├── model.ts                      # Mock 数据
    │       ├── types.ts                      # Mock 类型
    │       ├── hooks/use-mock-presenter.ts   # Mock Presenter Hook
    │       └── components/todo.tsx           # Mock 待办页面
    └── plugins/
        └── view/                             # 审批插件默认视图实现
            ├── add-audit-view.tsx            # 加签视图
            ├── delegate-view.tsx             # 委派视图
            ├── manual-view.tsx               # 人工节点视图
            ├── operator-select-view.tsx      # 操作人选择视图
            ├── return-view.tsx               # 退回视图
            ├── sign-key-view.tsx             # 签名视图
            └── transfer-view.tsx             # 转办视图
```

## 对外入口

入口文件 `src/index.ts`，聚合导出 4 个子模块：

| 来源模块 | 导出内容 |
|----------|----------|
| `components/flow-approval` | `ApprovalPanel`、`ApprovalPanelDrawer`、`ActionFactory`、`FlowActionProps`、`FlowApprovalActions`、审批布局/操作插件 VIEW_KEY 常量 |
| `components/flow-title` | `FlowTitle` — HTML 安全渲染流程标题 |
| `components/workflow-select-modal` | `WorkflowSelectModal` — 流程选择弹窗 |
| `components/flow-mock` | `FlowMock` — Mock 审批组件 |

**审批布局插件 VIEW_KEY 常量**：

| Key | 用途 |
|-----|------|
| `APPROVAL_HEADER_VIEW_KEY` | 审批头部视图插槽 |
| `APPROVAL_BODY_VIEW_KEY` | 审批内容区视图插槽 |
| `APPROVAL_FOOTER_VIEW_KEY` | 审批底部视图插槽 |
| `APPROVAL_BODY_SIDER_VIEW_KEY` | 审批侧边栏视图插槽 |
| `APPROVAL_ACTION_*_KEY`（11 个） | 各操作按钮视图插槽（PASS/REJECT/SAVE/ADD_AUDIT/DELEGATE/RETURN/TRANSFER/CUSTOM/REVOKE/URGE/CLOSE） |

## 核心功能

### 1. 审批布局

`ApprovalLayout` 组件：Redux Provider 包裹三段式布局（Header/Body/Footer），通过 `createApprovalContext` 创建 Presenter + Context。
- Header：流程标题、操作人信息
- Body：表单视图（`FlowFormView`）+ 侧边栏（审批历史、节点状态）
- Footer：操作按钮栏（`FlowApprovalActions`）

### 2. 审批面板入口

- `ApprovalPanel`：接收 `recordId` 或 `workflowCode`，调用 `detail` API 加载流程内容后渲染 `ApprovalLayout`
- `ApprovalPanelDrawer`：在 `Drawer` 中展示 `ApprovalPanel`

### 3. ActionFactory

单例工厂，将 8 种 `ActionType` 映射到对应的 React 操作按钮组件：

| ActionType | 组件 |
|------------|------|
| PASS | PassAction |
| REJECT | RejectAction |
| SAVE | SaveAction |
| ADD_AUDIT | AddAuditAction |
| DELEGATE | DelegateAction |
| RETURN | ReturnAction |
| TRANSFER | TransferAction |
| CUSTOM | CustomAction |

另附加 RevokeAction、UrgeAction、CloseAction 三个独立操作按钮。

### 4. FlowApprovalApiImpl

实现 `@coding-flow/flow-approval-presenter` 的 `FlowApprovalApi` 接口，对接后端 `/api/cmd/record/*` 和 `/api/query/record/*` 接口。注入 `mockKey` 参数支持 Mock 场景。

### 5. 审批插件默认视图

7 个审批插件默认视图实现，对应 `@coding-flow/flow-approval-presenter` 定义的插件类型：
- AddAuditView — 加签人员选择
- DelegateView — 委派人员选择
- ReturnView — 退回人员选择
- SignKeyView — 签名
- TransferView — 转办人员选择
- OperatorSelectView — 操作人指定
- ManualView — 人工节点方向选择

### 6. API 层

- **record API**：detail、create、action、revoke、urge、list、todo、done、notify（共 12 个接口）
- **workflow API**：mock、cleanMock、options（共 3 个接口）

### 7. FlowMock

Mock 审批组件，创建 Mock 流程数据后在 `FlowMockContext` 中渲染待办审批页面，用于开发和测试场景。

### 8. WorkflowSelectModal

流程选择弹窗，从后端获取可用流程列表，以按钮组形式展示供用户选择。

## 构建指令

```bash
pnpm -F @coding-flow/flow-pc-approval build
pnpm -F @coding-flow/flow-pc-approval test
```
