import React from "react";
import {FOOTER_HEIGHT} from "@/components/flow-approval/typings";
import {APPROVAL_FOOTER_VIEW_KEY, FlowApprovalActions} from "@/components/flow-approval";
import { ViewBindPlugin } from "@coding-flow/flow-core";

export const Footer = () => {

    const HeaderView = ViewBindPlugin.getInstance().get(APPROVAL_FOOTER_VIEW_KEY);

    if (HeaderView) {
        return <HeaderView/>;
    }

    return (
        <div
            style={{
                height: FOOTER_HEIGHT,
                width: '100%',
                borderTop: '1px solid lightgray',
            }}
        >
             <FlowApprovalActions/>
        </div>
    )
}