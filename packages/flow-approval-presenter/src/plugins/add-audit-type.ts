import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'AddAuditViewPlugin';

export interface AddAuditViewPlugin {
    /** 返回用户 */
    onChange?: (value: string|string[]) => void;
    /** 当前用户 */
    value?: string|string[];
    /** 动作控制 **/
    action?:React.Ref<ApprovalViewPluginAction>;
}