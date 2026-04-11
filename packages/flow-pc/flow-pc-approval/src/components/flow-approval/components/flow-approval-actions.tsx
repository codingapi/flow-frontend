import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import React from "react";
import {message, Space} from "antd";
import {ObjectUtils} from "@coding-flow/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {UrgeAction} from "@/components/flow-approval/components/action/urge";
import {RevokeAction} from "@/components/flow-approval/components/action/revoke";
import {CloseAction} from "@/components/flow-approval/components/action/close";

export const FlowApprovalActions = () => {

    const {state, context} = useApprovalContext()
    const actions = state.flow?.actions || [];
    const review = state?.review || false;

    const handlerClickCheck = (id: string) => {

        if (state.flow?.mergeable) {
            const presenter = context.getPresenter().getFlowActionPresenter();
            const selectRecordIds = presenter.getSubmitRecordIds();
            const currentFormData = presenter.getCurrentFormData();
            if (ObjectUtils.isEmptyObject(currentFormData) && selectRecordIds.length == 0) {
                message.error('请先选择审批流程.')
                return false;
            }
        }

        return true;
    }

    return (
        <Space size={8}>
            {!review && actions.map((action) => {
                const FlowActionComponent = ActionFactory.getInstance().getFlowActionComponent(action);
                if (FlowActionComponent) {
                    return (
                        <FlowActionComponent
                            action={action}
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