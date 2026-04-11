import React from "react";
import {Button, message, Popconfirm} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {APPROVAL_ACTION_URGE_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const UrgeAction = () => {

    const {state, context} = useApprovalContext();
    const presenter = context.getPresenter().getFlowActionPresenter();
    const urge = state.flow?.urge || false;

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_URGE_KEY);

    if (ActionView) {
        return (
            <ActionView/>
        )
    }

    return (
        <>
            {urge && (
                <Popconfirm
                    title={"确认要催办审批用户吗？"}
                    onConfirm={() => {
                        presenter.urge().then((res) => {
                            if (res.success) {
                                message.success("已发送催办提醒.");
                            }
                        })
                    }}
                >
                    <Button>
                        催办
                    </Button>
                </Popconfirm>
            )}
        </>
    )
}