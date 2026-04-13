import React from "react";
import {
    ApprovalContext,
    ApprovalLayoutProps,
    approvalStore,
    createApprovalContext
} from "@coding-flow/flow-approval-presenter";
import {Provider} from "react-redux";
import {Header} from "@/components/flow-approval/layout/header";
import {Body} from "@/components/flow-approval/layout/body";
import {FlowApprovalApiImpl} from "@/components/flow-approval/model";
import {Footer} from "@/components/flow-approval/layout/footer";

const ApprovalLayoutScope: React.FC<ApprovalLayoutProps> = (props) => {
    const {context} = createApprovalContext(props, new FlowApprovalApiImpl());
    return (
        <ApprovalContext.Provider value={context}>
            <div
                className={props.className}
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Header/>
                <Body/>
                <Footer/>
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

