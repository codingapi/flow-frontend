# @coding-flow/flow-approval-presenter

Flow Engine 审批展示器框架，基于 Redux 管理审批状态与动作分发。

## 简介

`flow-approval-presenter` 是 Flow Engine 的审批展示器框架，提供审批状态管理能力：

- 审批状态管理（Redux store：节点、操作者、动作、表单数据）
- 审批动作分发（通过/拒绝/保存/加签/委派/退回/转办/自定义）
- 审批视图绑定（ViewBindPlugin 动态绑定审批动作视图）
- 审批上下文（`useApprovalContext` 桥接 React 与 Presenter）

PC 端与移动端审批组件库均基于此框架构建。

### 依赖关系

- **依赖**: `@coding-flow/flow-core`、`@coding-flow/flow-types`、`@reduxjs/toolkit`、`react-redux`

## Setup

安装依赖:

```bash
pnpm install
```

## 开发

构建组件库:

```bash
pnpm run build
```

## Learn more

- [Flow Engine Docs](https://github.com/codingapi/flow-engine) - 完整文档