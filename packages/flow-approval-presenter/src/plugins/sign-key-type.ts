import {FlowOperator} from "@coding-flow/flow-types";
import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'SignKeyViewPlugin';

export interface SignKeyViewPlugin {
    /** 当前用户 */
    current: FlowOperator;
    /** 返回签名 */
    onChange?: (value: string) => void;
    /** 当前签名 */
    value?: string;
    /** 动作控制 **/
    action?:React.Ref<ApprovalViewPluginAction>;
}