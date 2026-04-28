# @coding-flow/flow-mobile-form

移动端表单组件库，提供流程表单渲染和合并流程列表视图，基于 `@coding-form/form-engine` 引擎实现表单渲染。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库 |
| @coding-flow/flow-types | workspace:* | 类型定义（FormViewProps、FlowForm、FieldPermission、FormData 等） |
| @coding-form/form-engine | ^0.0.16 | 表单渲染引擎（外部 npm 包） |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| antd-mobile | ^5.42.3 | Ant Design Mobile 组件库 |
| dayjs | ^1.11.19 | 日期处理 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-mobile/flow-mobile-form/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                            # 入口：导出 FlowFormView
    └── components/
        ├── form/
        │   ├── index.tsx                   # FlowFormView 主组件（模式分发）
        │   └── view.tsx                    # FlowFormView 内部渲染器
        └── list/
            ├── index.tsx                   # FlowList 列表视图（多选/单选切换）
            ├── presenter.tsx               # ListFormPresenter
            ├── types.ts                    # FlowListProps 类型
            ├── hooks/
            │   └── use-list-form-presenter.tsx  # Presenter Hook
            └── components/
                ├── multiple-list.tsx       # 多选列表（勾选合并记录）
                └── single-list.tsx         # 单条详情视图
```

## 对外入口

入口文件 `src/index.ts`，导出：

| 导出内容 | 类型 | 说明 |
|----------|------|------|
| `FlowFormView` | `React.FC<FormViewProps>` | 流程表单视图主组件（从 `@coding-flow/flow-types` 导入 Props 类型） |

## 核心功能

### 1. FlowFormView 主组件

根据 `mergeable` 属性分发渲染模式：
- `mergeable: true` → 渲染 `FlowList` 合并流程列表视图
- `mergeable: false` + `form` 存在 → 渲染单个表单视图（`FormView`）

### 2. FlowFormView 内部渲染器

基于 `@coding-form/form-engine` 的 `FormView` 组件封装：
- 接收 `meta`（表单元数据）、`form`（表单操控对象）、`fieldPermissions`（字段权限）、`review`（预览模式）
- 使用 antd-mobile 的 `Form.Item` 包裹，内置隐藏的 `recordId` 表单项
- 通过 form-engine 的 `onValuesChange` 回调触发外部的值变更通知

### 3. FlowList 合并流程列表

合并审批场景下的列表视图，支持两种模式切换：
- **多选模式**（`FlowMultipleList`）：展示所有待办记录列表，支持 checkbox 勾选，选中记录 ID 通过 `onMergeRecordIdsSelected` 回调
- **单条模式**（`FlowSingleList`）：点击某条记录后切换到单条详情表单视图，支持返回多选模式

### 4. ListFormPresenter

列表数据管理 Presenter：
- `getDatasource(initData)`：将多条表单数据映射为列表数据源
- `getFormDataByRecordId(id)`：按记录 ID 查找表单数据

## 构建指令

```bash
pnpm -F @coding-flow/flow-mobile-form build
pnpm -F @coding-flow/flow-mobile-form test
```
