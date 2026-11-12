# @coding-flow/flow-mobile-approval

## 0.2.20

### Patch Changes

- 版本升级至 0.2.20（配合 flow-engine 后端版本升级，本包无功能变更）

## 0.2.17

### Patch Changes

- 修复审批按钮样式不生效：按 `display.style` 渲染背景色、边框色、圆角与边框大小，颜色自动补全 `#` 且不重复补全，样式数据非法时降级为默认样式（codingapi/flow-engine#244）
- 审批按钮名称优先取动作标题，与 PC 端保持一致
- @coding-flow/flow-approval-presenter@0.2.17
- @coding-flow/flow-icons@0.2.17
- @coding-flow/flow-mobile-form@0.2.17
- @coding-flow/flow-mobile-ui@0.2.17
- @coding-flow/flow-types@0.2.17

## 0.2.16

### Patch Changes

- 4d2d4d8: feat: 新增审批意见扩展点（codingapi/flow-engine#242、codingapi/flow-engine#243）

  - `AdvicePolicyProvider`：宿主可按动作类型配置意见是否隐藏、是否必填、默认意见、快捷模板与长度上限，未配置时沿用节点策略；隐藏意见时必填自动放宽，并支持以默认意见静默提交。
  - `APPROVAL_ADVICE_VIEW_KEY`：仅替换审批意见输入框（受控组件，保留提交、校验、签名、选人等默认逻辑）。
  - PC / 移动端的通过、驳回动作视图接入上述扩展点。
  - 示例：`apps/app-pc` 新增自定义意见输入框与策略配置示例。
  - 发起节点：意见必填时弹出意见框收集，修复「直接提交后服务端报 advice required」的问题。
  - 退回 / 转办 / 委派动作接入意见框：节点要求必填或宿主提供策略时展示。
  - 默认意见框与自定义意见视图统一按策略渲染，并新增 500 字符上限。
  - 流程记录视图：拒绝产生的节点标注「已拒绝」、拒绝终止后的结束节点标注「已终止」，不再与「已审批」混淆。

- Updated dependencies [4d2d4d8]
  - @coding-flow/flow-approval-presenter@0.2.16
  - @coding-flow/flow-core@0.2.16
  - @coding-flow/flow-icons@0.2.16
  - @coding-flow/flow-mobile-form@0.2.16
  - @coding-flow/flow-mobile-ui@0.2.16
  - @coding-flow/flow-types@0.2.16

## 0.2.15

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-core@0.2.15
  - @coding-flow/flow-approval-presenter@0.2.15
  - @coding-flow/flow-icons@0.2.15
  - @coding-flow/flow-mobile-form@0.2.15
  - @coding-flow/flow-mobile-ui@0.2.15
  - @coding-flow/flow-types@0.2.15

## 0.2.14

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-core@0.2.14
  - @coding-flow/flow-approval-presenter@0.2.14
  - @coding-flow/flow-icons@0.2.14
  - @coding-flow/flow-mobile-form@0.2.14
  - @coding-flow/flow-mobile-ui@0.2.14
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

- 版本升级至 0.2.6（仅版本号升级，无功能变更）

## 0.2.5

### Patch Changes

- 新增子流程数据重置接口 `/api/cmd/record/subProcess/reset`，接入审批上下文（FlowApprovalApi 实现），可经上下文获取该能力（issue #219）
- @coding-flow/flow-approval-presenter@0.2.5
- @coding-flow/flow-types@0.2.5

## 0.2.4

### Patch Changes

- @coding-flow/flow-approval-presenter@0.2.4
- @coding-flow/flow-core@0.2.4
- @coding-flow/flow-icons@0.2.4
- @coding-flow/flow-mobile-form@0.2.4
- @coding-flow/flow-mobile-ui@0.2.4
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
  - @coding-flow/flow-approval-presenter@0.2.0
  - @coding-flow/flow-icons@0.2.0
  - @coding-flow/flow-mobile-form@0.2.0
  - @coding-flow/flow-mobile-ui@0.2.0
  - @coding-flow/flow-types@0.2.0

## 0.1.9

### Patch Changes

- 789fa8c: 修复移动端转办（transfer）动作渲染覆盖视图时未透传 props 导致选人弹框 `action` 丢失崩溃；并为 `triggerFrontEvent` 自定义按钮补齐审批操作拦截器（先执行 `interceptAction`，全部放行后才派发事件，与 PC 语义对齐）。
  - @coding-flow/flow-approval-presenter@0.1.9
  - @coding-flow/flow-core@0.1.9
  - @coding-flow/flow-icons@0.1.9
  - @coding-flow/flow-mobile-form@0.1.9
  - @coding-flow/flow-mobile-ui@0.1.9
  - @coding-flow/flow-types@0.1.9

## 0.1.8

### Patch Changes

- 审批弹框标题/内容自定义能力（DialogContentProvider）+ 设计器按钮 ID 可复制
- Updated dependencies
  - @coding-flow/flow-approval-presenter@0.1.8
  - @coding-flow/flow-mobile-ui@0.1.8
  - @coding-flow/flow-core@0.1.8
  - @coding-flow/flow-icons@0.1.8
  - @coding-flow/flow-mobile-form@0.1.8
  - @coding-flow/flow-types@0.1.8

## 0.1.7

### Patch Changes

- @coding-flow/flow-approval-presenter@0.1.7
- @coding-flow/flow-core@0.1.7
- @coding-flow/flow-icons@0.1.7
- @coding-flow/flow-mobile-form@0.1.7
- @coding-flow/flow-mobile-ui@0.1.7
- @coding-flow/flow-types@0.1.7

## 0.1.6

### Patch Changes

- 发布 0.1.6 补丁版本：与后端 flow-engine 0.1.6 版本对齐
- Updated dependencies
  - @coding-flow/flow-approval-presenter@0.1.6
  - @coding-flow/flow-core@0.1.6
  - @coding-flow/flow-icons@0.1.6
  - @coding-flow/flow-types@0.1.6
  - @coding-flow/flow-mobile-form@0.1.6
  - @coding-flow/flow-mobile-ui@0.1.6

## 0.1.5

### Patch Changes

- **feat**: 审批节点支持操作人最大可选人数限制（maxOperatorCount）。节点配置可选操作人范围与最大数量后，审批挑选操作人时按限制自动适配单选 / 多选 / 文本输入，并校验数量不超限
- **fix**: 审批意见弹框与节点选择弹框重合时高度区分。审批意见框内容区增加 padding 撑高，避免被后续弹出的节点选择框完全遮挡

- Updated dependencies
  - @coding-flow/flow-types@0.1.5
  - @coding-flow/flow-approval-presenter@0.1.5
  - @coding-flow/flow-mobile-ui@0.1.5
  - @coding-flow/flow-mobile-form@0.1.5
  - @coding-flow/flow-core@0.1.5
  - @coding-flow/flow-icons@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies
  - @coding-flow/flow-approval-presenter@0.1.4
  - @coding-flow/flow-core@0.1.4
  - @coding-flow/flow-icons@0.1.4
  - @coding-flow/flow-mobile-form@0.1.4
  - @coding-flow/flow-mobile-ui@0.1.4
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
  - @coding-flow/flow-icons@0.1.3
  - @coding-flow/flow-approval-presenter@0.1.3
  - @coding-flow/flow-mobile-ui@0.1.3
  - @coding-flow/flow-mobile-form@0.1.3

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
