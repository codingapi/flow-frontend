import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {Button, Flex, Space, Typography,message} from "antd";
import {ApprovalLayoutHeight} from "@/components/flow-approval/typings";
import {ActionFactory} from "@/components/flow-approval/components/action/factory";
import {UrgeAction} from "@/components/flow-approval/components/action/urge";
import {RevokeAction} from "@/components/flow-approval/components/action/revoke";
import {ObjectUtils} from "@coding-flow/flow-core";

const {Title} = Typography;

export const Header = () => {
    const {state, context} = useApprovalContext()
    const actions = state.flow?.actions || [];
    const review = state?.review || false;


    const handlerClickCheck = (id: string)  => {

        if (state.flow?.mergeable) {
            const presenter = context.getPresenter().getFlowActionPresenter();
            const selectRecordIds = presenter.getSubmitRecordIds();
            const currentFormData = presenter.getCurrentFormData();
            if (ObjectUtils.isEmptyObject(currentFormData) &&selectRecordIds.length == 0) {
                message.error('请先选择审批流程.')
                return false;
            }
        }

        return true;
    }

    return (
        <div
            style={{
                width: "100%",
                height: ApprovalLayoutHeight,
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fff',
            }}
        >
            <Flex
                align="center"
                justify="space-between"
                style={{
                    margin: '0 24px',
                    height: '100%',
                }}
            >
                <Title level={4} style={{fontSize: 16, fontWeight: 500}}>
                    {state.flow?.title || '审批详情'}
                </Title>

                <Space size={8}>
                    {!review && actions.map((action) => {
                        const FlowActionComponent = ActionFactory.getInstance().getFlowActionComponent(action);
                        if (FlowActionComponent) {
                            return (
                                <FlowActionComponent
                                    action={action}
                                    onClickCheck={(actionId) => {
                                        return handlerClickCheck(actionId);
                                    }}
                                />
                            )
                        }
                    })}
                    <UrgeAction/>
                    <RevokeAction/>
                    <Button
                        onClick={() => {
                            context.close();
                        }}
                    >
                        关闭
                    </Button>
                </Space>
            </Flex>
        </div>
    )
}