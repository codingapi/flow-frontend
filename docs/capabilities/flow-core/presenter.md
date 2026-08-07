---
name: flow-core/presenter
module: flow-core
description: Presenter 模式框架，通过 state + dispatch + model 三要素桥接 React useState，实现业务逻辑与视图分离
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-core"
symbols:
  - BasePresenter
  - PresenterConstructor
  - PresenterHooks
  - Dispatch
content_hash: 641d5e1af3a9bb3827cdf3da2dbab047abd95d5d5765b10615ded43b47dc482d
---

## 解决什么问题

在复杂业务场景中，直接将业务逻辑写在 React 组件内会导致代码耦合度高、难以测试和复用。Presenter 模式框架提供了一套标准化的方式来分离业务逻辑与视图层：

- `BasePresenter<S, M>` 封装了 state、dispatch、model 三要素
- `PresenterHooks.create()` 将 Presenter 与 React useState 桥接，自动同步状态
- `Dispatch<T>` 类型统一了状态更新函数签名

## 如何使用

### 1. 定义 Presenter 类

继承 `BasePresenter<S, M>`，其中 S 为状态类型，M 为 Model/API 类型：

```typescript
import { BasePresenter } from "@coding-flow/flow-core";

class MyPresenter extends BasePresenter<MyState, MyApi> {
    public doSomething() {
        // 通过 this.state 读取状态
        // 通过 this.dispatch 更新状态
        // 通过 this.model 调用外部 API
    }
}
```

### 2. 在 React 组件中使用 PresenterHooks

```typescript
import { PresenterHooks } from "@coding-flow/flow-core";

const MyComponent = ({ api }: { api: MyApi }) => {
    const { state, presenter } = PresenterHooks.create(
        MyPresenter,
        initialState,
        api
    );
    // presenter 已自动绑定 state 和 dispatch
    // state 变化时 presenter.syncState() 自动调用
};
```

### 3. Dispatch 类型

```typescript
import { Dispatch } from "@coding-flow/flow-core";

// 支持直接赋值或函数式更新
type Dispatch<T> = (updater: ((prevState: T) => T) | T) => void;
```

## 使用实例

项目中的实际应用：

- `ApprovalPresenter`（flow-approval-presenter）：审批状态管理
- `Presenter`（flow-design/design-panel）：设计面板状态管理
- `Presenter`（flow-design/condition）：条件编辑器状态管理

以上 Presenter 类均为各包自建 class，遵循 state + dispatch + model 设计模式，但未直接继承 `BasePresenter`，也未使用 `PresenterHooks`（框架类仅由 flow-core 包自身定义与使用）。
