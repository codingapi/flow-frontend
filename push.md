# 发版手册（Changesets）

> 面向维护者。说明如何通过 [Changesets](https://github.com/changesets/changesets) 发布 `@coding-flow/*` 系列包的 **patch（小版本）/ minor（中版本）/ major（大版本）**。

## 一、标准流程总览

```
开发改动
  │
  ├─ ① pnpm changeset            # 记录本次变更（选级别 + 写描述），生成 .changeset/*.md
  │
  ├─ ② git add + commit          # 代码 与 changeset 文件 一起提交
  │
  ├─ ③ push / 合并到 main         # changeset 文件必须进入 main
  │
  └─ ④ 发版
       ├─ 方式 A（推荐）：CI 自动 —— push 到 main 后由 GitHub Actions 发版
       └─ 方式 B（手动）：pnpm push —— 本地 version + build + publish，随后补提交版本号
```

> 关键点：**`changeset` 必须在提交代码的同一批（或之前）执行**，生成的 `.changeset/*.md` 要随代码一起进 git。发版动作（version + publish）发生在变更已合入 main 之后。

---

## 二、三种版本级别怎么选

| 级别 | 命令选择 | 版本示例（从 0.1.0） | 适用场景 |
|------|----------|---------------------|----------|
| **patch 小版本** | `patch` | 0.1.0 → **0.1.1** | bug 修复、性能优化、文档/重构等，不改变对外 API |
| **minor 中版本** | `minor` | 0.1.0 → **0.2.0** | 新增功能、新增 API，向后兼容 |
| **major 大版本** | `major` | 0.1.0 → **1.0.0** | 破坏性变更（删除/改名 API、行为不兼容） |

> 本仓库为 **Fixed 模式**（`config.json` 的 `fixed: [["@coding-flow/*"]]`）：11 个 `@coding-flow/*` 包绑定同一版本号，**任一包升级，全部同步升到同一版本**。
> `@flow-example/*`（app-pc / app-mobile）在 `ignore` 列表中，不参与发版。

---

## 三、第 ① 步：记录变更 `pnpm changeset`

```bash
pnpm changeset
```

进入交互向导，依次回答：

1. **选择本次变更影响的包**：空格选中 / 取消，回车确认。Fixed 模式下选任意一个 `@coding-flow/*` 包即可，发版时全组自动同步。
2. **哪些包需要 major（大版本）？**：需要就选中，否则直接回车跳过。
3. **哪些包需要 minor（中版本）？**：需要就选中，否则直接回车跳过。
4. **未被选为 major/minor 的包自动按 patch（小版本）处理。**
5. **填写变更描述**：这段文字会写进各包的 `CHANGELOG.md`，请写清楚改了什么。

对应三种级别的操作差异：

| 目标级别 | 交互操作 |
|----------|----------|
| **patch** | 选包 → major 提问直接回车 → minor 提问直接回车 → 写描述 |
| **minor** | 选包 → major 提问直接回车 → **minor 提问选中该包** → 写描述 |
| **major** | 选包 → **major 提问选中该包** → 写描述 |

执行后生成类似 `.changeset/clever-pandas-dance.md` 的文件：

```md
---
"@coding-flow/flow-core": patch
---

修复了 XXX 问题
```

> ⚠️ 这个文件**必须提交进 git**。

### 非交互方式（TTY 不可用时）

直接在 `.changeset/` 下手写一个 `.md` 文件即可，格式如上。文件名任意（`config.json`、`README.md` 除外）。例如全部升 patch：

```md
---
"@coding-flow/flow-core": patch
"@coding-flow/flow-design": patch
"@coding-flow/flow-types": patch
---

首屏分包优化
```

> Fixed 模式下列出组内任意成员即可带动全组，这里多列几个只是便于阅读。

---

## 四、第 ② ③ 步：提交并合入 main

```bash
# 代码与 changeset 文件一起提交
git add -A
git commit -m "feat(xxx): 你的改动描述"
git push origin <你的分支>

# 通过 PR 合并到 main（changeset 文件随之进入 main）
```

---

## 五、第 ④ 步：发版

### 方式 A：CI 自动发版（推荐）

配置在 `.github/workflows/release.yml`：

1. 任何包含 changeset 的改动 push 到 `main` 后，CI 自动创建/更新一个 **"chore: release packages"** PR（内含版本号 bump + CHANGELOG 更新）。
2. 你审阅并**合并该 PR**。
3. 合并后 CI 自动执行 `pnpm push`（build + publish）发布到 npm。

> 前提：GitHub 仓库 Settings → Secrets 已配置 `NPM_TOKEN`。

### 方式 B：本地手动发版 `pnpm push`

适合没有 CI token、或需要立即发布的场景。**先确认在 main 分支且已拉取最新**：

```bash
git switch main && git pull origin main

# 预检：确认 changeset 能识别到待升级的包和版本
pnpm changeset status

# 一条命令：version（消费 changeset → 升版本 + 生成 CHANGELOG）→ build → publish
pnpm push

# version 不会自动提交（config commit:false），发布成功后补一个版本提交
git add -A
git commit -m "chore: release <新版本号>"
git push origin main

# 验证发布结果
npm info @coding-flow/flow-core version
```

---

## 六、常用命令速查

| 命令 | 用途 |
|------|------|
| `pnpm changeset` | 记录一次变更（交互式选包 + 选级别 + 写描述） |
| `pnpm changeset status` | 查看当前待发布的变更与目标版本 |
| `pnpm version-packages` | 仅消费 changesets、bump 版本号（不发布） |
| `pnpm push` / `pnpm release` | version + build + publish 一条龙 |
| `pnpm changeset pre enter beta` | 进入 beta 预发布模式（版本如 0.2.0-beta.0） |
| `pnpm changeset pre exit` | 退出预发布模式 |
| `npm info @coding-flow/<pkg> version` | 查询 npm 上已发布的版本 |

---

## 七、注意事项 / FAQ

- **changeset 文件丢了怎么办？** 没提交进 git 的 changeset 文件不会被 CI/其他机器看到。务必随代码提交；丢失则重新 `pnpm changeset`。
- **为什么 `pnpm push` 没有升版本？** `changeset version` 只消费 `.changeset/` 里的变更文件。如果没有任何 changeset 文件，版本原地不动、publish 全部跳过（提示 `already published`）。先执行第 ① 步。
- **publish 会不会被 git 状态拦截？** `baseBranch` 为 `main`，且 `.npmrc` 已设 `git-checks=false`，不会被拦。但建议在干净的工作区、main 分支上发布。
- **`pnpm push` 中途失败怎么办？** `changeset version` 可能已改动部分 `package.json`/CHANGELOG。用 `git status` 查看，必要时 `git checkout -- packages` 回退后重跑。
- **预发布（beta/alpha）怎么发？** `pnpm changeset pre enter beta` → 正常记录 changeset → `pnpm push`，版本会是 `x.y.z-beta.N`；结束后 `pnpm changeset pre exit`。
