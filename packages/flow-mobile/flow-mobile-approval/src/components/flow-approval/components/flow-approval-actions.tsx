import React, {useState} from "react";
import {MoreOutlined} from "@ant-design/icons";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {useLayoutPresenter} from "@/components/flow-approval/layout/hooks/use-layout-presenter";
import {ActionSheet, Button, Space, Toast} from "antd-mobile";
import {RevokeAction} from "@/components/flow-approval/components/action/revoke";
import {UrgeAction} from "@/components/flow-approval/components/action/urge";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {EventBus, ObjectUtils} from "@coding-flow/flow-core";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const FlowApprovalActions = ()=>{

    const {state, context} = useApprovalContext();
    const presenter = useLayoutPresenter();

    const [moreVisible, setMoreVisible] = useState(false);

    const handlerAction = (id: string) => {
        if (state.flow?.mergeable) {
            const presenter = context.getPresenter().getFlowActionPresenter();
            const selectRecordIds = presenter.getSubmitRecordIds();
            const currentFormData = presenter.getCurrentFormData();
            if (ObjectUtils.isEmptyObject(currentFormData) && selectRecordIds.length == 0) {
                Toast.show('请先选择审批流程.')
                return;
            }
        }
        EventBus.getInstance().emit(id);
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
            {presenter.getActions().map((action, index) => {
                return ActionFactory.getInstance().render(action);
            })}

            {!presenter.isReview() && presenter.getFooterOptions()
                .map((action, index) => {
                    return (
                        <CustomStyleButton
                            key={index}
                            onClick={() => {
                                handlerAction(action.id);
                            }}
                            display={action.display}
                            title={action.title}
                        />
                    )
                })
            }

            {!presenter.isReview() && presenter.hasMoreOptions() && (
                <Button
                    onClick={() => setMoreVisible(true)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        margin: '5px',
                    }}
                >
                    <Space>
                        <span>更多操作</span>
                        <MoreOutlined/>
                    </Space>
                </Button>
            )}


            <RevokeAction/>
            <UrgeAction/>

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