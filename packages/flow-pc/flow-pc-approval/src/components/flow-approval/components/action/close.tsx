import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {Button} from "antd";
import React from "react";
import {APPROVAL_ACTION_CLOSE_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const CloseAction = () => {
    const {context} = useApprovalContext();

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_CLOSE_KEY);

    if (ActionView) {
        return (
            <ActionView/>
        )
    }


    return (
        <Button
            onClick={() => {
                context.close();
            }}
        >
            关闭
        </Button>
    )
}