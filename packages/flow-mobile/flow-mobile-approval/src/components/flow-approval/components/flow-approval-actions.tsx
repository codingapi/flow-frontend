import React, { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { useLayoutPresenter } from "@/components/flow-approval/layout/hooks/use-layout-presenter";
import { ActionSheet, Button, Space, Toast } from "antd-mobile";
import { RevokeAction } from "@/components/flow-approval/components/action/revoke";
import { UrgeAction } from "@/components/flow-approval/components/action/urge";
import { ActionFactory } from "@/components/flow-approval/components/action/factory";
import { dispatchApprovalFrontEvent } from "@/components/flow-approval/components/action-front-event";
import { EventBus, FlowMessageKey, FlowMessageRegistry } from "@coding-flow/flow-core";
import { useApprovalContext } from "@coding-flow/flow-approval-presenter";

export const FlowApprovalActions = () => {

    const { state, context } = useApprovalContext();
    const presenter = useLayoutPresenter();
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const actionList = state.flow?.actionList || [];

    const [moreVisible, setMoreVisible] = useState(false);

    const handlerAction = (id: string) => {
        const action = actionPresenter.getAction(id);
        // 合并待办必须先显式选择要处理的流程记录，不能以「表单已有数据」代替选择
        // （未选择时提交会落到默认记录上，issue-72 测试反馈）
        if (state.flow?.mergeable) {
            const todoCount = state.flow?.todos?.length ?? 0;
            const selectRecordIds = actionPresenter.getSubmitRecordIds();
            if (todoCount > 1 && selectRecordIds.length == 0) {
                Toast.show(FlowMessageRegistry.getInstance().get(FlowMessageKey.APPROVAL_NO_SELECTED))
                return;
            }
        }
        if (action) {
            const triggerFrontEvent = action.triggerFrontEvent;
            if (triggerFrontEvent) {
                // 前端触发事件不经过 action()，需手动执行拦截器：全部放行后才派发事件
                dispatchApprovalFrontEvent(actionPresenter, id, triggerFrontEvent);
            } else {
                EventBus.getInstance().emit(id);
            }
        } else {
            EventBus.getInstance().emit(id);
        }
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                gap: '10px',
                alignItems: 'center',
            }}
        >
            {actionList.map((action, index) => {                
                return ActionFactory.getInstance().render(action);
            })}

            {!presenter.isReview() && presenter.getFooterOptions()
                .map((action, index) => {
                    return (
                        <CustomStyleButton
                            key={index}
                            loading={actionLoading}
                            disabled={actionLoading}
                            onClick={() => {
                                const triggerFrontEvent = action.triggerFrontEvent;
                                if (triggerFrontEvent) {
                                    dispatchApprovalFrontEvent(actionPresenter, action.id, triggerFrontEvent);
                                } else {
                                    handlerAction(action.id);
                                }
                            }}
                            display={action.display}
                            title={action.title}
                        />
                    )
                })
            }

            {!presenter.isReview() && presenter.hasMoreOptions() && (
                <Button
                    disabled={actionLoading}
                    onClick={() => setMoreVisible(true)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        margin: '5px',
                    }}
                >
                    <Space>
                        <span>更多操作</span>
                        <MoreOutlined />
                    </Space>
                </Button>
            )}


            <RevokeAction />
            <UrgeAction />

            <ActionSheet
                visible={moreVisible}
                onAction={(action) => {
                    handlerAction(action.key as string);
                }}
                cancelText={"取消"}
                actions={presenter.getMoreOptions().map(action => {
                    return {
                        text: action.title,
                        key: action.id
                    }
                })}
                onClose={() => setMoreVisible(false)}
            />

        </div>
    )
}