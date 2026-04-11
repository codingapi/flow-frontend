import React from "react";
import {FlowActionProps} from "./type";
import {Toast} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {EventBus, ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_ACTION_SAVE_KEY} from "@/components/flow-approval";

/**
 * 保存
 * @param props
 * @constructor
 */
export const SaveAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            actionPresenter.action(action.id).then((res) => {
                if (res.success) {
                    Toast.show("流程数据已保存");
                }
            });
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_SAVE_KEY);

    if (ActionView) {
        return (
            <ActionView
            />
        )
    }


    return (
        <></>
    )
}