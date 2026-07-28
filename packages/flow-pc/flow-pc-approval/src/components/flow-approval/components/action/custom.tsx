import React from "react";
import { FlowActionProps } from "./type";
import { message } from "antd";
import { useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { GroovyScriptConvertorUtil, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry } from "@coding-flow/flow-core";
import { ActionFactory } from "@/components/flow-approval/components/action/factory";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { ActionType } from "@coding-flow/flow-types";
import { APPROVAL_ACTION_CUSTOM_KEY } from "@/components/flow-approval";
import { EventBus } from "@coding-flow/flow-core";

/**
 * 自定义
 * @param props
 * @constructor
 */
export const CustomAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const triggerType = action.triggerType;
    const triggerFrontEvent = action.triggerFrontEvent;

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_CUSTOM_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }


    if (triggerFrontEvent) {
        return (
            <>
                {
                    !props.hidden && (
                        <CustomStyleButton
                            loading={actionLoading}
                            disabled={actionLoading}
                            display={props.action.display}
                            onClick={() => {
                                if (triggerFrontEvent) {
                                    // 前端触发事件不经过 action()，需手动执行拦截器：
                                    // 全部放行后才派发事件，任一拦截器返回 false 则终止
                                    actionPresenter.interceptAction(action.id).then((passed) => {
                                        if (passed) {
                                            EventBus.getInstance().emit(triggerFrontEvent);
                                        }
                                    });
                                } else {
                                    if (props.onClickCheck?.(action.id)) {
                                        actionPresenter.action(action.id).then((res) => {
                                            if (res.success) {
                                                message.success(
                                                    FlowMessageRegistry.getInstance().get(
                                                        FlowMessageKey.APPROVAL_CUSTOM,
                                                        actionPresenter.buildActionContext(action.id)
                                                    )
                                                );
                                                context.close();
                                            }
                                        });
                                    }
                                }
                            }}
                            title={action.title}
                        />
                    )
                }
            </>
        )
    }

    if (triggerType) {
        const FlowActionComponent =
            ActionFactory.getInstance().getFlowActionComponent({
                ...props.action,
                type: triggerType as ActionType,
            });

        if (FlowActionComponent) {
            return (
                <>
                    {!props.hidden && (
                        <FlowActionComponent
                            action={action}
                            onClickCheck={(actionId) => {
                                if (props.onClickCheck) {
                                    return props.onClickCheck?.(actionId);
                                }
                                return false;
                            }}
                            hidden={props.hidden}
                        />
                    )}
                </>
            )
        }
    }

}