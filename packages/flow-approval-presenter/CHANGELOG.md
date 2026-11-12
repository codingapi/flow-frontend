# @coding-flow/flow-approval-presenter

## 0.2.20

### Patch Changes

- 版本升级至 0.2.20（配合 flow-engine 后端版本升级，本包无功能变更）

## 0.2.17

### Patch Changes

- @coding-flow/flow-types@0.2.17

## 0.2.16

### Patch Changes

- 4d2d4d8: feat: 新增审批意见扩展点（codingapi/flow-engine#242、codingapi/flow-engine#243）

  - `AdvicePolicyProvider`：宿主可按动作类型配置意见是否隐藏、是否必填、默认意见、快捷模板与长度上限，未配置时沿用节点策略；隐藏意见时必填自动放宽，并支持以默认意见静默提交。
  - `APPROVAL_ADVICE_VIEW_KEY`：仅替换审批意见输入框（受控组件，保留提交、校验、签名、选人等默认逻辑）。
  - PC / 移动端的通过、驳回动作视图接入上述扩展点。
  - 示例：`apps/app-pc` 新增自定义意见输入框与策略配置示例。
  - 新增 `isAdviceVisible` / `withDefaultAdvice` 纯函数，统一意见框展示规则与默认意见补齐逻辑。
  - `AdvicePolicyContext.flow` 可读取 `workCode` / `workTitle`，用于按流程区分模板与策略。
  - 默认意见长度上限 500 字符（`DEFAULT_ADVICE_MAX_LENGTH`），与后端校验保持一致。
  - @coding-flow/flow-core@0.2.16
  - @coding-flow/flow-types@0.2.16

## 0.2.15

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-core@0.2.15
  - @coding-flow/flow-types@0.2.15

## 0.2.14

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-core@0.2.14
  - @coding-flow/flow-types@0.2.14

## 0.2.13

### Patch Changes

- 版本升级至 0.2.13（配合 flow-design 拒绝脚本 key 存储修复发布，本包无功能变更）

## 0.2.11

### Patch Changes

- 版本升级至 0.2.11（配合 flow-design 路由节点摆放限制取消发布，本包无功能变更）

## 0.2.10

### Patch Changes

- 版本升级至 0.2.10（配合 flow-design 路由节点摆放限制取消发布，本包无功能变更）

## 0.2.9

### Patch Changes

- 版本升级至 0.2.9（配合 flow-design 路由节点摆放限制取消发布，本包无功能变更）

## 0.2.8

### Patch Changes

- 版本升级至 0.2.8（配合 flow-engine 后端 issue #226 相同人员自动通过记录留痕修复发布，本包无功能变更）

## 0.2.7

### Patch Changes

- 版本升级至 0.2.7（配合 flow-mobile-form 合并待办字段映射修复发布，本包无功能变更）

## 0.2.6

### Patch Changes

- 审批上下文可直达子流程重置能力：ApprovalPresenter/FlowActionPresenter 暴露 `resetSubProcess`（codingapi/flow-engine#219）

- 版本升级至 0.2.6（仅版本号升级，无功能变更）

## 0.2.5

### Patch Changes

- FlowApprovalApi 审批接口新增 `resetSubProcess` 子流程数据重置方法（独立接口，非审批动作）（issue #219）

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

- 审批弹框标题/内容自定义能力（DialogContentProvider）+ 设计器按钮 ID 可复制
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
