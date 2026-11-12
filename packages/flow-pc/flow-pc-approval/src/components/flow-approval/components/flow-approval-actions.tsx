import {useApprovalContext, FlowActionPresenter} from "@coding-flow/flow-approval-presenter";
import React from "react";
import {message, Space} from "antd";
import {FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {UrgeAction} from "@/components/flow-approval/components/action/urge";
import {RevokeAction} from "@/components/flow-approval/components/action/revoke";
import {CloseAction} from "@/components/flow-approval/components/action/close";

export const FlowApprovalActions = () => {

    const {state, context} = useApprovalContext()
    const actionList = state.flow?.actionList || [];
    const visibleActions = state.flow?.actions || [];
    const review = state?.review || false;

   const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const handlerClickCheck = (id: string) => {
        // 合并待办（多条记录合并成一条 todo）必须先显式选择要处理的流程记录。
        // 不能以「表单已有数据」代替选择：表单数据只代表当前展示的记录，
        // 未选择时提交会落到默认记录上（issue-72 测试反馈）
        // 不支持批量的动作（如减签）只作用于当前记录，不要求勾选合并流程
        if (state.flow?.mergeable && actionPresenter.isBatchable(id)) {
            const todoCount = state.flow?.todos?.length ?? 0;
            const selectRecordIds = actionPresenter.getSubmitRecordIds();
            if (todoCount > 1 && selectRecordIds.length == 0) {
                message.error(
                    FlowMessageRegistry.getInstance().get(FlowMessageKey.APPROVAL_NO_SELECTED)
                )
                return false;
            }
        }

        return true;
    }

    return (
        <Space size={8}>
            {!review && actionList.map((action) => {
                const FlowActionComponent = ActionFactory.getInstance().getFlowActionComponent(action);
                if (FlowActionComponent) {
                    const hidden = FlowActionPresenter.isActionHidden(visibleActions, action.id);
                    return (
                        <FlowActionComponent
                            action={action}
                            hidden={hidden}
                            onClickCheck={(actionId) => {
                                return handlerClickCheck(actionId);
                            }}
                        />
                    )
                }
            })}

            <UrgeAction/>
            <RevokeAction/>
            <CloseAction/>

        </Space>
    )
}