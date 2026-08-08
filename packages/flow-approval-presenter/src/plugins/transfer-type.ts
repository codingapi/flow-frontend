import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'TransferViewPlugin';

export interface TransferViewPlugin {
    /** 返回用户 */
    onChange?: (value: string|string[]) => void;
    /** 当前用户 */
    value?: string|string[];
    /** 动作控制 **/
    action?:React.Ref<ApprovalViewPluginAction>;
    /** 最大可选人数，-1 或缺省表示不限制，正整数表示可选人员的最大数 */
    maxOperatorCount?: number;
}