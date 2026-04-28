# @coding-flow/flow-pc-form

PC 端表单组件库，提供流程表单渲染和合并流程表格视图，基于 `@coding-form/form-engine` 引擎实现表单渲染。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @flow-example/app-pc | apps/app-pc |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库（ObjectUtils） |
| @coding-flow/flow-types | workspace:* | 类型定义（FormViewProps、FlowForm、FieldPermission、FormData 等） |
| @coding-form/form-engine | ^0.0.16 | 表单渲染引擎（外部 npm 包） |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| antd | ^6.2.1 | Ant Design 组件库 |
| dayjs | ^1.11.19 | 日期处理 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-pc/flow-pc-form/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                            # 入口：导出 FlowFormView
    └── components/
        ├── form/
        │   ├── index.tsx                   # FlowFormView 主组件（模式分发）
        │   └── view.tsx                    # FlowFormView 内部渲染器
        └── table/
            ├── index.tsx                   # FlowTable 合并流程表格视图
            ├── presenter.ts                # TableFormPresenter
            ├── types.ts                    # FlowTableProps 类型
            └── hooks/
                └── use-table-form-presenter.tsx  # Presenter Hook
```

## 对外入口

入口文件 `src/index.ts`，导出：

| 导出内容 | 类型 | 说明 |
|----------|------|------|
| `FlowFormView` | `React.FC<FormViewProps>` | 流程表单视图主组件（从 `@coding-flow/flow-types` 导入 Props 类型） |

## 核心功能

### 1. FlowFormView 主组件

根据 `mergeable` 属性分发渲染模式：
- `mergeable: true` → 渲染 `FlowTable` 合并流程表格视图
- `mergeable: false` + `form` 存在 → 渲染单个表单视图（`FormView`）

### 2. FlowFormView 内部渲染器

基于 `@coding-form/form-engine` 的 `FormView` 组件封装：
- 接收 `meta`（表单元数据）、`form`（表单操控对象）、`fieldPermissions`（字段权限）、`review`（预览模式）
- 内置隐藏的 `recordId` 表单项
- `onBlur` 事件触发 `onValuesChange` 回调（通过 `ObjectUtils.isEqual` 去重）

### 3. FlowTable 合并流程表格

合并审批场景下的表格视图：
- 展示所有待办记录的表格（编号、标题、提交人、发起人 + 表单字段列）
- 支持行选择（checkbox），选中记录 ID 通过 `onMergeRecordIdsSelected` 回调
- 点击"查看"切换到单条记录的表单详情视图，支持返回
- `TableFormPresenter` 负责列定义生成和数据源映射

### 4. TableFormPresenter

表格数据管理 Presenter：
- `getColumns()`：根据表单元数据字段生成表格列定义（含固定列：编号、标题、提交人、发起人）
- `getDatasource(initData)`：将多条表单数据映射为表格数据源
- `getFormDataByRecordId(id)`：按记录 ID 查找表单数据

## 构建指令

```bash
pnpm -F @coding-flow/flow-pc-form build
pnpm -F @coding-flow/flow-pc-form test
```
