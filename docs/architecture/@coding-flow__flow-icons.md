# @coding-flow/flow-icons

流程引擎图标库，提供统一的 Icon 组件，通过名称字符串动态加载 Ant Design Icons。

## 关联关系

> 以下关系由 `pnpm list` / `pnpm why` 指令结果生成，非人工推断。

### 我被哪些模块依赖

| 依赖方 | 路径 |
|--------|------|
| @coding-flow/flow-design | packages/flow-design |
| @coding-flow/flow-pc-approval | packages/flow-pc/flow-pc-approval |
| @coding-flow/flow-mobile-approval | packages/flow-mobile/flow-mobile-approval |
| @flow-example/app-pc | apps/app-pc |
| @flow-example/app-mobile | apps/app-mobile |

### 我依赖哪些模块

| 依赖 | 版本 | 说明 |
|------|------|------|
| @coding-flow/flow-core | workspace:* | 基础框架库 |
| @ant-design/icons | ~6.1.0 | Ant Design 图标库（外部依赖） |
| react | >=18（peer） | |
| react-dom | >=18（peer） | |

## 项目结构

```
packages/flow-icons/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # 入口：re-export icons 模块
    ├── type.d.ts             # 静态资源类型声明（svg/png/jpg/less）
    └── icons/
        └── index.tsx         # Icon 组件实现
```

## 对外入口

入口文件 `src/index.ts`，通过 `src/icons/index.tsx` 导出：

| 导出内容 | 类型 | 说明 |
|----------|------|------|
| `Icon` | `React.FC<IconProps>` | 按名称动态加载并渲染 Ant Design 图标 |

`IconProps` 接口：
- `type: string` — 图标名称（对应 `@ant-design/icons` 导出的组件名，如 `'UserOutlined'`）
- `style?: CSSProperties` — 可选样式

## 核心功能

### 1. Icon 组件

通过 `type` 属性传入图标名称字符串，动态 import `@ant-design/icons` 模块并按名称查找对应图标组件。
- 加载中显示 `Loading...` 占位文本
- 图标未找到时返回 `null` 并输出 console 警告
- 组件卸载时取消加载（mounted 标记）

## 构建指令

```bash
pnpm -F @coding-flow/flow-icons build
pnpm -F @coding-flow/flow-icons test
```
