import React from "react";
import {Header} from "@flow-engine/flow-mobile-ui";

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

    return (
        <div>
           <Header title={"流程详情"}/>
        </div>
    )
}