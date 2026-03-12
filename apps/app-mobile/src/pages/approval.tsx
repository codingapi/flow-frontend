import React from "react";
import {ApprovalPanel} from "@flow-engine/flow-mobile-approval";
import { useLocation, useNavigate } from "react-router";

const ApprovalPage = ()=>{

    const location = useLocation();
    const workflowCode = location.state.workflowCode;
    const recordId = location.state.recordId;
    const review = location.state.review;
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    }

    return (
        <ApprovalPanel
            recordId={recordId}
            workflowCode={workflowCode}
            onClose={handleClose}
            review={review}
        />
    )
}

export default ApprovalPage