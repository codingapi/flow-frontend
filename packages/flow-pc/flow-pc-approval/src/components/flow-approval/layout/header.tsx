import React from "react";
import {Flex} from "antd";
import {ApprovalLayoutHeight} from "@/components/flow-approval/typings";
import {FlowApprovalActions} from "@/components/flow-approval/components/flow-approval-actions";
import {FlowApprovalTitle} from "@/components/flow-approval/components/flow-approval-title";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_HEADER_VIEW_KEY} from "@/components/flow-approval";

export const Header = () => {

    const HeaderView = ViewBindPlugin.getInstance().get(APPROVAL_HEADER_VIEW_KEY);

    if (HeaderView) {
        return <HeaderView/>;
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
                <FlowApprovalTitle/>
                <FlowApprovalActions/>
            </Flex>
        </div>
    )
}