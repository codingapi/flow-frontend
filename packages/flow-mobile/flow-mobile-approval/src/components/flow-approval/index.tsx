import React from "react";
import {detail} from "@/api/record";
import {FlowContent} from "@coding-flow/flow-types";
import {ApprovalLayout} from "@/components/flow-approval/layout";
import {useMockContext,type ApprovalPanelProps} from "@coding-flow/flow-approval-presenter";
import "./index.scss";


export const ApprovalPanel: React.FC<ApprovalPanelProps> = (props) => {

    const [content, dispatch] = React.useState<FlowContent | undefined>(undefined);

    const mockKey = useMockContext();

    React.useEffect(() => {
        const id = props.recordId || props.workflowCode || '';
        detail(id,mockKey).then(res => {
            if (res.success) {
                dispatch(res.data);
            }
        });
    }, []);

    return (
        <div>
            {content && <ApprovalLayout
                content={content}
                onClose={props.onClose}
                initData={props.initData}
                review={props.review}
            />}
        </div>
    )
}