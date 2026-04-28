# @coding-flow/flow-design

流程设计器组件库，提供可视化流程画布编辑器、流程属性面板、脚本配置组件、Groovy 代码编辑器及插件扩展机制。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @flow-example/app-pc | apps/app-pc |
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库（HttpClient、ViewBindPlugin、Presenter） |
| @coding-flow/flow-icons | workspace:* | 图标库 |
| @coding-flow/flow-pc-ui | workspace:* | PC 端基础 UI 组件（Drawer 等） |
| @coding-flow/flow-types | workspace:* | 类型定义 |
| react / react-dom | >=18（peer） | |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| @flowgram.ai/* | 1.0.8 | 可视化流程画布引擎（fixed-layout-editor、minimap-plugin、panel-manager-plugin 等） |
| @codemirror/* | ^6.x | CodeMirror 代码编辑器 |
| @reduxjs/toolkit | ^2.11.2 | 状态管理 |
| react-redux | ^9.2.0 | React Redux 绑定 |
| antd | ^6.2.1 | Ant Design 组件库 |
| styled-components | ^5.3.11 | CSS-in-JS 样式方案 |
| immer | ^11.1.3 | 不可变数据处理 |
| lodash-es | ^4.17.23 | 工具函数 |
| nanoid | ^5.1.6 | ID 生成 |
| dayjs | ^1.11.19 | 日期处理 |

## 项目结构

```
packages/flow-design/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                           # 入口：导出 DesignPanel、DesignImport、插件类型
    ├── type.d.ts                          # 全局类型声明
    ├── api/                               # HTTP API 层
    │   ├── index.ts                       #   HttpClient 实例（10s 超时，antd message）
    │   └── workflow.ts                    #   工作流 CRUD API（list/save/load/export/import 等）
    ├── assets/                            # SVG 图标组件
    │   ├── icon-mouse.tsx                 #   鼠标光标图标
    │   └── icon-pad.tsx                   #   平板图标
    ├── utils/                             # 工具函数
    │   ├── id.ts                          #   ID 生成（nanoid）
    │   └── index.ts
    ├── components/
    │   ├── design-editor/                 # 可视化流程画布编辑器
    │   │   ├── index.tsx                  #   FlowEditor、FlowEditorAction
    │   │   ├── components/                #   画布基础组件
    │   │   │   ├── sidebar/               #     节点配置侧边栏（nodeFormPanelFactory）
    │   │   │   ├── base-node/             #     基础节点渲染
    │   │   │   ├── branch-adder/          #     分支添加器
    │   │   │   ├── collapse/              #     折叠控件
    │   │   │   ├── node-adder/            #     节点添加器
    │   │   │   ├── node-icon/             #     节点图标
    │   │   │   └── node-list/             #     节点列表
    │   │   ├── context/                   #   React Context（NodeRender、IsSidebar、NodeForm）
    │   │   ├── hooks/                     #   编辑器 Hooks（useEditorProps、useIsSidebar）
    │   │   ├── nodes/                     #   20 种节点类型注册表
    │   │   │   ├── start/                 #     开始节点
    │   │   │   ├── end/                   #     结束节点
    │   │   │   ├── approval/              #     审批节点
    │   │   │   ├── handle/                #     办理节点
    │   │   │   ├── notify/                #     抄送节点
    │   │   │   ├── condition/             #     条件控制节点
    │   │   │   ├── condition-branch/      #     条件分支节点
    │   │   │   ├── condition-else-branch/ #     条件 Else 分支节点
    │   │   │   ├── inclusive/             #     包容控制节点
    │   │   │   ├── inclusive-branch/      #     包容分支节点
    │   │   │   ├── inclusive-else-branch/ #     包容 Else 分支节点
    │   │   │   ├── parallel/              #     并行控制节点
    │   │   │   ├── parallel-branch/       #     并行分支节点
    │   │   │   ├── manual/                #     人工控制节点
    │   │   │   ├── manual-branch/         #     人工分支节点
    │   │   │   ├── delay/                 #     延迟节点
    │   │   │   ├── router/                #     路由节点
    │   │   │   ├── sub-process/           #     子流程节点
    │   │   │   └── trigger/               #     触发器节点
    │   │   ├── node-components/           #   节点内部子组件
    │   │   │   ├── panel/                 #     节点面板包装器（NodePanel）
    │   │   │   ├── header/                #     节点头部
    │   │   │   ├── action/                #     操作按钮配置
    │   │   │   ├── strategy/              #     策略配置
    │   │   │   ├── view/                  #     视图配置
    │   │   │   ├── condition/             #     条件配置
    │   │   │   ├── taps/                  #     标签页配置
    │   │   │   ├── layout/                #     布局配置
    │   │   │   ├── promission/            #     权限配置
    │   │   │   ├── node-hint/             #     节点提示
    │   │   │   ├── node-order/            #     节点排序
    │   │   │   └── manual-title/          #     人工节点标题
    │   │   ├── tools/                     #   画布工具栏（缩放、撤销、下载等）
    │   │   ├── typings/                   #   编辑器类型定义
    │   │   └── version/                   #   编辑器版本管理
    │   ├── design-panel/                  # 流程属性面板（Drawer）
    │   │   ├── index.tsx                  #   DesignPanel 组件
    │   │   ├── types.ts                   #   面板类型定义（Workflow、FlowNode、State）
    │   │   ├── context/                   #   React Context（DesignPanelContext）
    │   │   ├── hooks/                     #   面板 Hooks（useDesignContext、useNodeRouterManager）
    │   │   ├── layout/                    #   面板布局（Header、Body、Footer）
    │   │   ├── manager/                   #   管理器（WorkflowFormManager、NodeConvertorManager、NodeRouterManager）
    │   │   ├── panels/                    #   面板内容区（workflow 配置）
    │   │   ├── presenters/                #   MVP Presenter（状态管理、CRUD 操作）
    │   │   │   ├── index.ts               #     Presenter 类
    │   │   │   └── convertor/             #     WorkflowConvertor（API ↔ 渲染格式转换）
    │   │   └── tabs/                      #   标签页
    │   │       ├── base/                  #     基本信息标签页
    │   │       └── form/                  #     表单配置标签页
    │   ├── design-import/                 # 流程导入对话框
    │   │   ├── index.tsx                  #   DesignImport 组件
    │   │   └── upload.tsx                 #   文件上传组件（JSON → Base64）
    │   └── groovy-code/                   # Groovy 代码编辑器
    │       └── index.tsx                  #   GroovyCodeEditor（基于 CodeMirror 6）
    ├── plugins/                           # 插件类型与视图
    │   ├── index.ts                       #   聚合导出所有插件类型与 Key
    │   ├── design-view-plugin-action.ts   #   插件动作接口（onValidate）
    │   ├── action-custom-view-type.ts     #   自定义动作插件
    │   ├── action-reject-view-type.ts     #   拒绝动作插件
    │   ├── condition-view-type.ts         #   条件脚本插件
    │   ├── error-trigger-view-type.ts     #   错误触发器插件
    │   ├── import-form-view-type.ts       #   表单导入插件
    │   ├── node-title-view-type.ts        #   节点标题插件
    │   ├── operator-create-view-type.ts   #   发起人范围脚本插件
    │   ├── operator-load-view-type.ts     #   处理人分配脚本插件
    │   ├── router-view-type.ts            #   路由脚本插件
    │   ├── sub-process-view-type.ts       #   子流程插件
    │   ├── trigger-view-type.ts           #   触发器插件
    │   └── view/                          #   默认视图实现（每个插件对应一个 .tsx）
    └── script-components/                 # 脚本配置 UI 组件
        ├── typings/                       #   脚本类型定义（ScriptType、GroovyVariableMapping）
        ├── hooks/                         #   脚本 Hooks（useScriptMetaData）
        ├── services/                      #   脚本解析与生成服务
        ├── utils/                         #   工具函数
        ├── modal/                         #   各类脚本配置弹窗
        ├── components/
        │   ├── action/                    #   操作按钮配置表单
        │   ├── condition/                 #   条件脚本编辑器
        │   ├── form-data/                 #   表单数据映射编辑器
        │   └── sub-process/               #   子流程配置表单
        └── default-script.ts              #   各类脚本默认模板
```

## 对外入口

入口文件 `src/index.ts`，导出以下三组内容：

| 来源模块 | 导出内容 |
|----------|----------|
| `components/design-panel` | `DesignPanel` — 流程属性面板组件（Drawer 形式） |
| `components/design-import` | `DesignImport` — 流程导入对话框组件 |
| `plugins` | 11 个插件类型接口 + 对应 VIEW_KEY 常量 + `DesignViewPluginAction` 接口 |

**插件类型清单**：

| 插件类型 | Key 常量 | 用途 |
|----------|----------|------|
| `ActionCustomViewPlugin` | `ActionCustomViewPluginKey` | 自定义动作脚本配置视图 |
| `ActionRejectViewPlugin` | `ActionRejectViewPluginKey` | 拒绝动作配置视图 |
| `ConditionViewPlugin` | `ConditionViewPluginKey` | 条件脚本编辑视图 |
| `ErrorTriggerViewPlugin` | `ErrorTriggerViewPluginKey` | 错误触发器脚本视图 |
| `ImportFormViewPlugin` | `IMPORT_FORM_VIEW_KEY` | 表单导入视图 |
| `NodeTitleViewPlugin` | `NodeTitleViewPluginKey` | 节点标题脚本视图 |
| `OperatorCreateViewPlugin` | `OperatorCreateViewPluginKey` | 发起人范围脚本视图 |
| `OperatorLoadViewPlugin` | `OperatorLoadViewPluginKey` | 处理人分配脚本视图 |
| `RouterViewPlugin` | `RouterViewPluginKey` | 路由脚本视图 |
| `SubProcessViewPlugin` | `SubProcessViewPluginKey` | 子流程配置视图 |
| `TriggerViewPlugin` | `TriggerViewPluginKey` | 触发器脚本视图 |

## 核心功能

### 1. 可视化流程画布编辑器

基于 `@flowgram.ai/fixed-layout-editor` 实现的流程画布编辑器，支持拖拽、缩放、小地图、撤销/重做等功能。
- 20 种节点类型注册表（`FlowNodeRegistries`），每种节点有独立的渲染组件与配置面板
- 节点配置通过侧边栏（`nodeFormPanelFactory`）展示，支持 hover 触发
- 工具栏支持交互模式切换、纵向布局、缩放、适应视图、小地图、只读、撤销/重做、下载

### 2. 流程属性面板

Drawer 形式的流程属性编辑面板，采用 MVP + Redux 架构。
- `Presenter`：封装所有业务逻辑（保存、加载、创建、节点管理、表单字段 CRUD）
- `DesignPanelContext`：提供 close/save/syncState/initState/getPresenter 方法
- 标签页：基本信息（title/code/form）、表单配置（字段管理/子表单/导入）
- 管理器：`WorkflowFormManager`（表单 CRUD）、`NodeConvertorManager`（节点数据转换）、`NodeRouterManager`（节点路由分析）

### 3. 插件扩展机制

基于 `@coding-flow/flow-core` 的 `ViewBindPlugin` 单例，提供 11 个可扩展视图插槽。
- 每个插件定义类型接口和 VIEW_KEY 常量
- 内置默认视图实现（`plugins/view/` 目录下）
- 外部应用通过 `ViewBindPlugin.register(key, component)` 覆盖默认视图
- 统一的 `DesignViewPluginAction` 接口提供 `onValidate(script)` 校验回调

### 4. 脚本配置组件

为各类型 Groovy 脚本提供可视化配置 UI。
- `ActionForm`：操作按钮属性编辑（标题、图标、样式、类型特定字段）
- `ConditionView`：条件脚本编辑器（条件组、条件关系）
- `FormDataView`：表单数据映射编辑器
- `SubProcessView`：子流程配置（目标流程、触发动作、处理人、表单数据）
- 各类脚本配置弹窗（modal/）和默认脚本模板（default-script.ts）

### 5. Groovy 代码编辑器

基于 CodeMirror 6 的 Groovy/Java 语法高亮编辑器，支持暗色/亮色主题、行号、折叠、括号匹配、撤销/重做、只读模式。

### 6. API 层

封装工作流相关的所有 HTTP 接口，按查询（`/api/query/`）和命令（`/api/cmd/`）路径组织，包括列表、版本管理、元数据、CRUD、导入导出等 15 个接口。

## 关键组件

### DesignPanel

流程属性面板主组件。Props：`id`（流程编码）、`open`（是否开启）、`onClose`（关闭回调）、`drawerClassName`、`className`。内部通过 Redux Provider + DesignPanelContext 管理状态。

### DesignImport

流程导入对话框。Props：`open`、`onClose`。包含文件上传表单，将 JSON 文件转为 Base64 后调用 `importWorkflow` API。

### FlowEditor

流程画布编辑器（内部组件，非顶层导出）。通过 `actionRef` 暴露 `getData()` / `resetData()` 方法。

### GroovyCodeEditor

Groovy 代码编辑器组件。Props：`value`、`onChange`、`readonly` 等。

## 构建指令

```bash
pnpm -F @coding-flow/flow-design build
pnpm -F @coding-flow/flow-design test
```
