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
}

export type ApprovalState = {
    flow?: FlowContent;
    review?: boolean;
};


export const initStateData = {}

export interface FlowApprovalApi {

    create(body: Record<string, any>, mockKey: string): Promise<number>;

    processNodes(body: Record<string, any>, mockKey: string): Promise<ProcessNode[]>;

    action(body: Record<string, any>, mockKey: string): Promise<any>;

    revoke(id: any, mockKey: string): Promise<any>;

    urge(id: any, mockKey: string): Promise<any>;
}
