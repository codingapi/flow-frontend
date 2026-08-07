---
name: flow-core/groovy-formatter
module: flow-core
description: Groovy 脚本格式化与转换工具，提供脚本格式化、标记管理、元数据提取、return 表达式解析等能力
status: 已实现
scope: 前端
source: 项目自有
import: "@coding-flow/flow-core"
symbols:
  - GroovyFormatter
  - GroovyScriptConvertorUtil
  - CUSTOM_SCRIPT
  - SCRIPT_TITLE
  - SCRIPT_META
  - FormatOptions
content_hash: 2bc182dd9c5e9bc7c3126edcf03e8bf14a23e5ddac0de5aa67b6a4a690a59c50
---

## 解决什么问题

流程引擎中的节点策略、条件判断、操作人脚本等均使用 Groovy 脚本配置。前端需要：

- 格式化用户编辑的 Groovy 脚本（缩进、换行、操作符空格等）
- 标记自定义脚本与系统生成脚本的区别
- 提取脚本中的标题和元数据注释
- 解析脚本中的 return 表达式用于预览

## 如何使用

### 1. 格式化脚本

```typescript
import { GroovyFormatter } from "@coding-flow/flow-core";

// 基础格式化（缩进、换行、行尾空白清理）
const formatted = GroovyFormatter.formatScript(rawScript);

// 增强格式化（可配置缩进大小、操作符空格、注释格式化）
const enhanced = GroovyFormatter.formatGroovyScript(script, {
    indentSize: 4,
    addSpacesAroundOperators: true,
    formatComments: true,
});

// 压缩脚本（移除所有非必要空白）
const minified = GroovyFormatter.minifyScript(script);
```

### 2. 脚本标记管理

```typescript
import { GroovyScriptConvertorUtil, CUSTOM_SCRIPT } from "@coding-flow/flow-core";

// 判断是否为自定义脚本
const isCustom = GroovyScriptConvertorUtil.isCustomScript(script);

// 转换为自定义脚本（添加 @CUSTOM_SCRIPT 标记）
const customScript = GroovyScriptConvertorUtil.toCustomScript(script);
```

### 3. 标题和元数据

```typescript
// 获取/更新脚本标题
const title = GroovyScriptConvertorUtil.getScriptTitle(script);
const updated = GroovyScriptConvertorUtil.updateScriptTitle(script, '审批操作人脚本');

// 获取/更新脚本元数据
const meta = GroovyScriptConvertorUtil.getScriptMeta(script);
const updated = GroovyScriptConvertorUtil.updateScriptMeta(script, '{"type":"operator"}');
```

### 4. 表达式解析

```typescript
// 提取 return 表达式
const expr = GroovyScriptConvertorUtil.getReturnScript(script);
// "def run() { return user.name }" → "user.name"
```

## 使用实例

- flow-design 通过 `GroovyScriptConvertorUtil.formatScript`（内部委托 `GroovyFormatter.formatScript`）调用格式化能力，生成标准化脚本
- 条件脚本、操作人脚本、节点标题脚本均通过 `GroovyScriptConvertorUtil` 管理标记和元数据
