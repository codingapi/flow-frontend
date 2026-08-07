# 消息提示定制

> 本文面向集成方，指导如何自定义框架中的消息提示文案。

## 背景

Flow Frontend 框架内置了大量消息提示（如"操作成功""流程已保存""脚本编译成功"等），统一由 `FlowMessageRegistry` 管理。所有提示文案均可在 App 层面自由定制，无需修改框架源码。

## 快速开始

只需在 App 初始化时，向 `FlowMessageRegistry` 注册你需要的消息模板即可。**不做任何注册则沿用框架默认文案**，对现有行为零影响。

```typescript
import { FlowMessageRegistry, FlowMessageKey } from "@coding-flow/flow-core";

// 在 App 入口文件（如 main.tsx）中
const registry = FlowMessageRegistry.getInstance();

// 批量覆盖多条消息
registry.registerAll({
  [FlowMessageKey.APPROVAL_PASS]: '已通过',
  [FlowMessageKey.APPROVAL_REJECT]: '已驳回',
  [FlowMessageKey.DESIGN_SAVE]: '流程设计已保存',
});
```

## 模板类型

### 1. 静态字符串

最简单的形式，直接覆盖文案。

```typescript
registry.register(FlowMessageKey.APPROVAL_PASS, '审批已通过');
registry.register(FlowMessageKey.APPROVAL_REVOKE, '流程已成功撤回');
```

### 2. 字符串模板（`{placeholder}`）

当消息里需要嵌入运行时变量时，用 `{变量名}` 占位，调用时传入对应的值。

```typescript
// 注册
registry.register(FlowMessageKey.DESIGN_DOWNLOAD_SUCCESS, '流程已导出为 {format} 文件');

// 框架调用时自动替换 → "流程已导出为 JSON 文件"
```

### 3. 函数模板

当消息内容需要根据上下文做条件判断时，使用函数模板。函数接收框架传入的上下文数据，返回最终文案。

```typescript
registry.register(FlowMessageKey.APPROVAL_SAVE, (data) => {
  if (data.isStartNode) {
    return `流程 ${data.flowName} 已发起`;
  }
  return `流程 ${data.flowName} 数据已更新`;
});
```

## 常用场景

### 场景一：统一修改"操作成功"类提示

框架中 pass / reject / delegate / transfer / return / add-audit / custom 等动作默认都显示"操作成功"。你可以按需区分：

```typescript
registry.registerAll({
  [FlowMessageKey.APPROVAL_PASS]: '审批已通过',
  [FlowMessageKey.APPROVAL_REJECT]: '审批已驳回',
  [FlowMessageKey.APPROVAL_DELEGATE]: '已委托给 {actionName}',
  [FlowMessageKey.APPROVAL_TRANSFER]: '已转交',
  [FlowMessageKey.APPROVAL_RETURN]: '已退回上一节点',
  [FlowMessageKey.APPROVAL_ADD_AUDIT]: '已加签',
  [FlowMessageKey.APPROVAL_REVOKE]: '流程已撤回',
  [FlowMessageKey.APPROVAL_URGE]: '催办已发送',
});
```

### 场景二：保存提示区分发起节点与审批节点

`APPROVAL_SAVE` 的上下文数据中包含 `isStartNode` 字段，可直接用于分流：

```typescript
registry.register(FlowMessageKey.APPROVAL_SAVE, (data) =>
  data.isStartNode
    ? '流程已发起，请等待审批'
    : '草稿已保存'
);
```

### 场景三：在提示中加入流程名称和操作人

所有审批动作的上下文数据都包含 `flowName`、`currentOperator` 等字段：

```typescript
registry.register(FlowMessageKey.APPROVAL_PASS, (data) =>
  `${data.currentOperator} 已审批通过流程「${data.flowName}」`
);
```

### 场景四：脚本编译错误显示详细信息

编译失败时，框架会传入后端返回的错误信息：

```typescript
registry.register(FlowMessageKey.DESIGN_SCRIPT_COMPILE_FAILED, (data) =>
  `脚本编译失败，原因：${data.message}`
);
```

## 审批动作上下文数据参考

调用 `registry.get()` 时，框架自动传入审批动作的上下文数据，模板函数可访问以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `flowName` | `string` | 流程设计标题 |
| `workCode` | `string` | 流程设计编码 |
| `recordId` | `number \| null` | 流程记录 ID，发起时为 `null` |
| `isStartNode` | `boolean` | 是否为发起节点 |
| `actionName` | `string` | 当前动作名称 |
| `nodeType` | `string` | 当前节点类型 |
| `nodeName` | `string` | 当前节点名称 |
| `currentOperator` | `string` | 当前操作人 |
| `createOperator` | `string` | 流程创建人 |
| `flowState` | `number` | 流程状态码 |
| `recordState` | `number` | 记录状态码 |
| `title` | `string` | 流程实例标题 |

## 完整消息键清单

### HTTP 系统消息

| 键 | 默认值 | 触发时机 |
|------|------|------|
| `http.token.expired` | `登录已过期，请退出再重新打开` | token 失效 |
| `http.no_permission` | `抱歉，该账户无权限访问` | HTTP 200 响应无 data 数据 |

> **注意**：HTTP 拦截器在 `403` 状态码分支中硬编码了文案 `抱歉，该账户无权限访问`，不走 `FlowMessageRegistry` 注册键，因此定制 `http.no_permission` 不会影响 403 提示。

### 审批动作消息

| 键 | 默认值 | 说明 |
|------|------|------|
| `approval.save` | 函数模板 | 上下文含 `isStartNode`，下游自定义模板可自行区分 |
| `approval.pass` | `操作成功` | 审批通过 |
| `approval.reject` | `操作成功` | 审批驳回 |
| `approval.delegate` | `操作成功` | 委托 |
| `approval.add_audit` | `操作成功` | 加签 |
| `approval.transfer` | `操作成功` | 转交 |
| `approval.return` | `操作成功` | 退回 |
| `approval.revoke` | `流程已撤回` | 撤回 |
| `approval.urge` | `已发送催办提醒.` | 催办 |
| `approval.custom` | `操作成功` | 自定义动作 |
| `approval.no_selected` | `请先选择审批流程.` | 合并审批未选流程 |

### 流程设计器消息

| 键 | 默认值 | 说明 |
|------|------|------|
| `design.save` | `流程已经保存.` | 保存流程设计 |
| `design.version_saved` | `版本已保存` | 版本保存 |
| `design.version_deleted` | `版本已删除` | 版本删除 |
| `design.import_success` | `流程已导入成功` | 导入成功 |
| `design.download_success` | `下载 {format} 成功` | 导出，需 `{format}` |
| `design.script_compile_success` | `脚本编译成功` | 脚本编译通过 |
| `design.script_compile_failed` | 函数模板 | 编译失败，需 `{message}` |
| `design.script_compile_error` | `脚本编译请求失败` | 编译请求异常 |
| `design.view_code_save_success` | `保存成功` | 代码视图保存 |
| `design.groovy_meta_failed` | `获取脚本元数据失败` | 元数据获取失败 |

### App 层消息

| 键 | 默认值 | 触发场景 |
|------|------|------|
| `app.login_success` | `login success` | 登录成功 |
| `app.user_deleted` | `用户已删除` | 删除用户 |
| `app.user_saved` | `用户已保存` | 保存用户 |
| `app.workflow.status_changed` | `状态已变更` | 流程状态变更 |
| `app.workflow.deleted` | `流程已删除` | 删除流程 |

## 高级用法

### 批量覆盖一个领域的所有消息

```typescript
const approvalMessages = {
  [FlowMessageKey.APPROVAL_PASS]: '审批已通过',
  [FlowMessageKey.APPROVAL_REJECT]: '审批已驳回',
  [FlowMessageKey.APPROVAL_DELEGATE]: '已委托',
  [FlowMessageKey.APPROVAL_TRANSFER]: '已转交',
  [FlowMessageKey.APPROVAL_RETURN]: '已退回',
  [FlowMessageKey.APPROVAL_ADD_AUDIT]: '已加签',
  [FlowMessageKey.APPROVAL_REVOKE]: '已撤回',
  [FlowMessageKey.APPROVAL_URGE]: '催办已发送',
  [FlowMessageKey.APPROVAL_SAVE]: (data) =>
    data.isStartNode ? '流程已发起' : '已保存',
};

registry.registerAll(approvalMessages);
```

### 国际化准备

所有消息模板支持运行时动态内容。国际化时，建议在 i18n 初始化完成后再注册：

```typescript
// 伪代码示例
i18n.init().then(() => {
  registry.registerAll({
    [FlowMessageKey.APPROVAL_PASS]: t('approval.pass.success'),
    [FlowMessageKey.APPROVAL_SAVE]: (data) =>
      data.isStartNode
        ? t('approval.save.start', { name: data.flowName })
        : t('approval.save.normal', { name: data.flowName }),
  });
});
```

### 调试：查看当前注册的所有消息

```typescript
// FlowMessageRegistry 当前未暴露 keys() 方法。
// 可通过以下方式确认某条消息是否已被覆盖：
const msg = registry.get(FlowMessageKey.APPROVAL_PASS);
// 如果返回的是框架默认文案（如 "操作成功"），说明该消息未被覆盖
```

## 注意事项

1. **不影响默认行为** — 未显式注册的消息将沿用框架内置的默认值，无需担心遗漏
2. **注册时机** — 建议在 App 入口文件（`main.tsx` / `index.tsx`）中尽早注册
3. **覆盖顺序** — 后注册的会覆盖先注册的；`registerAll` 按对象键顺序逐个覆盖
4. **上下文字段** — 函数模板中访问的字段取决于框架传入的上下文数据，不要假设字段一定存在，做好空值防御
5. **静态字符串无上下文** — 如果注册的是静态字符串，框架传入的上下文数据不会自动注入；如需动态内容请使用字符串模板或函数模板
