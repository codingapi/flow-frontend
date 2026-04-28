# 调整计划: 表单名称和表单编码字段迁移至表单设计标签页

> 编码: 958191 | 日期: 2026-04-28 | 类型: 调整任务 | 来源: change | 基于: docs/changes/958191-move-form-fields-to-design-tab.md

## 调整目标

将「表单名称」(`form.name`) 和「表单编码」(`form.code`) 两个字段从基本信息标签页 (`TabBase`) 迁移到表单设计标签页 (`TabForm`) 顶部，使用户在表单设计界面即可直接编辑这两个字段，无需切换到基本信息页。

## 影响面（基于指令结果）

- 涉及 package: `@coding-flow/flow-design`（仅此一个包）
- 直接依赖者: `@flow-example/app-pc`（仅消费方，无 API 变更，无需改动）
- 外部 API / 公共组件影响: 否。本次变更为纯 UI 布局调整，不涉及对外导出的 Props 或类型

## 现状代码勘察

| 现状位置 | 现状内容 | 目标变更 |
|----------|----------|----------|
| `tabs/base/index.tsx:107-133` | CardForm 内包含 `form.name`（表单名称）和 `form.code`（表单编码）两个 CardForm.Item | 移除这两个 CardForm.Item |
| `tabs/form/index.tsx:32-36` | 当 `mainCode` 为空时显示 Empty 提示"请先在基本信息中添加表单的定义配置" | 移除此 Empty 提示，改为始终渲染表单名称/编码输入行 + 字段管理区域 |
| `tabs/form/index.tsx:44-64` | TabForm 使用 `<Panel>` 包裹，内含 FormTable + Tabs（子表） | 在 FormTable 之前新增一行展示表单名称和表单编码输入框 |
| `types.ts:68-73` | State 中 `workflow.form` 包含 `code`/`name` 字段 | 数据结构不变，仅 UI 位置迁移 |
| `presenters/index.ts:131-141` | `importWorkflowForm` 方法会更新 `form.name`/`form.code` | 逻辑不变，但 TabForm 需自行注册 formActionContext 以支持保存时收集字段值 |

## 分步策略

1. **Step A**: 在 `TabForm` 组件中新增顶部输入行（表单名称 + 表单编码），使用 CardForm 包裹并注册到 `formActionContext`
2. **Step B**: 移除 `TabBase` 中的表单名称和表单编码两个 CardForm.Item
3. **Step C**: 移除 `TabForm` 中当 `mainCode` 为空时的 Empty 提示逻辑，改为始终展示内容
4. **Step D**: 编译验证 + 手工核验

## 新增文件

无

## 修改文件

| 文件路径 | 修改内容 |
|----------|----------|
| `packages/flow-design/src/components/design-panel/tabs/form/index.tsx` | 1. 引入 CardForm 组件；2. 新增 `formForm` 表单实例并注册到 formActionContext（key 为 `form`）；3. 在顶部新增一行水平排列的表单名称和表单编码输入框；4. 移除当 mainCode 为空时的 Empty 提示分支，改为始终渲染；5. useEffect 中同步 state.workflow 到 formForm |
| `packages/flow-design/src/components/design-panel/tabs/base/index.tsx` | 移除 `form.name`（表单名称，L107-119）和 `form.code`（表单编码，L121-133）两个 CardForm.Item |

## 移除文件（若有）

无

## 兼容性与迁移

- 保留的 API / 行为: Presenter 层的 `formActionContext` 收集机制不变，save 时仍能正确收集 form.name 和 form.code 的值
- 破坏性变更: 无。字段数据路径 (`form.name`、`form.code`) 保持一致，仅 UI 位置变更
- 数据/配置迁移: 无需

## 核验机制

| 验证项 | 说明 |
|--------|------|
| 构建 | `pnpm -F @coding-flow/flow-design build` 编译通过 |
| 行为回归 1 | 基本信息标签页仍正常显示流程标题、流程备注、流程编码、发起人范围 |
| 行为回归 2 | 表单设计标签页顶部新增表单名称和表单编码两个输入框，且能正常编辑和保存 |
| 行为回归 3 | 保存流程时，form.name 和 form.code 的值能正确提交到后端 |
| 行为回归 4 | 导入表单后，表单名称和表单编码输入框能正确回显导入的值 |

具体验证命令：

```bash
pnpm -F @coding-flow/flow-design build
```

## 执行顺序

1. 修改 `packages/flow-design/src/components/design-panel/tabs/form/index.tsx`：引入 CardForm，新增 formForm 实例，注册 formActionContext，在顶部新增表单名称和表单编码输入行，移除 Empty 提示分支
2. 修改 `packages/flow-design/src/components/design-panel/tabs/base/index.tsx`：移除表单名称和表单编码两个 CardForm.Item
3. 执行 `pnpm -F @coding-flow/flow-design build` 验证编译通过
