# @coding-flow/flow-approval-presenter

## 0.1.6

### Patch Changes

- 发布 0.1.6 补丁版本：与后端 flow-engine 0.1.6 版本对齐
- Updated dependencies
  - @coding-flow/flow-core@0.1.6
  - @coding-flow/flow-types@0.1.6

## 0.1.5

### Patch Changes

- **feat**: 审批节点支持操作人最大可选人数限制（maxOperatorCount）。节点配置可选操作人范围与最大数量后，审批挑选操作人时按限制自动适配单选 / 多选 / 文本输入，并校验数量不超限
- **fix**: 审批意见弹框与节点选择弹框重合时高度区分。审批意见框内容区增加 padding 撑高，避免被后续弹出的节点选择框完全遮挡

- Updated dependencies
  - @coding-flow/flow-types@0.1.5
  - @coding-flow/flow-core@0.1.5

## 0.1.4

### Patch Changes

- - fix: 审批记录操作人展示自动跳过(autoSkip)标记
  - fix: 统一审批弹框大小并支持拖拽调整宽高
  - fix: 修复表单字段保存时 crypto.randomUUID 不可用报错
  - fix: 审批节点字段只读权限不生效（READ 权限使用表单引擎标准 readOnly 属性）
  - chore: 升级 @coding-form/form-engine 至 0.0.19 支持字段级只读
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
