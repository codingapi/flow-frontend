---
"@coding-flow/flow-approval-presenter": patch
"@coding-flow/flow-pc-approval": patch
"@coding-flow/flow-mobile-approval": patch
---

fix: 合并审批查看非首条流程后提交表单数据为空（减签被 formData 必填校验拦截）

- 新增 `ActiveFormAction`（`@coding-flow/flow-approval-presenter`）：表单保存/校验动作跟随「当前查看或提交的记录」切换，表单实例未挂载时用记录初始数据兜底，不再提交空 `formData`。
- PC / 移动端审批表单视图改为只注册一个表单动作，并按待办记录记忆化表单实例；此前固定 key 只保留第一条记录的表单实例，查看第二条记录后 `getFieldsValue()` 返回 `{}`，请求被服务端 `Required field formData cannot be empty` 拒绝（减签等动作在合并审批中无法提交）。
- 合并审批查看单条流程时同步切换表单实例，详情接口尚未返回期间提交也不会落到上一条记录的表单上。
- 修复按待办记录缓存表单实例引入的崩溃：`createFormInstance` 内部调用 `Form.useForm()`，本质是 hook 工厂，每次渲染必须按相同顺序、相同次数调用；改为每次渲染都按待办记录调用一次并复用首次创建的实例，避免重渲染时 hook 数量变化抛 `Cannot read properties of undefined (reading 'length')`（`areHookInputsEqual`）。
