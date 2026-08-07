---
name: flow-core/view-bind-plugin
module: flow-core
description: 视图绑定插件（单例模式），通过名称注册和获取 React 组件，实现视图的动态绑定与解耦
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-core"
symbols:
  - ViewBindPlugin
content_hash: bd9a56533dafeb2556c78b55e86ed4beb20f9f5767e086fe96319078b817e636
---

## 解决什么问题

在流程设计器和审批组件中，不同类型的节点/动作需要渲染不同的视图组件。这些视图组件需要在运行时动态注册和获取，而非硬编码引用。`ViewBindPlugin` 提供了一个全局的组件注册中心：

- 插件系统通过 name 注册视图组件
- 运行时通过 name 获取对应的组件进行渲染
- 实现视图层与逻辑层的解耦

## 如何使用

### 1. 注册视图组件

```typescript
import { ViewBindPlugin } from "@coding-flow/flow-core";

const plugin = ViewBindPlugin.getInstance();
plugin.register('condition-view', ConditionViewComponent);
plugin.register('router-view', RouterViewComponent);
```

### 2. 获取视图组件

```typescript
const plugin = ViewBindPlugin.getInstance();
const ViewComponent = plugin.get('condition-view');
// 渲染: <ViewComponent {...props} />
```

### 3. 在项目中的典型用法

`*-view-type.ts` 定义视图键（`VIEW_KEY`）与参数接口，`*-view.tsx` 通过 `ViewBindPlugin.get(VIEW_KEY)` 获取下游注册的组件并在未注册时回退默认实现；真正执行 `ViewBindPlugin.getInstance().register()` 注册自定义视图的是下游 App 层（如 `apps/app-pc/src/hooks/register-plugin-view.tsx`）。

## 使用实例

flow-design 中的插件体系：
- `ConditionViewPlugin` / `RouterViewPlugin` / `SubProcessViewPlugin` 等定义视图键与参数接口，视图组件通过 `ViewBindPlugin.get()` 获取下游注册的实现并回退内置默认视图
- 审批动作视图（add-audit/delegate/return/transfer 等）通过 `ViewBindPlugin.get()` 获取下游注册的视图组件
