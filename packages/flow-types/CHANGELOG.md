# @coding-flow/flow-types

## 0.1.9

### Patch Changes

- @coding-flow/flow-core@0.1.9

## 0.1.8

### Patch Changes

- @coding-flow/flow-core@0.1.8

## 0.1.7

### Patch Changes

- @coding-flow/flow-core@0.1.7

## 0.1.6

### Patch Changes

- 发布 0.1.6 补丁版本：与后端 flow-engine 0.1.6 版本对齐
- Updated dependencies
  - @coding-flow/flow-core@0.1.6

## 0.1.5

### Patch Changes

- **feat**: 审批节点支持操作人最大可选人数限制（maxOperatorCount）。节点配置可选操作人范围与最大数量后，审批挑选操作人时按限制自动适配单选 / 多选 / 文本输入，并校验数量不超限
- **fix**: 审批意见弹框与节点选择弹框重合时高度区分。审批意见框内容区增加 padding 撑高，避免被后续弹出的节点选择框完全遮挡

### Patch Changes

- @coding-flow/flow-core@0.1.5

## 0.1.4

### Patch Changes

- @coding-flow/flow-core@0.1.4

## 0.1.3

### Patch Changes

- - feat: 节点级隐藏审批意见能力（前端）
  - feat: 流程设计支持修改开始节点标题
  - feat: 流程更多参数增加最大嵌套深度配置（循环防护）
  - feat: 子流程视角主流程历史记录统一展示为已完成（对号）
  - fix: 优化子流程配置界面输入体验
- Updated dependencies
  - @coding-flow/flow-core@0.1.3

## 0.1.2

### Patch Changes

- 支持子流程配置与子流程记录展示：

  - 设计器支持子流程节点配置（子流程选择、结果变量配置），并优化异常触发策略配置交互
  - PC 端与移动端审批时间线支持展示子流程实例列表及执行摘要（总数/完成数/状态/时间）
  - 主流程记录来源统一以紧凑蓝色 Tag「主流程」标识展示，不改变节点主体布局
  - flow-types 补充子流程相关类型定义（ProcessNode.subProcess、parentProcessRecord 等）
  - @coding-flow/flow-core@0.1.2

## 0.1.1

### Patch Changes

- 优化构建分包：所有包补充 sideEffects 声明（样式文件白名单），修复 barrel 导入导致 @ant-design/icons 等依赖被打进首屏 chunk 的问题；flow-icons 移除未使用的整包动态导入
- Updated dependencies
  - @coding-flow/flow-core@0.1.1
