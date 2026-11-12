import {FlowContent, ProcessNode} from "@coding-flow/flow-types";

/**
 * 流程审批布局组件属性
 */
export interface ApprovalLayoutProps {
    // 流程详情内容
    content: FlowContent;
    // 是否预览（当查看详情非审批时，设置为true）
    review?: boolean;
    // 关闭回掉
    onClose?: () => void;
    /** 初始化数据 **/
    initData?: any;
    // 样式定义
    className?: string;
}


/** 流程审批面板 */
export interface ApprovalPanelProps {
    /** 初始化数据 **/
    initData?: any;
    // 流程设计编码
    workflowCode?: string;
    // 流程记录Id
    recordId?: string;
    // 关闭回掉
    onClose?: () => void;
    // 是否预览（当查看详情非审批时，设置为true）
    review?: boolean;
    // 样式定义
    className?: string;
}

export type ApprovalState = {
    flow?: FlowContent;
    review?: boolean;
    /** 审批操作请求进行中（action/revoke/urge），用于驱动按钮 loading 与禁用 */
    actionLoading?: boolean;
    /**
     * 合并审批中当前正在查看的单条流程记录id。
     *
     * 设置后表示已从合并列表进入单条流程：动作、选人范围与提交目标都按该条记录计算，
     * 不支持批量的动作（如减签）只有在此状态下才允许操作。
     */
    mergeSingleRecordId?: number;
};


export const initStateData = {}

export interface FlowApprovalApi {

    create(body: Record<string, any>, mockKey: string): Promise<number>;

    processNodes(body: Record<string, any>, mockKey: string): Promise<ProcessNode[]>;

    action(body: Record<string, any>, mockKey: string): Promise<any>;

    revoke(id: any, mockKey: string): Promise<any>;

    urge(id: any, mockKey: string): Promise<any>;

    /**
     * 子流程数据重置（独立接口，不属于常规审批动作）。
     * 仅当详情数据 resetSubProcess 标识为 true 时可调用，
     * 请求体为 FlowSubProcessResetRequest（recordId + resetInstanceProcessIds + advice）。
     */
    resetSubProcess(body: Record<string, any>, mockKey: string): Promise<any>;
}
