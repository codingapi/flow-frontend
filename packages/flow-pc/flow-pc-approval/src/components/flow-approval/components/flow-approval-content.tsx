import React from "react";
import {FormViewComponent} from "@/components/flow-approval/components/form-view-component";
import {Card, Layout} from "antd";
import {FlowNodeHistoryAction} from "@/components/flow-approval/components/flow-node-history";

const {Content} = Layout;

interface FlowApprovalContentProps {
    flowNodeHistoryAction: React.RefObject<FlowNodeHistoryAction>;
}

export const FlowApprovalContent: React.FC<FlowApprovalContentProps> = (props) => {

    const flowNodeHistoryAction = props.flowNodeHistoryAction;

    const handleValuesChange = (values: any) => {
        flowNodeHistoryAction.current?.refresh();
    }

    return (
        <Content
            style={{
                overflow: 'auto',
                width: '100%',
            }}>
            <Card
                style={{height: '100%', borderRadius: 8}}
                styles={{body: {padding: 24}}}
            >
                <FormViewComponent
                    onValuesChange={handleValuesChange}
                />
            </Card>
        </Content>
    )
}