# @coding-flow/flow-mobile-ui

移动端基础 UI 组件库，提供基于 Ant Design Mobile 封装的通用原子组件（Popconfirm、PopupModal、TextIcon）。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库 |
| antd-mobile | ^5.42.3 | Ant Design Mobile 组件库 |
| react / react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-mobile/flow-mobile-ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # 入口：导出 3 个组件
    └── components/
        ├── popconfirm/index.tsx    # 确认操作表
        ├── popup-modal/index.tsx   # 底部弹窗
        └── text-icon/index.tsx     # 文字头像
```

## 对外入口

入口文件 `src/index.ts`，导出以下 3 个组件：

| 组件 | 类型 | 说明 |
|------|------|------|
| `Popconfirm` | `React.FC<PopconfirmProps>` | 确认操作表，基于 antd-mobile `ActionSheet`，点击子元素触发 |
| `PopupModal` | `React.FC<PopupModalProps>` | 底部弹窗，基于 antd-mobile `Popup`，三栏布局（取消/标题/确定） |
| `TextIcon` | `React.FC<TextIconProps>` | 文字头像，圆形蓝色背景 + 取文字前两个字符 |

## 核心功能

### 1. Popconfirm

确认操作弹窗。包裹子元素，点击后弹出 `ActionSheet` 显示确认选项。
- Props：`title`（提示文本）、`onConfirm`（确认回调）、`children`（触发元素）

### 2. PopupModal

底部弹窗组件。40vh 高度的底部弹出面板，顶部三栏布局（取消/标题/确定）。
- Props：`open`、`onClose`、`onOk`、`title`、`children`

### 3. TextIcon

文字头像组件。40px 圆形蓝色背景，显示文字前两个字符，空值显示"待"。
- Props：`text`

## 构建指令

```bash
pnpm -F @coding-flow/flow-mobile-ui build
pnpm -F @coding-flow/flow-mobile-ui test
```
