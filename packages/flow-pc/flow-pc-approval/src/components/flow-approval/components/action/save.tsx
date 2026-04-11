import React from "react";
import {FlowActionProps} from "./type";
import {message} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {APPROVAL_ACTION_SAVE_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

/**
 * 保存
 * @param props
 * @constructor
 */
export const SaveAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_SAVE_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    return (
        <CustomStyleButton
            display={props.action.display}
            onClick={() => {
                if (props.onClickCheck?.(action.id)) {
                    actionPresenter.action(action.id).then((res) => {
                        if (res.success) {
                            message.success("流程数据已保存");
                        }
                    });
                }
            }}
            title={action.title}
        />
    )
}