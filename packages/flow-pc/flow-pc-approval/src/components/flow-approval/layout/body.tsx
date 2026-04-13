import React from "react";
import {FlowNodeHistoryAction} from "@/components/flow-approval/components/flow-node-history";
import {
    ApprovalContentPaddingH,
    ApprovalContentPaddingV,
    ApprovalLayoutHeight,
} from "@/components/flow-approval/typings";
import {Layout} from "antd";
import {FlowApprovalContent} from "@/components/flow-approval/components/flow-approval-content";
import {FlowApprovalSider} from "@/components/flow-approval/components/flow-approval-sider";
import {APPROVAL_BODY_VIEW_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const Body = () => {
    const flowNodeHistoryAction = React.useRef<FlowNodeHistoryAction>(null);

    const BodyView = ViewBindPlugin.getInstance().get(APPROVAL_BODY_VIEW_KEY);

    if (BodyView) {
        return <BodyView/>;
    }

    return (
        <Layout
            style={{
                padding: `${ApprovalContentPaddingV}px ${ApprovalContentPaddingH}px`,
                backgroundColor: '#f5f5f5',
                width: '100%',
                height: `calc(100vh - ${ApprovalLayoutHeight}px)`,
            }}
        >
            <FlowApprovalContent flowNodeHistoryAction={flowNodeHistoryAction}/>
            <FlowApprovalSider flowNodeHistoryAction={flowNodeHistoryAction}/>
        </Layout>
    )
}