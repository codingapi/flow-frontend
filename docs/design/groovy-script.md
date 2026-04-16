# Groovy Script 脚本设计规范

Flow Engine 工作流引擎支持使用 Groovy 脚本进行流程配置和业务逻辑扩展。本文档介绍脚本的编写规范和使用方式。

## 脚本基础结构

### 脚本实例

```groovy
def run(request){
    return "Hello, ${request.name}!"
}
```

### 脚本规范

- `request` 对象：根据脚本的不同，传递的 request 对象也不同
- `return` 语句：根据脚本的不同，对应返回的对象也不同

## 开发规范

为了让脚本可以更好的呈现和使用，脚本的配置分为两种模式：一种是可视化配置模式，一种是代码配置模式。

### 代码配置模式

代码配置模式的脚本中，将会通过注释的方式添加一行 `@CUSTOM_SCRIPT`，来标识这是一个自定义脚本，这样在编辑器中就会以代码的形式展示出来。

```groovy
// @CUSTOM_SCRIPT
def run(request){
    return "Hello, ${request.name}!"
}
```

### 可视化配置模式

可视化配置模式的脚本中，没有 `@CUSTOM_SCRIPT` 的注释标识，这样在编辑器中就会以可视化的形式展示出来。

```groovy
def run(request){
    return "Hello, ${request.name}!"
}
```

## 脚本注释标记

### 脚本展示标题

为了让脚本在展示时可以更好的展示脚本的作用，所以在脚本中支持通过 `@SCRIPT_TITLE` 的注释来标识脚本的展示标题，这样在编辑器中就会以这个标题来展示脚本。

```groovy
// @SCRIPT_TITLE 这是一个示例脚本
def run(request){
    return "Hello, ${request.name}!"
}
```

上述的脚本在编辑器中就会以"这是一个示例脚本"来展示，而不是以代码的方式来展示。

### 脚本元数据

在可视化呈现的过程中，界面不仅要能够解析脚本的标题，还需要可以正常的在可视化界面上呈现内容，为此通过 `@SCRIPT_META` 来标注界面展示的 meta 数据格式。

meta 的数据是 json 格式的数据。

```groovy
// @SCRIPT_META {name:"name"}
def run(request){
    return "Hello, ${request.name}!"
}
```

## 脚本类型枚举

```typescript
export enum ScriptType {
    /** 标题脚本 */
    TITLE = 'TITLE',
    /** 条件脚本 */
    CONDITION = 'CONDITION',
    /** 人员加载脚本 */
    OPERATOR_LOAD = 'OPERATOR_LOAD',
    /** 流程创建人脚本 */
    OPERATOR_CREATE = 'OPERATOR_LOAD',
    /** 异常触发脚本 */
    ERROR_TRIGGER = 'ERROR_TRIGGER',
    /** 触发节点脚本 */
    TRIGGER = 'TRIGGER',
    /** 路由节点脚本 */
    ROUTER = 'ROUTER',
    /** 子流程节点脚本 */
    SUB_PROCESS = 'SUB_PROCESS',
}
```

## 变量映射

Groovy 变量映射用于前后端变量映射统一：

```typescript
export interface GroovyVariableMapping {
    /** 中文显示名称：如"当前操作人" */
    label: string;

    /** 变量展示名：如"request.getOperatorName()" */
    value: string;

    /** 数据类型 */
    type: DataType;

    /** Groovy表达式：如"${当前操作人}" */
    expression: string;

    /** 分组标签：如"操作人相关" */
    tag: string;

    /** 排序序号 */
    order: number;
}
```

### 变量分组标签枚举

```typescript
export enum VariableTag {
    OPERATOR = '操作人相关',
    WORKFLOW = '流程相关',
    FORM_FIELD = '表单字段',
}
```

## 默认脚本示例

### 默认发起人范围设置脚本（任意人员）

```groovy
// @SCRIPT_TITLE 任意人员
// @SCRIPT_META {"type":"any"}
def run(request){
    return true;
}
```

### 默认操作人配置脚本（流程创建者）

```groovy
// @SCRIPT_TITLE 流程创建者
// @SCRIPT_META {"type":"creator"}
def run(request){
    return [request.getCreatedOperatorId()]
}
```

### 发起人设定操作人脚本

```groovy
// @SCRIPT_TITLE 发起人设定
// @SCRIPT_META {"type":"initiator_select"}
def run(request){
    return []
}
```

### 审批人设定操作人脚本

```groovy
// @SCRIPT_TITLE 审批人设定
// @SCRIPT_META {"type":"approver_select"}
def run(request){
    return []
}
```

### 默认节点标题配置脚本

```groovy
// @SCRIPT_TITLE 您有一条待办消息
def run(request){
    return "您有一条待办消息"
}
```

### 默认异常触发脚本（回退至开始节点）

```groovy
// @SCRIPT_TITLE 回退至开始节点
// @SCRIPT_META {"type":"node","node":"START"}
def run(request){
    return request.getStartNode().getId();
}
```

### 默认条件脚本（允许执行）

```groovy
// @SCRIPT_TITLE 默认条件（允许执行）
def run(request){
    return true;
}
```

### 默认路由脚本（发起节点）

```groovy
// @SCRIPT_TITLE 发起节点
// @SCRIPT_META {"node":"START"}
def run(request){
    return request.getStartNode().getId();
}
```

### 默认触发脚本（打印触发日志）

```groovy
// @SCRIPT_TITLE 示例触发节点（打印触发日志）
def run(request){
    print('hello trigger node.\n');
}
```

### 自定义脚本（默认返回通过）

```groovy
// @SCRIPT_TITLE 默认条件 触发通过
// @SCRIPT_META {"trigger":"PASS"}
def run(request){
    return 'PASS';
}
```

### 子流程脚本（创建当前流程）

```groovy
// @SCRIPT_TITLE 创建当前流程
def run(request){
    return request.toCreateRequest()
}
```

## 脚本工具类

系统提供了 `GroovyScriptConvertorUtil` 工具类用于脚本处理：

### 判断是否自定义脚本

```typescript
GroovyScriptConvertorUtil.isCustomScript(script: string): boolean
```

### 转换为自定义脚本

```typescript
GroovyScriptConvertorUtil.toCustomScript(script: string): string
```

### 获取脚本标题

```typescript
GroovyScriptConvertorUtil.getScriptTitle(script: string): string
```

### 更新脚本标题

```typescript
GroovyScriptConvertorUtil.updateScriptTitle(script: string, title: string): string
```

### 获取脚本元数据

```typescript
GroovyScriptConvertorUtil.getScriptMeta(script: string): string
```

### 更新脚本元数据

```typescript
GroovyScriptConvertorUtil.updateScriptMeta(script: string, meta: string): string
```

### 提取脚本返回表达式

```typescript
GroovyScriptConvertorUtil.getReturnScript(script: string): string
```

### 格式化脚本

```typescript
GroovyScriptConvertorUtil.formatScript(script: string): string
```

## 脚本使用场景

### 节点标题脚本

用于动态生成流程节点的显示标题：

```groovy
// @SCRIPT_TITLE 您有一条待办消息
def run(request){
    return "你有一条" + request.getOperatorName() + "的" + request.getWorkflowTitle() + "待办消息"
}
```

### 条件脚本

用于判断流程流转条件：

```groovy
// @SCRIPT_TITLE 默认条件（允许执行）
def run(request){
    return true;
}
```

### 人员加载脚本

用于动态指定流程处理人：

```groovy
// @SCRIPT_TITLE 流程创建者
def run(request){
    return [request.getCreatedOperatorId()]
}
```

### 异常处理脚本

用于定义流程异常时的处理逻辑：

```groovy
// @SCRIPT_TITLE 回退至开始节点
def run(request){
    return request.getStartNode().getId();
}
```

### 触发节点脚本

用于定义触发节点的执行逻辑：

```groovy
// @SCRIPT_TITLE 示例触发节点
def run(request){
    print('hello trigger node.\n');
}
```

### 路由脚本

用于定义路由节点的流转目标：

```groovy
// @SCRIPT_TITLE 发起节点
def run(request){
    return request.getStartNode().getId();
}
```

### 自定义动作脚本

用于定义自定义按钮触发的业务逻辑：

```groovy
// @CUSTOM_SCRIPT
// @SCRIPT_TITLE 默认条件 触发通过
// @SCRIPT_META {"trigger":"PASS"}
def run(request){
    return 'PASS';
}
```

## 注释标记说明

| 标记 | 说明 | 示例 |
|------|------|------|
| `@CUSTOM_SCRIPT` | 标识为自定义脚本，编辑器以代码形式展示 | `// @CUSTOM_SCRIPT` |
| `@SCRIPT_TITLE` | 脚本展示标题 | `// @SCRIPT_TITLE 这是一个标题` |
| `@SCRIPT_META` | 脚本元数据，JSON 格式 | `// @SCRIPT_META {name:"name"}` |
