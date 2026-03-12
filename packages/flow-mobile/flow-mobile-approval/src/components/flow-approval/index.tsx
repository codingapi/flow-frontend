import React from "react";
import {detail} from "@/api/record";
import {FlowContent} from "@flow-engine/flow-types";
import {ApprovalLayout} from "@/components/flow-approval/layout";
import {useMockContext} from "@flow-engine/flow-approval-presenter";
import "./index.scss";

interface ApprovalPanelProps {
    // 流程设计编码
    workflowCode?: string;
    // 流程记录Id
    recordId?: string;
    // 关闭回掉
    onClose?: () => void;
    // 是否预览（当查看详情非审批时，设置为true）
    review?:boolean;
}

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
                review={props.review}
            />}
        </div>
    )
}