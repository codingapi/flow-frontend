# 集成手册（Integration）

> 面向集成方的使用指南。介绍如何将 Flow Frontend 作为 SDK 集成到业务项目中，以及如何定制框架能力。

## 指南列表

| 文档 | 说明 | 主要内容 |
|------|------|----------|
| [插件定制机制](./plugin-customization.md) | 全部扩展点与插件体系 | 内核层：ViewBindPlugin / EventBus / Presenter / HttpClient / FlowMessageRegistry<br>审批层：FlowApprovalApi / 8 个子视图插件 / ActionInterceptor / DialogContentProvider / AdvicePolicyProvider / 合并审批 / Mock<br>PC/移动层：布局与动作 key / ActionFactory / 样式<br>设计器层：FlowNodeRegistry / 视图插件 / 策略 |
| [消息提示定制](./message-customization.md) | 自定义全部消息文案 | 审批动作 / 流程设计器 / 系统消息 |
