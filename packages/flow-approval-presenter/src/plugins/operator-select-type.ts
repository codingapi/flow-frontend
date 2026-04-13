import {NodeOption} from "@coding-flow/flow-types";

export const VIEW_KEY = 'OperatorSelectViewPlugin';

export interface OperatorSelectViewPlugin {
    /** 操作人选择结果回调: {nodeId: userId[]} */
    onChange: (value: Record<string, number[]>) => void;
    /** 需要指定操作人的节点列表 */
    options: NodeOption[];
}
