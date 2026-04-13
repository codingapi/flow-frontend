import React from "react";
import {FlowApprovalContent} from "@/components/flow-approval/components/flow-approval-content";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_BODY_VIEW_KEY} from "@/components/flow-approval";

interface BodyProps {
    height: string
}

export const Body:React.FC<BodyProps> = (props) => {

    const BodyView = ViewBindPlugin.getInstance().get(APPROVAL_BODY_VIEW_KEY);

    if (BodyView) {
        return <BodyView/>;
    }

    return (
        <div
            style={{
                height: props.height,
                overflowY: "auto",
            }}
        >
            <FlowApprovalContent/>
        </div>
    )
}