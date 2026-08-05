---
name: flow-approval/sub-process-record
module: flow-approval
description: PC 与移动端审批时间线中的子流程聚合状态、完成进度和实例明细展示
status: 已实现
scope: 前端
source: 项目自有
symbols:
  - ProcessNodeSubProcess
  - getSubProcessSummary
  - getSubProcessInstanceTitle
---

## 解决什么问题

在主流程审批时间线中展示真实的子流程节点执行状态，并区分普通人工审批节点：

- 等待结果时展示“处理中”和已完成数量。
- 自定义结果脚本放行后展示“结果已确认”，支持部分实例完成时提前放行。
- 结果判定失败时展示异常状态，不再降级成“未执行”。
- 展示每个子流程实例的流程 ID 以及处理中、已完成、已终止状态。

## 数据结构

`ProcessNode.subProcess` 是可选字段，仅实际执行过的子流程节点返回，包含聚合记录 ID、总数、完成数、状态、时间和实例列表。未来尚未执行的子流程节点仍按普通 `PENDING` 节点展示。

完整审批记录和表单数据不嵌入时间线响应，可使用实例的 `startRecordId`、`finishRecordId` 或 `processId` 按需查询。

## 平台适配

- PC 端使用 Ant Design Timeline/Tag 展示状态和实例摘要。
- 移动端使用 Ant Design Mobile Steps 展示相同语义。
- 两端统一将 `ERROR` 映射为异常视觉状态。
