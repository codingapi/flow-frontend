import {NodeOption} from "@coding-flow/flow-types";

export const VIEW_KEY = 'ManualViewPlugin';

export interface ManualViewPlugin {
    /** 返回下级节点Id */
    onChange: (value: string) => void;
    /** 可选下级节点方向 */
    options: NodeOption[];
}