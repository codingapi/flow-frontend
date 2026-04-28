# @coding-flow/flow-core

流程引擎前端基础框架库，提供 HTTP 通信、Presenter 状态管理、Groovy 脚本处理、事件总线、视图插件绑定等与 UI 无关的基础能力，是整个前端 monorepo 的最底层依赖。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-types | packages/flow-types |
| @coding-flow/flow-approval-presenter | packages/flow-approval-presenter |
| @coding-flow/flow-design | packages/flow-design |
| @coding-flow/flow-icons | packages/flow-icons |
| @coding-flow/flow-pc-ui | packages/flow-pc/flow-pc-ui |
| @coding-flow/flow-pc-form | packages/flow-pc/flow-pc-form |
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @coding-flow/flow-mobile-ui | packages/flow-mobile/flow-mobile-ui |
| @coding-flow/flow-mobile-form | packages/flow-mobile/flow-mobile-form |
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |
| @flow-example/app-pc | apps/app-pc |
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| axios | ^1.13.5 | HTTP 客户端（外部依赖） |
| react | ^18.3.1（同属 peer >=18） | PresenterHooks 依赖 useState/useRef/useEffect |
| react-dom | ^18.3.1（同属 peer >=18） | |

无 workspace 依赖，本模块为 monorepo 最底层包。

## 项目结构

```
packages/flow-core/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # 入口：re-export 所有子模块
    ├── http.ts               # HTTP 客户端封装
    ├── presenter.ts          # Presenter 基类与构造器类型
    ├── hooks.ts              # React Hook：创建 Presenter 实例
    ├── view-plugin.ts        # 视图组件注册插件（单例）
    ├── event.ts              # 全局事件总线（单例）
    ├── groovy.ts             # Groovy 脚本格式化与转换工具
    ├── dispatch.ts           # Dispatch 类型定义
    ├── base64.ts             # Base64 编解码工具
    ├── object.ts             # 对象工具方法
    ├── sleep.ts              # 延时工具函数
    └── table.ts              # 表格相关类型定义
```

## 对外入口

入口文件 `src/index.ts`，聚合导出以下子模块：

| 子模块文件 | 导出内容 |
|------------|----------|
| `base64.ts` | `Base64Utils`（类：base64ToBlob、base64ToString、stringToBase64） |
| `dispatch.ts` | `Dispatch<T>`（类型：对应 React useState 的 dispatch 签名） |
| `http.ts` | `MessageBox`（接口）、`Response`（类型）、`HttpClient`（类） |
| `presenter.ts` | `BasePresenter<S, M>`（类）、`PresenterConstructor`（类型） |
| `hooks.ts` | `PresenterHooks`（类：create 静态方法） |
| `object.ts` | `ObjectUtils`（类：isEmptyObject、isEqual、cleanObject） |
| `table.ts` | `Result<T>`（接口）、`ActionType`（接口）、`ParamRequest`（接口） |
| `view-plugin.ts` | `ViewBindPlugin`（单例类：register、get） |
| `groovy.ts` | `CUSTOM_SCRIPT`、`SCRIPT_TITLE`、`SCRIPT_META`（常量）、`GroovyFormatter`（类）、`FormatOptions`（接口）、`GroovyScriptConvertorUtil`（类） |
| `event.ts` | `EventBus`（单例类：on、emit、off） |

## 核心功能

### 1. HTTP 客户端

`HttpClient` 类，基于 axios 封装，提供统一的请求/响应拦截、Token 自动注入、错误处理与消息提示。
- 自动在请求头注入 `localStorage` 中的 token
- 响应拦截处理 token 刷新、登录过期跳转、权限错误提示
- 提供 `get`、`post`、`put`、`delete`、`page`（分页查询，Base64 编码 sort/filter/match 参数）、`download`、`postDownload` 方法
- 通过 `MessageBox` 接口解耦 UI 消息提示，由上层模块注入具体实现

### 2. Presenter 状态管理

`BasePresenter<S, M>` 基类 + `PresenterHooks` Hook，提供类似 MVP 模式的状态管理方案。
- `BasePresenter`：持有 state、dispatch、model 三个核心属性，业务逻辑在子类中实现
- `PresenterHooks.create<P, S, M>()`：React Hook，在组件中创建并管理 Presenter 实例生命周期
- `Dispatch<S>` 类型：对应 React `useState` 的 dispatch 函数签名

### 3. 视图插件绑定

`ViewBindPlugin` 单例，提供动态视图组件的注册与获取能力。
- `register(name, component)`：注册视图组件
- `get(name)`：按名称获取已注册的视图组件

### 4. 事件总线

`EventBus` 单例，提供全局发布/订阅事件通信。
- `on(eventName, callback)`：订阅事件
- `emit(eventName, ...args)`：发布事件
- `off(eventName, callback?)`：取消订阅

### 5. Groovy 脚本处理

提供 Groovy 脚本的格式化、元数据标记与转换能力。
- `GroovyFormatter`：脚本格式化（缩进规范化、操作符空格、注释格式化、Groovy 特定语法处理、压缩）
- `GroovyScriptConvertorUtil`：脚本标记管理（自定义脚本标记 `@CUSTOM_SCRIPT`、标题标记 `@SCRIPT_TITLE`、元数据标记 `@SCRIPT_META`）、脚本内容提取（getReturnScript、clearComments）
- `FormatOptions`：格式化配置接口

### 6. 工具类

- `Base64Utils`：Base64 编解码与 Blob 转换
- `ObjectUtils`：对象判空、比较、清理（递归移除 null/undefined/空值）
- `sleep`：Promise 化延时函数

## 构建指令

```bash
pnpm -F @coding-flow/flow-core build
pnpm -F @coding-flow/flow-core test
```
