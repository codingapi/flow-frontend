import React from "react";
import {ApprovalLayoutProps} from "@coding-flow/flow-approval-presenter";
import {Provider} from "react-redux";
import {approvalStore} from "@coding-flow/flow-approval-presenter";
import {ApprovalContext} from "@coding-flow/flow-approval-presenter";
import {createApprovalContext} from "@coding-flow/flow-approval-presenter";
import {Header} from "@/components/flow-approval/layout/header";
import {Body} from "@/components/flow-approval/layout/body";

const ApprovalLayoutScope: React.FC<ApprovalLayoutProps> = (props) => {
    const {context} = createApprovalContext(props);
    return (
        <ApprovalContext.Provider value={context}>
            <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <Header/>
                <Body/>
            </div>
        </ApprovalContext.Provider>
    )
}

export const ApprovalLayout: React.FC<ApprovalLayoutProps> = (props) => {
    return (
        <Provider store={approvalStore}>
            <ApprovalLayoutScope {...props}/>
        </Provider>
    )
}

