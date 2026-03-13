import React from "react";
import {Button,Toast} from "antd-mobile";
import {Popconfirm} from "@flow-engine/flow-mobile-ui";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";

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
                                Toast.show("已发送催办提醒.");
                            }
                        })
                    }}
                >
                    <Button
                        style={{
                            width: '100%',
                            padding: '10px',
                            margin: '5px',
                        }}
                    >
                        催办
                    </Button>
                </Popconfirm>
            )}
        </>
    )
}