# @coding-flow/flow-core

## 0.2.0

### Minor Changes

- feat: 接口请求超时时间支持通过 localStorage 动态配置，未配置时回退默认值（issue #211）

  - 新增 `resolveHttpTimeout()` / `FLOW_HTTP_TIMEOUT_KEY`，从 localStorage 读取超时配置
  - 各调用点（PC/移动端审批、设计器、示例应用）去除写死的 10000ms 硬编码

## 0.1.9

## 0.1.8

## 0.1.7

## 0.1.6

### Patch Changes

- 发布 0.1.6 补丁版本：与后端 flow-engine 0.1.6 版本对齐

## 0.1.5

## 0.1.4

## 0.1.3

### Patch Changes

- - feat: 节点级隐藏审批意见能力（前端）
  - feat: 流程设计支持修改开始节点标题
  - feat: 流程更多参数增加最大嵌套深度配置（循环防护）
  - feat: 子流程视角主流程历史记录统一展示为已完成（对号）
  - fix: 优化子流程配置界面输入体验

## 0.1.2

## 0.1.1

### Patch Changes

- 优化构建分包：所有包补充 sideEffects 声明（样式文件白名单），修复 barrel 导入导致 @ant-design/icons 等依赖被打进首屏 chunk 的问题；flow-icons 移除未使用的整包动态导入
