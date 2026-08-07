# @coding-flow/flow-mobile-approval

Flow Engine 移动端审批组件库，提供审批时间线、审批操作与子流程记录展示。

## 简介

`flow-mobile-approval` 是 Flow Engine 移动端的审批组件库，提供：

- 审批时间线（节点记录、操作者、审批动作与意见）
- 审批动作（通过、拒绝、保存、加签、委派、退回、转办、自定义）
- 子流程记录展示（含"主流程"来源标记与自动跳过标记）
- 审批表单渲染

基于 Ant Design Mobile 组件库与 `flow-approval-presenter` 构建。

### 依赖关系

- **依赖**: `@coding-flow/flow-core`、`@coding-flow/flow-types`、`@coding-flow/flow-icons`、`@coding-flow/flow-approval-presenter`、`@coding-flow/flow-mobile-ui`、`@coding-flow/flow-mobile-form`、`@reduxjs/toolkit`

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