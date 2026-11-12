---
"@coding-flow/flow-types": patch
"@coding-flow/flow-core": patch
"@coding-flow/flow-approval-presenter": patch
"@coding-flow/flow-pc-approval": patch
"@coding-flow/flow-mobile-approval": patch
"@coding-flow/flow-design": patch
---

feat: 支持减签动作 REDUCE_AUDIT（codingapi/flow-engine#266、codingapi/flow-frontend#72）

- `ActionType` 增加 `REDUCE_AUDIT`，`actionOptions` 增加「减签」，设计器可配置减签动作。
- PC / 移动端新增减签按钮与提交逻辑，通过 `advice.forwardOperatorIds` 传递被减签人；与加签同构，支持自定义弹框内容与事件总线触发。
- 新增 `ReduceAuditViewPlugin`（`ReduceAuditViewPluginKey`）用于替换减签人员选择视图；默认实现为占位，集成方应列出当前节点的待审批人（不含当前审批人）。
- 设计器新增减签动作配置：仅「减签人员范围」（script），不提供「最大可选人数」。
- `FlowMessageKey.APPROVAL_REDUCE_AUDIT` 增加默认提示文案。
