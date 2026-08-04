# @coding-flow/flow-mobile-approval

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
