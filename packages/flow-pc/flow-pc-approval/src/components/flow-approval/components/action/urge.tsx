import React from "react";
import {Button, message, Popconfirm} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const UrgeAction = () => {

    const {state, context} = useApprovalContext();
    const presenter = context.getPresenter().getFlowActionPresenter();
    const urge = state.flow?.urge || false;

    return (
        <>
            {urge && (
                <Popconfirm
                    title={"确认要催办审批用户吗？"}
                    onConfirm={() => {
                        presenter.urge().then((res) => {
                            if(res.success) {
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