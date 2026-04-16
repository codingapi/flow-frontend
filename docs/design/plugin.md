# 界面拓展机制

支持流程组件对各类业务层面内容的界面拓展机制。

## 实现方式

```typescript
import {ViewBindPlugin} from "@flow-engine/flow-core";

// 界面视图
const MyView: React.FC<FormViewProps> = (props) => {
    return (
        <></>
    )
}

// 注册，关键信息为 key 和 界面 ComponentType,传递的属性根据不同的界面对应查看
ViewBindPlugin.getInstance().register('MyView', MyView)
```

## 拓展界面

### 流程审核

#### 表单渲染

```typescript
import {FormInstance} from "antd";
import {FlowForm, FlowTodo, FieldPermission} from "@/types/flow-approval";

/**
 * 合并表单操作数据
 */
export interface FormData {
    /** 表单操控对象 */
    form: FormInstance;
    /** 待办数据 */
    data: FlowTodo;
}

/**
 * 流程表单视图属性
 */
export interface FormViewProps {
    /** 流程合并 */
    mergeable: boolean;
    /** 合并表单操控对象 */
    formList?: FormData[];
    /** 表单操控对象 */
    form?: FormInstance;
    /** 待办数据 */
    data?: FlowTodo;
    /** 初始化数据 **/
    initData?: any;
    /** 表单数据更新事件 */
    onValuesChange?: (values: any) => void;
    /** 当合并流程选中了流程记录的回掉 **/
    onMergeRecordIdsSelected?: (recordIds: number[]) => void;
    /** 表单元数据对象 */
    meta: FlowForm;
    /** 表单字段权限,为空时全部可写*/
    fieldPermissions: FieldPermission[];
    /** 是否预览模式 */
    review: boolean;
}
```

表单选择的 key 对应流程节点设置的 view 名称，流程引擎对 default 提供了默认的表单渲染支持。

#### 表单视图注册

```typescript
import {ViewBindPlugin} from "@flow-engine/flow-core";

// 注册自定义表单视图
ViewBindPlugin.getInstance().register('FormView', MyCustomFormView);
```

#### 流程操作 加签

```typescript
import React from "react";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'AddAuditViewPlugin';

export interface AddAuditViewPlugin {
    /** 返回用户 */
    onChange?: (value: string | string[]) => void;
    /** 当前用户 */
    value?: string | string[];
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 流程操作 委派

```typescript
import React from "react";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'DelegateViewPlugin';

export interface DelegateViewPlugin {
    /** 返回用户 */
    onChange?: (value: string | string[]) => void;
    /** 当前用户 */
    value?: string | string[];
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 流程操作 提交时的获取签名界面

```typescript
import React from "react";
import {FlowOperator} from "@flow-engine/flow-types";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'SignKeyViewPlugin';

export interface SignKeyViewPlugin {
    /** 当前用户 */
    current: FlowOperator;
    /** 返回签名 */
    onChange?: (value: string) => void;
    /** 当前签名 */
    value?: string;
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 流程操作 转办操作

```typescript
import React from "react";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'TransferViewPlugin';

export interface TransferViewPlugin {
    /** 返回用户 */
    onChange?: (value: string | string[]) => void;
    /** 当前用户 */
    value?: string | string[];
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 流程操作 归还操作

```typescript
import React from "react";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'ReturnViewPlugin';

export interface ReturnViewPlugin {
    /** 返回用户 */
    onChange?: (value: string | string[]) => void;
    /** 当前用户 */
    value?: string | string[];
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 人工节点选择界面

```typescript
import React from "react";
import {NodeOption} from "@flow-engine/flow-types";
import {ApprovalViewPluginAction} from "@flow-engine/flow-approval-presenter";

export const VIEW_KEY = 'ManualViewPlugin';

export interface ManualViewPlugin {
    /** 返回下级节点Id */
    onChange: (value: string) => void;
    /** 可选下级节点方向 */
    options: NodeOption[];
    /** 动作控制 **/
    action?: React.Ref<ApprovalViewPluginAction>;
}
```

#### 操作人选择界面

```typescript
import React from "react";
import {NodeOption} from "@flow-engine/flow-types";

export const VIEW_KEY = 'OperatorSelectViewPlugin';

export interface OperatorSelectViewPlugin {
    /** 操作人选择结果回调: {nodeId: userId[]} */
    onChange: (value: Record<string, number[]>) => void;
    /** 需要指定操作人的节点列表 */
    options: NodeOption[];
}
```

### 流程设计-节点配置

#### 流程条件控制界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'ConditionViewPlugin';

export interface ConditionViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 异常处理逻辑界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'ErrorTriggerViewPlugin';

export interface ErrorTriggerViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 自定义标题界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'NodeTitleViewPlugin';

export interface NodeTitleViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 设置发起人范围界面

```typescript
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'OperatorCreateViewPlugin';

export interface OperatorCreateViewPlugin {
    /** 当前脚本 */
    script: string;
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 节点人员选择界面

```typescript
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'OperatorLoadViewPlugin';

export interface OperatorLoadViewPlugin {
    /** 当前脚本 */
    script: string;
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 路由配置界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'RouterViewPlugin';

export interface RouterViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 子流程配置界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'SubProcessViewPlugin';

export interface SubProcessViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 子流程操作人员选择界面

```typescript
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'SubProcessOperatorViewPlugin';

export interface SubProcessOperatorViewPlugin {
    /** 当前人员 */
    value?: string;
    /** 选择人员 */
    onChange?: (value: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 触发流程界面

```typescript
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'TriggerViewPlugin';

export interface TriggerViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

### 流程设计-动作配置

#### 自定义按钮触发脚本界面

```typescript
import {ActionSelectOption} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'ActionCustomViewPlugin';

export interface ActionCustomViewPlugin {
    /** 当前的脚本 */
    value?: string;
    /** 脚本更改回调 */
    onChange?: (value: string) => void;
    /** 可选择的动作范围 */
    options: ActionSelectOption[];
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

#### 拒绝动作界面

```typescript
import React from "react";
import {DesignViewPluginAction} from "@flow-engine/flow-design";

export const VIEW_KEY = 'ActionRejectViewPlugin';

export interface ActionRejectViewPlugin {
    /** 当前节点id */
    nodeId: string;
    /** 当前的脚本 */
    value?: string;
    /** 脚本更改回调 */
    onChange?: (value: string) => void;
    /** 动作控制 **/
    action?: React.Ref<DesignViewPluginAction>;
}
```

### 表单导入

#### 表单导入插件

```typescript
import {FlowForm} from "@flow-engine/flow-types";

export const IMPORT_FORM_VIEW_KEY = 'ImportFormViewPlugin';

export interface ImportFormViewPlugin {
    /** 是否显示 */
    open: boolean;
    /** 确认回调 */
    onSelect: (form: FlowForm) => void;
    /** 取消回调 */
    onCancel: () => void;
}
```

## 插件动作接口

### ApprovalViewPluginAction

用于审批视图插件的动作控制：

```typescript
export interface ApprovalViewPluginAction {
    /** 验证回调 */
    onValidate: () => Promise<boolean>;
}
```

### DesignViewPluginAction

用于流程设计视图插件的动作控制：

```typescript
export interface DesignViewPluginAction {
    /** 验证脚本 */
    onValidate: (script: string) => Promise<boolean>;
}
```

## 视图注册与使用示例

### 完整注册示例

```typescript
import {ViewBindPlugin} from "@flow-engine/flow-core";
import {AddAuditViewPlugin, VIEW_KEY as AddAuditViewPluginKey} from "@flow-engine/flow-approval-presenter";
import {ConditionViewPlugin, VIEW_KEY as ConditionViewPluginKey} from "@flow-engine/flow-design";

// 注册自定义加签视图
const CustomAddAuditView: React.FC<AddAuditViewPlugin> = (props) => {
    // 自定义实现
    return <YourCustomComponent {...props} />;
};
ViewBindPlugin.getInstance().register(AddAuditViewPluginKey, CustomAddAuditView);

// 注册自定义条件视图
const CustomConditionView: React.FC<ConditionViewPlugin> = (props) => {
    // 自定义实现
    return <YourCustomConditionEditor {...props} />;
};
ViewBindPlugin.getInstance().register(ConditionViewPluginKey, CustomConditionView);
```

### 默认实现说明

系统为每个插件界面提供了默认实现。当注册自定义视图后，如果存在已注册的视图组件，系统会优先使用自定义视图，否则使用默认视图。

**默认视图映射：**

| VIEW_KEY | 默认实现组件 |
|----------|-------------|
| AddAuditViewPlugin | 系统默认加签选择组件 |
| DelegateViewPlugin | 系统默认委派选择组件 |
| TransferViewPlugin | 系统默认转办选择组件 |
| ReturnViewPlugin | 系统默认归还选择组件 |
| SignKeyViewPlugin | 系统默认签名组件 |
| ManualViewPlugin | 系统默认人工节点选择组件 |
| OperatorSelectViewPlugin | 系统默认操作人选择组件 |
| ConditionViewPlugin | 系统默认条件配置组件 |
| ErrorTriggerViewPlugin | 系统默认异常处理配置组件 |
| NodeTitleViewPlugin | 系统默认标题配置组件 |
| OperatorCreateViewPlugin | 系统默认发起人范围配置组件 |
| OperatorLoadViewPlugin | 系统默认人员选择配置组件 |
| RouterViewPlugin | 系统默认路由配置组件 |
| SubProcessViewPlugin | 系统默认子流程配置组件 |
| TriggerViewPlugin | 系统默认触发配置组件 |
| ActionCustomViewPlugin | 系统默认自定义动作配置组件 |
| ActionRejectViewPlugin | 系统默认拒绝动作配置组件 |
