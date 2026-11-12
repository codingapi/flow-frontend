import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'ReduceAuditViewPlugin';

/**
 * 减签人员选择视图（issue-72）
 *
 * 默认实现只是占位，真实项目应注册该视图，列出当前节点的待审批人（不含当前审批人）。
 * 被减签人是否合法最终由服务端校验。
 */
export interface ReduceAuditViewPlugin {
    /** 返回用户 */
    onChange?: (value: string|string[]) => void;
    /** 当前用户 */
    value?: string|string[];
    /** 动作控制 **/
    action?:React.Ref<ApprovalViewPluginAction>;
}
