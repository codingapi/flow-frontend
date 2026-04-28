# @coding-flow/flow-types

流程引擎前端全局类型定义库，为 PC 端和移动端共用，提供流程设计、审批、表单、图标等业务类型与常量。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-approval-presenter | packages/flow-approval-presenter |
| @coding-flow/flow-design | packages/flow-design |
| @coding-flow/flow-pc-form | packages/flow-pc/flow-pc-form |
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @coding-flow/flow-mobile-form | packages/flow-mobile/flow-mobile-form |
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |
| @flow-example/app-pc | apps/app-pc |
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库（唯一 workspace 依赖） |
| react | >=18（peer） | |
| react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-types/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                  # 入口：re-export types
    └── types/
        ├── index.ts              # 聚合导出所有子模块
        ├── flow-design.ts        # 流程设计类型（节点类型、操作类型）
        ├── flow-approval.ts      # 流程审批类型（待办、审批记录、表单元数据、流程内容）
        ├── form-view.ts          # 表单视图属性
        ├── form-instance.ts      # 表单实例接口
        ├── form-action.ts        # 表单动作上下文
        ├── form-type.ts          # 表单字段类型与类型注册上下文
        └── icons.ts              # 图标名称分组注册表
```

## 对外入口

入口文件 `src/index.ts`，通过 `src/types/index.ts` 聚合导出以下子模块：

| 子模块文件 | 导出内容 |
|------------|----------|
| `flow-design.ts` | `NodeType`（19 种节点类型联合）、`ActionType`（8 种操作类型联合）、`actionOptions`（操作选项常量） |
| `flow-approval.ts` | `FieldPermissionType`、`FieldPermission`、`FieldAttribute`、`FormField`、`FlowForm`、`DisplayStyle`、`FlowActionDisplay`、`FlowAction`、`FlowOperator`、`History`、`FlowTodo`、`FlowApprovalOperator`、`ProcessNode`、`NodeOption`、`FlowContent` |
| `form-view.ts` | `FormData`、`FormViewProps` |
| `form-instance.ts` | `NamePath`、`FormInstance` |
| `form-action.ts` | `IFormAction`（接口）、`FormActionContext`（类） |
| `form-type.ts` | `DataType`、`dataTypeOptions`、`FormTypeAttribute`、`FormType`、`FormTypeContext`（单例类） |
| `icons.ts` | `icons`（图标分组常量） |

## 核心功能

### 1. 流程设计类型

定义流程节点与操作类型枚举，供流程设计器和审批模块使用。
- `NodeType`：19 种节点类型（APPROVAL、CONDITION、END、START、SUB_PROCESS 等）
- `ActionType`：8 种操作类型（SAVE、PASS、REJECT、ADD_AUDIT、DELEGATE、RETURN、TRANSFER、CUSTOM）
- `actionOptions`：操作选项常量数组，用于 UI 下拉选择

### 2. 流程审批类型

定义审批业务全链路数据结构，涵盖待办、表单元数据、审批记录、流程内容。
- `FlowContent`：流程审批内容聚合对象，包含表单、待办、操作按钮、审批记录等
- `FlowTodo`：流程待办对象
- `FlowForm` / `FormField`：表单元数据与字段定义
- `FlowAction`：流程操作按钮配置
- `History`：审批历史记录
- `ProcessNode`：流程节点状态与审批人信息

### 3. 表单类型管理

`FormTypeContext` 单例类，用于注册和查询表单字段类型。
- 支持 `register(types)` 注册自定义表单类型
- 支持 `getOptions()` 获取选项列表、`getType(type)` 按类型查询

### 4. 表单动作上下文

`FormActionContext` 类，管理多个 `IFormAction` 实例，支持批量 `save()` 和 `validate()` 操作。

### 5. 图标名称注册表

`icons` 常量，按分组（方向指示、编辑、提示状态、通用符号、文件文档、数据图表、用户组织、设备硬件、品牌标识、其他）注册 Ant Design Outlined 图标名称，供图标选择器使用。

## 构建指令

```bash
pnpm -F @coding-flow/flow-types build
```

该模块为纯类型库，无 test / typecheck 独立脚本。
