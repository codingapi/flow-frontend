---
"@coding-flow/flow-approval-presenter": patch
"@coding-flow/flow-pc-approval": patch
"@coding-flow/flow-mobile-approval": patch
"@coding-flow/flow-types": patch
---

fix: 退回候选节点改为后端按执行历史下发（issue #270）

- 详情响应新增 `backNodes`：只包含当前记录真实执行过的历史节点，按“最近优先”排序（例如停留在 C 节点时为 B、A），`nodes` 仍保留流程定义全量节点不受影响。
- PC / 移动端退回弹框改用 `backNodes`（`buildReturnNodeOptions`），不再从流程定义节点中截取，避免列出未走过、甚至位于当前节点之后的节点；`backNodes` 为空时不展示退回入口。
- 兼容旧版后端：缺少 `backNodes` 字段时回退到原有按定义顺序截取的逻辑。
