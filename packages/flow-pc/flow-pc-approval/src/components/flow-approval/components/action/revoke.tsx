import React from "react";
import {Button, message, Popconfirm} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {APPROVAL_ACTION_REVOKE_KEY} from "@/components/flow-approval";
import {ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";

export const RevokeAction = () => {

    const {state, context} = useApprovalContext();

    const presenter = context.getPresenter().getFlowActionPresenter();

    const revoke = state.flow?.revoke || false;
    const actionLoading = state.actionLoading ?? false;


    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_REVOKE_KEY);

    if (ActionView) {
        return (
            <ActionView
            />
        )
    }

    return (
        <>
            {revoke && (
                <Popconfirm
                    title={"确认要撤销审批吗？"}
                    onConfirm={() => {
                        presenter.revoke().then((res) => {
                            if(res.success) {
                                message.success(
                                    FlowMessageRegistry.getInstance().get(
                                        FlowMessageKey.APPROVAL_REVOKE,
                                        presenter.buildActionContext()
                                    )
                                )
                                context.close();
                            }
                        });
                    }}
                >
                    <Button loading={actionLoading} disabled={actionLoading}>
                        撤回
                    </Button>
                </Popconfirm>

            )}
        </>
    )
}