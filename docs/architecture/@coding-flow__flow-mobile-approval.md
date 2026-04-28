# @coding-flow/flow-mobile-approval

移动端审批组件库，提供审批布局、8 种审批操作按钮、节点历史、审批插件默认视图，基于 Ant Design Mobile 组件。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-approval-presenter | workspace:* | 审批展示器框架（Presenter、Redux Store、Context、插件类型） |
| @coding-flow/flow-core | workspace:* | 基础框架库（HttpClient） |
| @coding-flow/flow-icons | workspace:* | 图标库 |
| @coding-flow/flow-mobile-ui | workspace:* | 移动端基础 UI 组件（Popconfirm、PopupModal） |
| @coding-flow/flow-mobile-form | workspace:* | 移动端表单组件库（FlowFormView） |
| @coding-flow/flow-types | workspace:* | 类型定义 |
| @coding-form/form-engine | ^0.0.16 | 表单渲染引擎（外部 npm 包） |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| @reduxjs/toolkit | ^2.11.2 | Redux 状态管理 |
| react-redux | ^9.2.0 | React Redux 绑定 |
| immer | ^11.1.3 | 不可变数据处理 |
| antd-mobile | ^5.42.3 | Ant Design Mobile 组件库 |
| dayjs | ^1.11.19 | 日期处理 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-mobile/flow-mobile-approval/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                              # 入口：导出 flow-approval 子模块
    ├── api/
    │   ├── index.ts                          # HttpClient 实例（10s 超时）
    │   ├── record.ts                         # 记录 API（detail/create/action/revoke/urge/list/todo/done/notify）
    │   └── workflow.ts                       # 工作流 API
    ├── components/
    │   └── flow-approval/                    # 审批布局核心
    │       ├── index.tsx                     # 导出
    │       ├── index.scss                    # 全局样式
    │       ├── view.tsx                      # ApprovalPanel
    │       ├── layout/
    │       │   ├── index.tsx                 # ApprovalLayout（Redux Provider + Context + Header/Body/Footer）
    │       │   ├── header.tsx                # 头部（标题、操作人信息）
    │       │   ├── body.tsx                  # 内容区（表单）
    │       │   ├── footer.tsx                # 底部（操作按钮栏，最多显示 3 个 + 更多）
    │       │   ├── presenter.ts              # LayoutPresenter（按钮溢出管理）
    │       │   └── hooks/
    │       │       └── use-layout-presenter.ts  # Layout Presenter Hook
    │       ├── model/
    │       │   └── index.ts                  # FlowApprovalApiImpl
    │       ├── components/
    │       │   ├── action/                   # 8 种审批操作按钮
    │       │   │   ├── factory.tsx           #   ActionFactory（单例工厂）
    │       │   │   ├── type.tsx              #   FlowActionProps 接口
    │       │   │   ├── pass.tsx              #   通过
    │       │   │   ├── reject.tsx            #   拒绝
    │       │   │   ├── save.tsx              #   保存
    │       │   │   ├── add-audit.tsx         #   加签
    │       │   │   ├── delegate.tsx          #   委派
    │       │   │   ├── return.tsx            #   退回
    │       │   │   ├── transfer.tsx          #   转办
    │       │   │   ├── custom.tsx            #   自定义
    │       │   │   ├── revoke.tsx            #   撤销
    │       │   │   └── urge.tsx              #   催办
    │       │   ├── flow-approval-actions.tsx # 操作按钮组
    │       │   ├── flow-approval-content.tsx # 审批内容区
    │       │   ├── flow-approval-title.tsx   # 审批标题
    │       │   ├── flow-node-history.tsx     # 节点历史记录
    │       │   ├── flow-time-node.tsx        # 时间节点
    │       │   ├── form-view-component.tsx   # 表单视图组件
    │       │   └── custom-style-button.tsx   # 自定义样式按钮
    │       └── typings/
    │           ├── index.ts                  # 布局常量
    │           └── plugin-type.ts            # 审批插件 VIEW_KEY 常量
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

入口文件 `src/index.ts`，导出 `components/flow-approval` 子模块：

| 导出内容 | 说明 |
|----------|------|
| `ApprovalPanel` | 审批面板（加载详情 → 渲染 ApprovalLayout） |
| `ActionFactory` | 操作按钮工厂（单例） |
| `FlowActionProps` | 操作按钮 Props 接口 |
| `FlowApprovalActions` | 操作按钮组组件 |
| 审批布局/操作插件 VIEW_KEY 常量 | Header/Body/Footer + 11 个操作按钮视图插槽 |

**审批布局插件 VIEW_KEY 常量**：

| Key | 用途 |
|-----|------|
| `APPROVAL_HEADER_VIEW_KEY` | 审批头部视图插槽 |
| `APPROVAL_BODY_VIEW_KEY` | 审批内容区视图插槽 |
| `APPROVAL_FOOTER_VIEW_KEY` | 审批底部视图插槽 |
| `APPROVAL_ACTION_*_KEY`（11 个） | 各操作按钮视图插槽 |

## 核心功能

### 1. 审批布局

`ApprovalLayout` 组件：Redux Provider 包裹 Header + Body + (Footer) 两/三段式布局，通过 `createApprovalContext` 创建 Presenter + Context。
- Header：流程标题、操作人信息
- Body：表单视图（`FlowFormView`）
- Footer：操作按钮栏（可选，预览模式下仅在有撤销/催办时显示）

### 2. LayoutPresenter

移动端布局专用 Presenter，管理底部操作按钮的溢出显示：
- 最多显示 3 个操作按钮（`MAX_OPTION_SIZE = 3`），超出部分放入"更多"菜单
- `hasFooter()`：根据预览模式和流程状态判断是否显示底部栏
- `getFooterOptions()` / `getMoreOptions()`：获取直接显示和折叠的操作列表

### 3. ApprovalPanel

审批面板入口组件，接收 `recordId` 或 `workflowCode`，调用 `detail` API 加载流程内容后渲染 `ApprovalLayout`。

### 4. ActionFactory

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

另附加 RevokeAction、UrgeAction 独立操作。

### 5. FlowApprovalApiImpl

实现 `@coding-flow/flow-approval-presenter` 的 `FlowApprovalApi` 接口，对接后端 `/api/cmd/record/*` 和 `/api/query/record/*` 接口。注入 `mockKey` 参数支持 Mock 场景。

### 6. 审批插件默认视图

7 个审批插件默认视图实现，对应 `@coding-flow/flow-approval-presenter` 定义的插件类型：
- AddAuditView、DelegateView、ReturnView、SignKeyView、TransferView、OperatorSelectView、ManualView

### 7. API 层

- **record API**：detail、create、action、revoke、urge、list、todo、done、notify（共 12 个接口）
- **workflow API**：mock、cleanMock、options

## 构建指令

```bash
pnpm -F @coding-flow/flow-mobile-approval build
pnpm -F @coding-flow/flow-mobile-approval test
```
