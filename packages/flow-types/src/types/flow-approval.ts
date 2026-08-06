import { ActionType } from "@/types/flow-design";
import { DataType } from "@/types/form-type";

/**
 * 字段权限类型
 */
export type FieldPermissionType = 'READ' | 'WRITE' | 'HIDDEN';


/**
 * 字段权限
 */
export interface FieldPermission {
    formCode: string;
    fieldCode: string;
    type: FieldPermissionType;
}

/**
 *  附加属性
 */
export interface FieldAttribute {
    // 属性key
    key: string;
    // 属性名称
    label?: string;
    // 属性值
    value?: any;
}

/**
 *  流程表单字段元数据
 */
export interface FormField {
    // 字段id
    id: string;
    // 字段名称
    name: string;
    // 字段编码
    code: string;
    // 字段类型
    type: string;
    // 数据类型
    dataType: DataType;
    // 是否隐藏
    hidden: boolean;
    // 是否必填
    required: boolean;
    // 默认值
    defaultValue?: string;
    // 输入提示
    placeholder?: string;
    // 提醒提示
    tooltip?: string;
    // 帮助提示
    help?: string;
    // 附加属性
    attributes?: FieldAttribute[];
}

/**
 * 流程表单元数据
 */
export interface FlowForm {
    // 表单名称
    name: string;
    // 表单编码
    code: string;
    // 表单字段
    fields: FormField[];
    // 子表单
    subForms: FlowForm[];
}

/**
 *  展示样式
 */
export interface DisplayStyle {
    // 边框颜色
    borderColor?: string;
    // 背景颜色
    backgroundColor?: string;
    // 边框大小
    borderSize?: string;
    // 边框圆角
    borderRadius?: string;
    // 展示按钮控制脚本
    script?:string;    

}

/**
 * 流程操作显示对象
 */
export interface FlowActionDisplay {
    // 标题
    title: string;
    // 样式
    style: string;
    // 图标
    icon: string;
}

/**
 * 流程操作对象
 */
export interface FlowAction {
    // 操作id
    id: string;
    // 按钮名称
    title: string;
    // 动作类型
    type: ActionType;
    // 展示样式
    display: FlowActionDisplay;
    // 是否启用
    enable: boolean;
    // 自定义脚本key
    script?: string;
    // 触发类型，自定义脚本使用
    triggerType?:string;
    // 前端触发事件，自定义脚本使用
    triggerFrontEvent?:string;
}

/**
 *  流程操作人对象
 */
export interface FlowOperator {
    // 人员id
    id: number;
    // 人员名称
    name: string;
}

/**
 *  流程记录操作人对象
 */
export interface ProcessNodeOperator {
    // 人员id
    userId: number;
    // 人员名称
    name: string;
    // 是否流程管理员
    flowManager: boolean;
    // 其他属性
    [key: string]: any;
}

/**
 *  流程操作记录对象
 */
export interface History {
    // 记录id
    recordId: number;
    // 流程标题
    title: string;
    // 审批意见
    advice: string;
    // 审批签名key
    signKey: string;
    // 审批节点
    nodeName: string;
    // 审批节点id
    nodeId: string;
    // 节点类型
    nodeType: string
    // 审批时间
    updateTime: number;
    // 阅读时间
    readTime: number;
}

/**
 *  流程待办对象
 */
export interface FlowTodo {
    // 记录id
    recordId: number;
    // 流程发起人
    createdOperator: FlowOperator;
    // 流程提交人
    submitOperator?: FlowOperator;
    // 流程标题
    title: string;
    // 流程数据
    data: Record<string, any>;
    // 记录状态
    recordState: number;
    // 流程状态
    flowState: number;
    // 流程创建时间
    createTime: number;
    // 流程id
    processId: string;
    // 流程标题
    workTitle: string;
    // 节点id
    nodeId: string;
    // 节点名称
    nodeName: string;
    // 节点类型
    nodeType: string;
}


/**
 *  流程审批人对象
 */
export interface FlowApprovalOperator {
    // 意见信息
    advice: string;
    // 签名key
    signKey: string;
    // 审核时间
    approveTime: number;
    // 审批动作
    actionName: string;
    // 审批类型
    actionType: string;
    // 审批人
    flowOperator: ProcessNodeOperator;
}

export type SubProcessState = 'WAITING' | 'PASSED' | 'ERROR';

export type SubProcessInstanceState = 'RUNNING' | 'FINISHED' | 'TERMINATED';

/**
 * 子流程节点创建的单个流程实例。
 */
export interface ProcessNodeSubProcessInstance {
    startRecordId: number;
    processId: string;
    /** 子流程创建时的流程名称；历史数据可能缺省。 */
    workTitle?: string;
    finishRecordId: number;
    state: SubProcessInstanceState;
    finishTime: number;
}

/**
 * 子流程节点的一次聚合执行信息。
 */
export interface ProcessNodeSubProcess {
    recordId: number;
    groupId: string;
    parentRecordId: number;
    totalCount: number;
    finishedCount: number;
    state: SubProcessState;
    createTime: number;
    finishTime: number;
    instances: ProcessNodeSubProcessInstance[];
}

/**
 * 流程节点对象
 */
export interface ProcessNode {
    // 记录id
    id: string;
    // 节点id
    nodeId: string;
    // 节点名称
    nodeName: string;
    // 节点类型
    nodeType: string;
    // 审批策略
    approveStrategy: 'SEQUENCE' | 'MERGE' | 'ANY' | 'RANDOM_ONE';
    // 审批状态
    approveState: 'PASS' | 'PROCESSING' | 'PENDING' | 'ERROR';
    // 人员模式
    operatorStrategy: 'OPERATOR_LIST' | 'INITIATOR_SELECT' | 'APPROVER_SELECT' | 'NO_OPERATOR';
    // 审批人员
    operators: FlowApprovalOperator[];
    // 是否为子流程详情中拼接的主流程历史记录
    parentProcessRecord?: boolean;
    // 子流程执行信息，仅子流程节点实际执行后返回
    subProcess?: ProcessNodeSubProcess;
}

/**
 * 节点
 */
export interface NodeOption {
    // 节点id
    id: string;
    // 节点名称
    name: string;
    // 节点类型
    type: string;
    // 展示节点
    display: boolean;
    // 可选人员范围（发起人/审批人设定时返回）；为空或缺省表示不限范围，可选任意人
    operators?: ProcessNodeOperator[];
}

/**
 * 流程审批内容对象
 */
export interface FlowContent {
    // 记录id
    recordId: number;
    // 流程id
    processId: string;
    // 流程设计id
    workId: string;
    // 流程设计编码
    workCode: string;
    // 流程设计标题
    workTitle: string;
    // 流程设计备注
    workDescription: string;
    // 流程创建时间，发起时为0
    createTime: number;
    // 节点id
    nodeId: string;
    // 节点名称
    nodeName: string;
    // 节点类型
    nodeType: string;
    // 流程标题
    title: string;
    // 视图名称
    view: string;
    // 视图代码
    code: string;
    // 视图标题
    viewTitle?: string;
    // 是否必填意见
    adviceRequired: boolean;
    // 是否必填签名
    signRequired: boolean;
    // 是否隐藏审批意见（开启后审批时不展示审批意见输入框）
    adviceHidden?: boolean;
    // 表单元数据
    form: FlowForm;
    /** 表单字段权限*/
    fieldPermissions: FieldPermission[];
    // 待办记录
    todos: FlowTodo[];
    // 操作展示按钮
    actions: FlowAction[];
    // 操作全部按钮
    actionList:FlowAction[];
    // 是否合并
    mergeable: boolean;
    // 流程创建人
    createOperator: FlowOperator;
    // 当前流程
    currentOperator: FlowOperator;
    // 流程状态
    flowState: number;
    // 记录状态
    recordState: number;
    // 审批记录
    histories: History[];
    // 所有节点
    nodes: NodeOption[];
    // 支持撤销
    revoke: boolean;
    // 支持催办
    urge: boolean;
}
