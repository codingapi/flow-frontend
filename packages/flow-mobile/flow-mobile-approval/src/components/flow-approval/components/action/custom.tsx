import React from "react";
import {FlowActionProps} from "./type";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {ActionType} from "@coding-flow/flow-types";

/**
 * 自定义
 * @param props
 * @constructor
 */
export const CustomAction: React.FC<FlowActionProps> = (props) => {
    const action = props.action;
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
        <></>
    )
}