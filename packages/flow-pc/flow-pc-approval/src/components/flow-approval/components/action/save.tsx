import React from "react";
import { FlowActionProps } from "./type";
import { message } from "antd";
import { useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { APPROVAL_ACTION_SAVE_KEY } from "@/components/flow-approval";
import { ViewBindPlugin, FlowMessageKey, FlowMessageRegistry, EventBus } from "@coding-flow/flow-core";

/**
 * 保存
 * @param props
 * @constructor
 */
export const SaveAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_SAVE_KEY);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id).then((res) => {
            if (res.success) {
                message.success(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_SAVE,
                        actionPresenter.buildActionContext(action.id)
                    )
                );
            }
        });
    }

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            if (props.onClickCheck?.(action.id)) {
                handleSubmit();
            }
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    return (
        <>
            {!props.hidden && (
                <CustomStyleButton
                    loading={actionLoading}
                    disabled={actionLoading}
                    display={props.action.display}
                    onClick={() => {
                        if (props.onClickCheck?.(action.id)) {
                            handleSubmit();
                        }
                    }}
                    title={action.title}
                />
            )}
        </>
    )
}