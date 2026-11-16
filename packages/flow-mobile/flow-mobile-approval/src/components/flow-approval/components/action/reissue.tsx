import React from "react";
import {Button, Toast} from "antd-mobile";
import {Popconfirm} from "@coding-flow/flow-mobile-ui";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {APPROVAL_ACTION_REISSUE_KEY} from "@/components/flow-approval";
import {ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";

/**
 * 已完成流程的二次发起（独立能力，非审批动作）。
 *
 * 仅当详情数据 reissue 标识为 true（已正常完成 + 流程管理员）时展示：
 * 复制当前流程的表单数据重新发起一条新流程，新流程停在开始节点成为发起人的待办，
 * 原流程记录不做任何改写（issue #272）。
 */
export const ReissueAction = () => {

    const {state, context} = useApprovalContext();

    const presenter = context.getPresenter().getFlowActionPresenter();

    const reissue = state.flow?.reissue || false;

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_REISSUE_KEY);

    if (ActionView) {
        return (
            <ActionView
            />
        )
    }

    return (
        <>
            {reissue && (
                <Popconfirm
                    title={"确认要重新发起该流程吗？"}
                    onConfirm={async () => {
                        const res = await presenter.reissue();
                        if (res?.success) {
                            Toast.show(
                                FlowMessageRegistry.getInstance().get(
                                    FlowMessageKey.APPROVAL_REISSUE,
                                    presenter.buildActionContext()
                                )
                            )
                            context.close();
                        }
                    }}
                >
                    <Button
                        style={{
                            width: '100%',
                            padding: '10px',
                            margin: '5px',
                        }}
                    >
                        重新发起
                    </Button>
                </Popconfirm>
            )}
        </>
    )
}
