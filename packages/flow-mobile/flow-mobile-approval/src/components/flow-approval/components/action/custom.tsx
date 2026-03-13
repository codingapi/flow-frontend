import React from "react";
import {FlowActionProps} from "./type";
import {Toast} from "antd-mobile";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {EventBus, GroovyScriptConvertorUtil} from "@flow-engine/flow-core";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
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

    React.useEffect(()=>{
        EventBus.getInstance().on(action.id,()=>{
            actionPresenter.action(action.id).then((res) => {
                if (res.success) {
                    Toast.show("操作成功");
                    context.close();
                }
            });
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    },[]);

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