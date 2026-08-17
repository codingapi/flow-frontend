---
"@coding-flow/flow-mobile-approval": patch
---

修复移动端转办（transfer）动作渲染覆盖视图时未透传 props 导致选人弹框 `action` 丢失崩溃；并为 `triggerFrontEvent` 自定义按钮补齐审批操作拦截器（先执行 `interceptAction`，全部放行后才派发事件，与 PC 语义对齐）。