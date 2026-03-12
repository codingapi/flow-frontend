import React from "react";
import {Button, message, Popconfirm} from "antd";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";

export const RevokeAction = () => {

    const {state, context} = useApprovalContext();

    const presenter = context.getPresenter().getFlowActionPresenter();

    const revoke = state.flow?.revoke || false;

    return (
        <>
            {revoke && (
                <Popconfirm
                    title={"确认要撤销审批吗？"}
                    onConfirm={() => {
                        presenter.revoke().then((res) => {
                            if(res.success) {
                                message.success("流程已撤回")
                                context.close();
                            }
                        });
                    }}
                >
                    <Button>
                        撤回
                    </Button>
                </Popconfirm>

            )}
        </>
    )
}