import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import React from "react";
import {message, Space} from "antd";
import {ObjectUtils, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {UrgeAction} from "@/components/flow-approval/components/action/urge";
import {RevokeAction} from "@/components/flow-approval/components/action/revoke";
import {CloseAction} from "@/components/flow-approval/components/action/close";

export const FlowApprovalActions = () => {

    const {state, context} = useApprovalContext()
    const actionList = state.flow?.actionList || [];
    const review = state?.review || false;

   const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const handlerClickCheck = (id: string) => {
        if (state.flow?.mergeable) {
            const selectRecordIds = actionPresenter.getSubmitRecordIds();
            const currentFormData = actionPresenter.getCurrentFormData();
            if (ObjectUtils.isEmptyObject(currentFormData) && selectRecordIds.length == 0) {
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
                    const hidden = actionPresenter.hiddenAction(action.id);
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