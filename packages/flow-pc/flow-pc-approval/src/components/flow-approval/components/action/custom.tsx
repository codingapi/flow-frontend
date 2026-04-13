import React from "react";
import {FlowActionProps} from "./type";
import {message} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {GroovyScriptConvertorUtil, ViewBindPlugin} from "@coding-flow/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {ActionType} from "@coding-flow/flow-types";
import {APPROVAL_ACTION_CUSTOM_KEY} from "@/components/flow-approval";

/**
 * 自定义
 * @param props
 * @constructor
 */
export const CustomAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const script = action.script || '';
    const returnData = GroovyScriptConvertorUtil.getReturnScript(script);
    const triggerType = returnData.replaceAll('\'', '');


    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_CUSTOM_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    const FlowActionComponent =
        ActionFactory.getInstance().getFlowActionComponent({
            ...props.action,
            type: triggerType as ActionType,
        });

    if (FlowActionComponent) {
        return (
            <FlowActionComponent
                action={action}
                onClickCheck={(actionId) => {
                    if (props.onClickCheck) {
                        return props.onClickCheck?.(actionId);
                    }
                    return false;
                }}
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
                            message.success("操作成功");
                            context.close();
                        }
                    });
                }
            }}
            title={action.title}
        />
    )
}