# @coding-flow/flow-pc-ui

PC 端基础 UI 组件库，提供基于 Ant Design 封装的通用原子组件（Drawer、Panel、Table、CardForm、Text）。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-design | packages/flow-design |
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @flow-example/app-pc | apps/app-pc |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库（Table 使用 Result、ActionType、ParamRequest 类型） |
| @ant-design/icons | ~6.1.0 | Ant Design 图标 |
| antd | ^6.2.1 | Ant Design 组件库 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-pc/flow-pc-ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # 入口：导出 5 个组件
    ├── type.d.ts                   # 静态资源类型声明
    └── components/
        ├── drawer/index.tsx        # Drawer 全屏抽屉
        ├── panel/index.tsx         # Panel 居中面板布局
        ├── table/index.tsx         # Table 远程分页表格
        ├── card-from/index.tsx     # CardForm 卡片表单
        └── text/index.tsx          # Text 文本省略
```

## 对外入口

入口文件 `src/index.ts`，导出以下 5 个组件：

| 组件 | 类型 | 说明 |
|------|------|------|
| `Drawer` | `React.FC<DrawerProps>` | Ant Design Drawer 封装，默认全屏尺寸、无标题/关闭图标、隐藏时销毁 |
| `Panel` | `React.FC<PanelProps>` | 居中 Flex 垂直布局容器，左右 10% 外边距 |
| `Table` | `React.FC<TableProps<RecordType>>` | 远程分页表格，支持 `request` 数据源、`toolBarRender` 工具栏、`actionType` 命令式 reload |
| `CardForm` | `React.FC<CardFormProps>` | Card + Form 组合，含 `CardForm.Item` 和 `CardForm.useForm` 静态方法 |
| `Text` | `React.FC<TextProps>` | 文本省略组件，保留末尾 `suffixCount` 个字符 |

## 核心功能

### 1. Drawer

封装 Ant Design `Drawer`，预设默认值：
- `title: false`、`closeIcon: false`
- `size: "100%"`、`destroyOnHidden: true`

### 2. Panel

居中 Flex 布局容器，提供垂直居中、左右 10% 外边距的通用页面布局。

### 3. Table

远程分页表格组件，核心特性：
- `request(params: ParamRequest)` — 远程数据加载函数，返回 `Result<T>`
- `toolBarRender()` — 工具栏渲染函数
- `actionType: Ref<ActionType>` — 命令式接口，暴露 `reload()` 方法
- 内置分页状态管理（current/pageSize/total），自动触发请求

### 4. CardForm

卡片表单组合组件：
- `CardForm` — Card + Form 包装，支持 `onValuesChange`、`onFinish`、`initialValue`
- `CardForm.Item` — Form.Item 封装，固定 `labelCol` 宽度 200px
- `CardForm.useForm()` — Ant Design `Form.useForm()` 代理

### 5. Text

文本省略组件，保留末尾指定数量的字符不截断，支持 tooltip 显示完整内容。

## 构建指令

```bash
pnpm -F @coding-flow/flow-pc-ui build
pnpm -F @coding-flow/flow-pc-ui test
```
