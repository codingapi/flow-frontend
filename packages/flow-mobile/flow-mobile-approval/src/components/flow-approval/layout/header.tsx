import {NavBar} from "antd-mobile";
import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {HEADER_HEIGHT} from "@/components/flow-approval/typings";
import {FlowApprovalTitle} from "@/components/flow-approval/components/flow-approval-title";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_HEADER_VIEW_KEY} from "@/components/flow-approval";

export const Header = () => {

    const {context} = useApprovalContext();

    const HeaderView = ViewBindPlugin.getInstance().get(APPROVAL_HEADER_VIEW_KEY);

    if (HeaderView) {
        return <HeaderView/>;
    }

    return (
        <NavBar
            style={{
                height: HEADER_HEIGHT,
                borderBottom: '1px solid lightgray',
            }}
            onBack={() => {
                context.close();
            }}
            right={false}
        >
            <FlowApprovalTitle/>
        </NavBar>
    )
}