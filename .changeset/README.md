# Changesets 版本管理

本仓库使用 [Changesets](https://github.com/changesets/changesets) 统一管理所有 `@coding-flow/*` 包的版本。

## 核心概念

- **Fixed 模式**：所有 `@coding-flow/*` 包绑定为同一版本号，任何一个包变更都会同步 bump 全部包
- **自动 CHANGELOG**：每次发版自动生成各包的变更日志

## 日常使用流程

### 1. 开发过程中：记录变更

当你完成一个功能/修复后，在提交代码前运行：

```bash
pnpm changeset
```

交互式引导会让你：
- 选择本次变更影响的包（因为是 fixed 模式，选任意一个即可，其余自动同步）
- 选择变更级别：`patch`（修复）/ `minor`（新功能）/ `major`（破坏性变更）
- 填写变更描述（会写入 CHANGELOG）

执行后会在 `.changeset/` 目录下生成一个 markdown 文件，**请将其一起提交到 git**。

### 2. 准备发版：bump 版本

```bash
pnpm version-packages
```

此命令会：
- 消费所有已积累的 changeset 文件
- 统一 bump 所有 `@coding-flow/*` 包的版本号
- 为每个包生成/更新 `CHANGELOG.md`

### 3. 发布到 npm

```bash
pnpm release
```

此命令会先执行 `build`（构建所有包），然后执行 `changeset publish` 将新版本发布到 npm。

## CI 自动发版（GitHub Actions）

配置了 `.github/workflows/release.yml`：

1. 每次 push 到 `main` 时，如果有待发布的 changeset，会自动创建/更新一个 **"chore: release packages"** PR
2. 该 PR 包含版本号 bump 和 CHANGELOG 更新
3. 当你合并该 PR 后，CI 自动执行 build + publish

> 需要在 GitHub 仓库 Settings → Secrets 中配置 `NPM_TOKEN`

## 常用命令速查

| 命令 | 用途 |
|------|------|
| `pnpm changeset` | 记录一次变更（交互式） |
| `pnpm changeset status` | 查看当前待发布的变更 |
| `pnpm version-packages` | 消费 changesets，bump 版本号 |
| `pnpm release` | 构建 + 发布到 npm |
| `pnpm changeset pre enter beta` | 进入 beta 预发布模式 |
| `pnpm changeset pre exit` | 退出预发布模式 |
