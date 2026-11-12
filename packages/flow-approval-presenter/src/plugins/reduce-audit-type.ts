import React from "react";
import {ApprovalViewPluginAction} from "@/plugins/approval-view-plugin-action";

export const VIEW_KEY = 'ReduceAuditViewPlugin';

/**
 * 减签人员选择视图（issue-72）
 *
 * 默认实现读取详情响应的 `currentNodeOperators`（当前节点待审批人，不含当前审批人），
 * 真实项目可通过 ViewBindPlugin 注册该视图换成自己的选人组件。
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
