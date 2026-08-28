# @coding-flow/flow-mobile-form

## 0.2.7

### Patch Changes

- 修复合并待办列表“发起人/提交人”字段映射颠倒：“发起人”改取 `createdOperatorName`、“提交人”取 `submitOperatorName`，与后端语义及 PC 端展示保持一致（codingapi/flow-frontend#57）

## 0.2.6

### Patch Changes

- 版本升级至 0.2.6（仅版本号升级，无功能变更）

## 0.2.5

### Patch Changes

- 版本升级至 0.2.5（配合子流程数据重置能力发布，本包无功能变更）

## 0.2.4

### Patch Changes

- @coding-flow/flow-core@0.2.4
- @coding-flow/flow-types@0.2.4

## 0.2.3

### Patch Changes

- 版本升级至 0.2.3（配合后端 springboot-framework 升级至 17.3.0，仅版本号升级，无功能变更）

## 0.2.2

### Patch Changes

- 版本升级至 0.2.2（仅版本号升级，无功能变更）

## 0.2.0

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-core@0.2.0
  - @coding-flow/flow-types@0.2.0

## 0.1.9

### Patch Changes

- @coding-flow/flow-core@0.1.9
- @coding-flow/flow-types@0.1.9

## 0.1.8

### Patch Changes

- @coding-flow/flow-core@0.1.8
- @coding-flow/flow-types@0.1.8

## 0.1.7

### Patch Changes

- @coding-flow/flow-core@0.1.7
- @coding-flow/flow-types@0.1.7

## 0.1.6

### Patch Changes

- 发布 0.1.6 补丁版本：与后端 flow-engine 0.1.6 版本对齐
- Updated dependencies
  - @coding-flow/flow-core@0.1.6
  - @coding-flow/flow-types@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-types@0.1.5
  - @coding-flow/flow-core@0.1.5

## 0.1.4

### Patch Changes

- @coding-flow/flow-core@0.1.4
- @coding-flow/flow-types@0.1.4

## 0.1.3

### Patch Changes

- - feat: 节点级隐藏审批意见能力（前端）
  - feat: 流程设计支持修改开始节点标题
  - feat: 流程更多参数增加最大嵌套深度配置（循环防护）
  - feat: 子流程视角主流程历史记录统一展示为已完成（对号）
  - fix: 优化子流程配置界面输入体验
- Updated dependencies
  - @coding-flow/flow-core@0.1.3
  - @coding-flow/flow-types@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-types@0.1.2
  - @coding-flow/flow-core@0.1.2

## 0.1.1

### Patch Changes

- 优化构建分包：所有包补充 sideEffects 声明（样式文件白名单），修复 barrel 导入导致 @ant-design/icons 等依赖被打进首屏 chunk 的问题；flow-icons 移除未使用的整包动态导入
- Updated dependencies
  - @coding-flow/flow-types@0.1.1
  - @coding-flow/flow-core@0.1.1
