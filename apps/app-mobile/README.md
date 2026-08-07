# Flow Engine 移动端应用

Flow Engine 的移动端流程管理应用。

## 简介

`app-mobile` 是 Flow Engine 的移动端 Web 应用，提供简化的移动操作界面：

- 待办任务列表
- 流程审批操作
- 流程进度查看
- 消息通知

### 核心依赖

- `@coding-flow/flow-core` - 核心 API 库
- `@coding-flow/flow-types` - TypeScript 类型定义
- `@coding-flow/flow-mobile-ui` - 移动端基础 UI 组件库
- `@coding-flow/flow-mobile-approval` - 移动端审批组件库
- `antd-mobile` - 移动端组件库

## Setup

安装依赖:

```bash
pnpm install
```

## 开发

启动开发服务器:

```bash
pnpm run dev
```

## 构建

构建生产版本:

```bash
pnpm run build
```

预览生产构建:

```bash
pnpm run preview
```

## Learn more

- [Flow Engine Docs](https://github.com/codingapi/flow-engine) - 完整文档