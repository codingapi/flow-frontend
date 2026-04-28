# @coding-flow/flow-approval-presenter

审批展示器框架，提供基于 Redux 的审批状态管理、MVP Presenter 业务逻辑层、审批动作执行引擎及插件扩展机制，PC 端和移动端审批组件共用。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库（Dispatch、GroovyScriptConvertorUtil） |
| @coding-flow/flow-types | workspace:* | 类型定义（FlowContent、ProcessNode、FormActionContext 等） |
| @reduxjs/toolkit | ^2.11.2 | Redux 状态管理 |
| react-redux | ^9.2.0 | React Redux 绑定 |
| immer | ^11.1.3 | 不可变数据处理 |
| dayjs | ^1.11.19 | 日期处理 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-approval-presenter/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                   # 入口：聚合导出所有子模块
    ├── type.d.ts                  # 全局类型声明
    ├── context/
    │   ├── index.ts               # 导出 approval + mock
    │   ├── approval.tsx           # ApprovalContextScope + ApprovalContext
    │   └── mock.tsx               # FlowMockContext
    ├── hooks/
    │   ├── index.ts               # 导出 hooks
    │   ├── use-approval-context.ts  # useApprovalContext + createApprovalContext
    │   └── use-mock-context.tsx   # useMockContext
    ├── plugins/
    │   ├── index.ts               # 聚合导出所有插件类型
    │   ├── approval-view-plugin-action.ts  # ApprovalViewPluginAction 接口
    │   ├── add-audit-type.ts      # AddAuditViewPlugin
    │   ├── delegate-type.ts       # DelegateViewPlugin
    │   ├── return-type.ts         # ReturnViewPlugin
    │   ├── sign-key-type.ts       # SignKeyViewPlugin
    │   ├── transfer-type.ts       # TransferViewPlugin
    │   ├── operator-select-type.ts  # OperatorSelectViewPlugin
    │   └── manual-key-type.ts     # ManualViewPlugin
    ├── presenters/
    │   ├── index.ts               # ApprovalPresenter 类
    │   └── action.ts              # FlowActionPresenter 类
    ├── store/
    │   └── index.tsx              # Redux store（approvalSlice + approvalStore）
    └── typings/
        └── index.ts               # 类型定义
```

## 对外入口

入口文件 `src/index.ts`，聚合导出以下子模块：

| 子模块 | 导出内容 |
|--------|----------|
| `context` | `ApprovalContextScope`（类）、`ApprovalContext`（React Context）、`FlowMockContext`（React Context） |
| `plugins` | 7 个插件类型接口 + 对应 VIEW_KEY 常量 + `ApprovalViewPluginAction` 接口 |
| `typings` | `ApprovalLayoutProps`、`ApprovalPanelProps`、`ApprovalState`、`initStateData`、`FlowApprovalApi` |
| `store` | `approvalSlice`、`updateState`、`approvalStore`、`ApprovalReduxState`、`ApprovalStoreAction` |
| `hooks` | `useApprovalContext`、`createApprovalContext`、`useMockContext` |

**插件类型清单**：

| 插件类型 | Key 常量 | 用途 |
|----------|----------|------|
| `AddAuditViewPlugin` | `AddAuditViewPluginKey` | 加签人员选择视图 |
| `DelegateViewPlugin` | `DelegateViewPluginKey` | 委派人员选择视图 |
| `ReturnViewPlugin` | `ReturnViewPluginKey` | 退回人员选择视图 |
| `SignKeyViewPlugin` | `SignKeyViewPluginKey` | 签名视图 |
| `TransferViewPlugin` | `TransferViewPluginKey` | 转办人员选择视图 |
| `OperatorSelectViewPlugin` | `OperatorSelectViewPluginKey` | 操作人指定视图 |
| `ManualViewPlugin` | `ManualViewPluginKey` | 人工节点方向选择视图 |

## 核心功能

### 1. ApprovalPresenter

审批业务核心 Presenter，管理审批状态与表单动作上下文。
- 持有 `ApprovalState`、`FlowApprovalApi`、`FormActionContext`、`FlowActionPresenter`
- `initialState()`：初始化流程内容到 Redux store
- `syncState()`：同步 Redux store 状态到 Presenter
- `getFormActionContext()`：获取表单动作上下文（用于多表单合并场景）
- `getFlowActionPresenter()`：获取动作执行 Presenter

### 2. FlowActionPresenter

审批动作执行引擎，处理各类流程操作的提交逻辑。
- `action(actionId, params)`：执行审批动作（支持单条和合并审批）
- `processNodes()`：查询流程节点状态
- `revoke()` / `urge()`：撤销 / 催办
- 内部区分 PASS 动作（触发表单校验）与非 PASS 动作（仅保存）
- 支持合并审批模式（mergeable + submitRecordIds）
- 支持新建流程（先 create 再 action）和已有流程（直接 action）两种路径

### 3. Redux Store

基于 `@reduxjs/toolkit` 的审批状态管理。
- `approvalSlice`：单一切片，`updateState` reducer 支持直接对象合并和函数式更新
- 使用 `immer` 实现不可变数据更新
- `approvalStore`：预配置的 Redux store，导出 `ApprovalReduxState` 类型

### 4. Context 体系

- `ApprovalContextScope`：封装 Presenter + Props，提供 `close()`、`initialState()`、`syncState()`、`getPresenter()`、`getInitData()` 方法
- `ApprovalContext`：React Context，在组件树中传递 `ApprovalContextScope`
- `FlowMockContext`：Mock 场景上下文，传递 mockKey 字符串

### 5. Hooks

- `useApprovalContext()`：消费 `ApprovalContext`，返回 `{ state, context }`
- `createApprovalContext(props, api)`：工厂 Hook，创建 `ApprovalPresenter` + `ApprovalContextScope` 实例，绑定 Redux dispatch
- `useMockContext()`：获取 mockKey

### 6. FlowApprovalApi 接口

定义后端 API 契约，由上层模块注入具体实现：
- `create(body, mockKey)`：创建流程实例
- `processNodes(body, mockKey)`：查询流程节点
- `action(body, mockKey)`：执行审批动作
- `revoke(id, mockKey)`：撤销
- `urge(id, mockKey)`：催办

### 7. 插件扩展

7 个插件类型接口，基于 `@coding-flow/flow-core` 的 `ViewBindPlugin` 实现视图替换。统一提供 `ApprovalViewPluginAction`（含 `onValidate()` 校验回调）。

## 构建指令

```bash
pnpm -F @coding-flow/flow-approval-presenter build
pnpm -F @coding-flow/flow-approval-presenter test
```
