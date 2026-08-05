# @coding-flow/flow-mobile-approval

## 0.1.2

### Patch Changes

- 支持子流程配置与子流程记录展示：

  - 设计器支持子流程节点配置（子流程选择、结果变量配置），并优化异常触发策略配置交互
  - PC 端与移动端审批时间线支持展示子流程实例列表及执行摘要（总数/完成数/状态/时间）
  - 主流程记录来源统一以紧凑蓝色 Tag「主流程」标识展示，不改变节点主体布局
  - flow-types 补充子流程相关类型定义（ProcessNode.subProcess、parentProcessRecord 等）

- Updated dependencies
  - @coding-flow/flow-types@0.1.2
  - @coding-flow/flow-approval-presenter@0.1.2
  - @coding-flow/flow-mobile-form@0.1.2
  - @coding-flow/flow-core@0.1.2
  - @coding-flow/flow-icons@0.1.2
  - @coding-flow/flow-mobile-ui@0.1.2

## 0.1.1

### Patch Changes

- 优化构建分包：所有包补充 sideEffects 声明（样式文件白名单），修复 barrel 导入导致 @ant-design/icons 等依赖被打进首屏 chunk 的问题；flow-icons 移除未使用的整包动态导入
- Updated dependencies
  - @coding-flow/flow-mobile-form@0.1.1
  - @coding-flow/flow-mobile-ui@0.1.1
  - @coding-flow/flow-approval-presenter@0.1.1
  - @coding-flow/flow-icons@0.1.1
  - @coding-flow/flow-types@0.1.1
  - @coding-flow/flow-core@0.1.1
