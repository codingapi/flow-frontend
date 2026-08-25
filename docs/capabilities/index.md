# 能力（Capabilities）

> 🔄 此文件由 `rebuild_pkr_index.py` 自动生成，请勿手动编辑。

## ✅ 已实现

| 名称 | 模块 | 描述 | 范围 | 来源 |
|------|------|------|------|------|
| [antd/antd](./antd/antd.md) | antd | Ant Design (PC) / Ant Design Mobile (移动端) UI 组件库，提供丰富的预置组件 | 前端 | 框架:Ant Design |
| [flow-approval/sub-process-record](./flow-approval/sub-process-record.md) | flow-approval | PC 与移动端审批时间线中的子流程聚合状态、完成进度和实例明细展示 | 前端 | 项目自有 |
| [flow-approval-presenter/action-factory](./flow-approval-presenter/action-factory.md) | flow-approval-presenter | 动作工厂（单例模式），按 ActionType 注册并渲染对应的审批动作组件（Pass/Reject/Save/AddAudit/Delegate/Ret... | 前端 | 项目自有 |
| [flow-core/event-bus](./flow-core/event-bus.md) | flow-core | 全局事件总线（单例模式），提供 on/emit/off 发布订阅通信能力 | 前端 | 项目自有 |
| [flow-core/groovy-formatter](./flow-core/groovy-formatter.md) | flow-core | Groovy 脚本格式化与转换工具，提供脚本格式化、标记管理、元数据提取、return 表达式解析等能力 | 前端 | 项目自有 |
| [flow-core/http-client](./flow-core/http-client.md) | flow-core | 基于 axios 封装的 HTTP 客户端，提供请求/响应拦截器、token 自动管理、分页查询、文件下载等能力 | 前端 | 项目自有 |
| [flow-core/presenter](./flow-core/presenter.md) | flow-core | Presenter 模式框架，通过 state + dispatch + model 三要素桥接 React useState，实现业务逻辑与视图分离 | 前端 | 项目自有 |
| [flow-core/view-bind-plugin](./flow-core/view-bind-plugin.md) | flow-core | 视图绑定插件（单例模式），通过名称注册和获取 React 组件，实现视图的动态绑定与解耦 | 前端 | 项目自有 |
| [flow-core/message-registry](./flow-core/message-registry.md) | flow-core | 流程消息注册表（单例模式），将所有消息提示从硬编码中解耦，支持下游 App 通过字符串模板或函数模板自定义消息内容，运行时上下文数据由 Presenter 自动注入 | 前端 | 项目自有 |
| [flow-design/manager-group](./flow-design/manager-group.md) | flow-design | 设计面板管理器组，包含表单字段管理、节点转换管理、路由节点管理和工作流策略管理 | 前端 | 项目自有 |
| [flow-design/node-registry](./flow-design/node-registry.md) | flow-design | 流程节点注册机制，通过 FlowNodeRegistry 接口定义 19 种节点类型并注册到 Flowgram 固定布局编辑器 | 前端 | 项目自有 |
| [flow-design/sub-process-config](./flow-design/sub-process-config.md) | flow-design | 子流程节点的多实例创建、结果判定脚本、异常节点跳转与重置能力开关配置 | 前端 | 项目自有 |
| [flowgram/flowgram](./flowgram/flowgram.md) | flowgram | Flowgram 固定布局流程编辑器，提供可视化节点编辑、连线、迷你地图等能力 | 前端 | 框架:Flowgram |
| [form-engine/form-engine](./form-engine/form-engine.md) | form-engine | 外部表单引擎，提供表单渲染、表单项注册、表单实例创建等能力 | 前端 | 框架:Form Engine |
| [react/react](./react/react.md) | react | React UI 框架，提供组件化渲染、Hooks 响应式状态管理、虚拟 DOM 等核心能力 | 前端 | 框架:React |
| [redux/redux-toolkit](./redux/redux-toolkit.md) | redux | Redux Toolkit 全局状态管理框架，提供 createSlice、configureStore、immer 集成等能力 | 前端 | 框架:Redux Toolkit |
| [script-engine/script-engine](./script-engine/script-engine.md) | script-engine | 外部脚本引擎，提供 Groovy 脚本转换处理能力 | 前端 | 框架:Script Engine |

---

**统计**: 共 17 篇 — 已实现 17 / 计划中 0 / 已废弃 0
