import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";


export const FlowApprovalTitle = ()=>{
    const {state} = useApprovalContext()

    return (
        <>
            {state.flow?.title || '审批详情'}
        </>
    )
}