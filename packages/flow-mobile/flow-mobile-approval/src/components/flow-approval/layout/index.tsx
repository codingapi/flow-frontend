import React from "react";
import {ApprovalLayoutProps} from "@flow-engine/flow-approval-presenter";
import {Provider} from "react-redux";
import {approvalStore} from "@flow-engine/flow-approval-presenter";
import {ApprovalContext} from "@flow-engine/flow-approval-presenter";
import {createApprovalContext} from "@flow-engine/flow-approval-presenter";
import {Header} from "./header";
import {Body} from "./body";
import {Footer} from "@/components/flow-approval/layout/footer";

const ApprovalLayoutScope: React.FC<ApprovalLayoutProps> = (props) => {
    const {context} = createApprovalContext(props);
    return (
        <ApprovalContext.Provider value={context}>
            <div
                style={{
                    margin:0,
                    padding: 0,
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

