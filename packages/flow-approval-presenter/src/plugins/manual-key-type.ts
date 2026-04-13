import {NodeOption} from "@coding-flow/flow-types";
import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'ManualViewPlugin';

export interface ManualViewPlugin {
    /** 返回下级节点Id */
    onChange: (value: string) => void;
    /** 可选下级节点方向 */
    options: NodeOption[];
    /** 动作控制 **/
    action?:React.Ref<ApprovalViewPluginAction>;
}