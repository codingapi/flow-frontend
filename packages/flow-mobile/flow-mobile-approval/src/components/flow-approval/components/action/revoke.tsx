import React from "react";
import {Button,Toast} from "antd-mobile";
import {Popconfirm} from "@coding-flow/flow-mobile-ui";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

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
                                Toast.show("流程已撤回")
                                context.close();
                            }
                        });
                    }}
                >
                    <Button
                        style={{
                            width: '100%',
                            padding: '10px',
                            margin: '5px',
                        }}
                    >
                        撤回
                    </Button>
                </Popconfirm>
            )}
        </>
    )
}