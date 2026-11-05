---
"@coding-flow/flow-approval-presenter": patch
"@coding-flow/flow-pc-approval": patch
"@coding-flow/flow-mobile-approval": patch
---

feat: 新增审批意见扩展点（codingapi/flow-engine#242、codingapi/flow-engine#243）

- `AdvicePolicyProvider`：宿主可按动作类型配置意见是否隐藏、是否必填、默认意见、快捷模板与长度上限，未配置时沿用节点策略；隐藏意见时必填自动放宽，并支持以默认意见静默提交。
- `APPROVAL_ADVICE_VIEW_KEY`：仅替换审批意见输入框（受控组件，保留提交、校验、签名、选人等默认逻辑）。
- PC / 移动端的通过、驳回动作视图接入上述扩展点。
- 示例：`apps/app-pc` 新增自定义意见输入框与策略配置示例。
