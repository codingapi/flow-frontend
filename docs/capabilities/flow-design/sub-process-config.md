---
name: flow-design/sub-process-config
module: flow-design
description: 子流程节点的多实例创建、结果判定脚本和异常节点跳转配置
status: 已实现
scope: 前端
source: 项目自有
symbols:
  - SubProcessStrategy
  - SubProcessView
  - SubProcessPresenter
  - SubProcessResultConfigModal
---

## 解决什么问题

为流程设计器中的子流程节点提供完整配置：

- 可视化添加多个子流程，分别配置目标流程、触发动作、发起人和表单数据。
- 保留“创建后并提交”选项，不提供等待开关，子流程节点始终等待结果。
- 提供结果判定 Groovy 脚本编辑器，默认在全部子流程结束时放行。
- 提供结果失败后的异常配置，子流程场景仅显示节点跳转。
- 提供“展示主流程记录”开关，默认关闭；开启后子流程参与人可以查看进入当前子流程前的主流程实际历史、审批人和审批意见。
- 兼容历史单子流程的 `@SCRIPT_META` 结构，编辑时自动转换为列表。

## 脚本输出

可视化配置会生成返回 `FlowCreateRequest` 列表的 Groovy 脚本：

```groovy
def run(request){
    return [
        request.toCreateRequest('child-a', 1, 'submit-a', '{...}'),
        request.toCreateRequest('child-b', 2, 'submit-b', '{...}')
    ]
}
```
