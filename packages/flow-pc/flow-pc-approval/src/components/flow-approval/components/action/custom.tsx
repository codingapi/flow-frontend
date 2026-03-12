import React from "react";
import {FlowActionProps} from "./type";
import {message} from "antd";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {GroovyScriptConvertorUtil} from "@flow-engine/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {ActionType} from "@flow-engine/flow-types";

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


    const ActionView = ActionFactory.getInstance().render({
        ...props.action,
        type: triggerType as ActionType,
    });

    if (ActionView) {
        return ActionView
    }

    return (
        <CustomStyleButton
            display={props.action.display}
            onClick={() => {
                actionPresenter.action(action.id).then((res) => {
                    if (res.success) {
                        message.success("操作成功");
                        context.close();
                    }
                });
            }}
            title={action.title}
        />
    )
}