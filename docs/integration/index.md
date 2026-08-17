# 集成手册（Integration）

> 面向集成方的使用指南。介绍如何将 Flow Frontend 作为 SDK 集成到业务项目中，以及如何定制框架能力。

## 指南列表

| 文档 | 说明 |
|------|------|
| [插件定制机制](./plugin-customization.md) | 框架的全部扩展点与插件体系：内核层（ViewBindPlugin / EventBus / Presenter / HttpClient / FlowMessageRegistry / GroovyScriptConvertorUtil）、审批领域层（FlowApprovalApi / 子视图插件 / ActionInterceptor / DialogContentProvider / FormActionContext / maxOperatorCount 选人数限制 / Mock 模式）、PC/移动审批层（布局与动作 key / ActionFactory / 样式定制）、流程设计器层（FlowNodeRegistry / 设计器视图插件 / 策略机制） |
| [消息提示定制](./message-customization.md) | 如何自定义框架中所有消息提示的文案，包括审批动作、流程设计器、系统消息等 |
