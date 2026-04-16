# flow-core 模块架构设计

> **文档编码**：ARCH-002

## 概述

flow-core 是 Flow Engine 前端的核心框架库，不包含任何 UI 组件依赖，提供 HTTP、Hooks、Presenter 基础能力、视图插件机制和 Groovy 脚本工具类。

## 目录结构

```
packages/flow-core/
├── src/
│   ├── index.ts                    # 模块导出
│   ├── http/                       # HTTP 请求封装
│   │   ├── index.ts
│   │   ├── http.ts
│   │   └── types.ts
│   ├── hooks.ts                    # 通用 Hooks
│   ├── presenter/                  # Presenter 基础
│   │   ├── index.ts
│   │   └── presenter.ts
│   ├── dispatch/                   # 状态分发
│   │   ├── index.ts
│   │   └── dispatch.ts
│   ├── base64/                     # Base64 工具
│   ├── object.ts                   # 对象工具
│   ├── table.ts                    # 表格工具
│   ├── event.ts                    # 事件工具
│   ├── view-plugin.ts              # 视图插件机制 ⭐
│   └── groovy.ts                   # Groovy 脚本工具 ⭐
```

## 核心导出

```typescript
// packages/flow-core/src/index.ts
export * from "./base64";
export * from "./dispatch";
export * from "./http";
export * from "./presenter";
export * from "./hooks.ts";
export * from "./object.ts";
export * from "./table.ts";
export * from "./view-plugin.ts";
export * from "./groovy.ts";
export * from "./event.ts";
```

## ViewBind 插件机制

### 设计目的

ViewBindPlugin 是系统的核心扩展机制，允许业务方注册自定义视图来替代默认实现，用于界面定制化需求。

### 核心类设计

```typescript
// packages/flow-core/src/view-plugin.ts

/**
 * 视图绑定插件，提供视图组件注册和获取功能
 */
export class ViewBindPlugin {

    private readonly cache: Map<string, React.ComponentType<any>>;

    private static readonly instance: ViewBindPlugin = new ViewBindPlugin();

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance() {
        return this.instance;
    }

    /**
     * 注册视图组件
     * @param name 视图名称（VIEW_KEY）
     * @param view 视图组件
     */
    public register(name: string, view: React.ComponentType<any>) {
        this.cache.set(name, view);
    }

    /**
     * 获取已注册的视图组件
     * @param name 视图名称
     * @returns 视图组件或 undefined
     */
    public get(name: string) {
        return this.cache.get(name);
    }
}
```

### 使用方式

业务方在应用中注册自定义视图：

```typescript
import { ViewBindPlugin } from "@flow-engine/flow-core";

// 自定义视图组件
const CustomAddAuditView: React.FC<AddAuditViewPlugin> = (props) => {
    return <YourCustomComponent {...props} />;
};

// 注册到全局插件管理器
ViewBindPlugin.getInstance().register('AddAuditViewPlugin', CustomAddAuditView);
```

### 插件 KEY 定义位置

| KEY | 定义位置 | 用途 |
|-----|---------|------|
| AddAuditViewPlugin | flow-approval-presenter | 加签视图 |
| DelegateViewPlugin | flow-approval-presenter | 委派视图 |
| TransferViewPlugin | flow-approval-presenter | 转办视图 |
| ReturnViewPlugin | flow-approval-presenter | 归还视图 |
| SignKeyViewPlugin | flow-approval-presenter | 签名视图 |
| ManualViewPlugin | flow-approval-presenter | 人工节点选择视图 |
| OperatorSelectViewPlugin | flow-approval-presenter | 操作人选择视图 |
| ConditionViewPlugin | flow-design | 条件配置视图 |
| ErrorTriggerViewPlugin | flow-design | 异常处理视图 |
| NodeTitleViewPlugin | flow-design | 节点标题视图 |
| OperatorCreateViewPlugin | flow-design | 发起人范围视图 |
| OperatorLoadViewPlugin | flow-design | 人员选择视图 |
| RouterViewPlugin | flow-design | 路由配置视图 |
| SubProcessViewPlugin | flow-design | 子流程配置视图 |
| TriggerViewPlugin | flow-design | 触发配置视图 |
| ActionCustomViewPlugin | flow-design | 自定义动作视图 |
| ActionRejectViewPlugin | flow-design | 拒绝动作视图 |
| ImportFormViewPlugin | flow-design | 表单导入视图 |

详见：[plugin.md](../design/plugin.md)

## Groovy 脚本工具

### GroovyScriptConvertorUtil

提供脚本的解析、转换工具方法：

```typescript
// packages/flow-core/src/groovy.ts

export class GroovyScriptConvertorUtil {

    /**
     * 判断脚本是否包含自定义注释标记
     */
    public static isCustomScript(script: string): boolean;

    /**
     * 格式化脚本内容
     */
    public static formatScript(script: string): string;

    /**
     * 将普通脚本转换为包含自定义注释标记的脚本
     */
    public static toCustomScript(script: string): string;

    /**
     * 获取脚本中的标题注释内容
     */
    public static getScriptTitle(script: string): string;

    /**
     * 更新脚本中的标题注释内容
     */
    public static updateScriptTitle(script: string, title: string): string;

    /**
     * 获取脚本中的元数据
     */
    public static getScriptMeta(script: string): string;

    /**
     * 更新脚本中的元数据内容
     */
    public static updateScriptMeta(script: string, meta: string): string;

    /**
     * 清除脚本中的注释
     */
    public static clearComments(script: string): string;

    /**
     * 提取脚本中的 return 表达式
     */
    public static getReturnScript(script: string): string;
}
```

### 脚本注释标记

| 标记 | 说明 |
|------|------|
| `@CUSTOM_SCRIPT` | 标识为自定义脚本，编辑器以代码形式展示 |
| `@SCRIPT_TITLE` | 脚本展示标题 |
| `@SCRIPT_META` | 脚本元数据，JSON 格式 |

详见：[groovy-script.md](../design/groovy-script.md)

## HTTP 模块

### HttpClient

基于 fetch 的 HTTP 请求封装，支持请求拦截、响应拦截、错误处理。

### 核心接口

```typescript
// packages/flow-core/src/http/types.ts

export interface RequestConfig {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
}

export interface HttpClient {
    request<T>(config: RequestConfig): Promise<T>;
    get<T>(url: string, config?: RequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    delete<T>(url: string, config?: RequestConfig): Promise<T>;
}
```

## Dispatch 模块

状态更新分发器，用于 presenter 与 redux store 之间的通信。

```typescript
// packages/flow-core/src/dispatch/dispatch.ts

export type Dispatch<S> = (
    partialState: Partial<S> | ((prevState: S) => Partial<S>)
) => void;
```

## Hooks 模块

提供通用的 React Hooks：

- `useAsync` - 异步操作 Hook
- `useDebounce` - 防抖 Hook
- `useThrottle` - 节流 Hook
- 等其他工具 Hook

## Presenter 基础

```typescript
// packages/flow-core/src/presenter/presenter.ts

export interface IPresenter<S> {
    syncState(state: S): void;
}
```

定义 Presenter 接口规范，各业务模块的 Presenter 实现需遵循此规范。

## 依赖该模块的包

- flow-icons
- flow-approval-presenter
- flow-types（部分工具）
- flow-design
- flow-pc-*
- flow-mobile-*
- app-pc / app-mobile
