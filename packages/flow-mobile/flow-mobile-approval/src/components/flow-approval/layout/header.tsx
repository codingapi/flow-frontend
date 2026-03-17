import {NavBar} from "antd-mobile";
import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {HEADER_HEIGHT} from "@/components/flow-approval/typings";

export const Header = ()=>{

    const {state, context} = useApprovalContext()

    return (
        <NavBar
            style={{
                height: HEADER_HEIGHT,
                borderBottom: '1px solid lightgray',
            }}
            onBack={()=>{
                context.close();
            }}
            right={false}
        >
            {state.flow?.title || '审批详情'}
        </NavBar>
    )
}