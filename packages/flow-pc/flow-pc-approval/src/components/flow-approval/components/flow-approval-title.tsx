import React from "react";
import {Typography} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

const {Title} = Typography;

export const FlowApprovalTitle = ()=>{
    const {state} = useApprovalContext()
    return (
        <Title level={4} style={{fontSize: 16, fontWeight: 500}}>
            {state.flow?.title || '审批详情'}
        </Title>
    )
}