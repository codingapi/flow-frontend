import React from "react";
import {
    ApprovalContext,
    ApprovalLayoutProps,
    approvalStore,
    createApprovalContext
} from "@coding-flow/flow-approval-presenter";
import {Provider} from "react-redux";
import {BODY_HEIGHT, BODY_MAX_HEIGHT} from "@/components/flow-approval/typings";
import {Header} from "./header";
import {Body} from "./body";
import {Footer} from "./footer";
import {useLayoutPresenter} from "@/components/flow-approval/layout/hooks/use-layout-presenter";

const ApprovalContent = ()=>{

    const presenter = useLayoutPresenter();

    const hasFooter = presenter.hasFooter();

    return (
        <>
            <Body height={hasFooter?BODY_HEIGHT:BODY_MAX_HEIGHT}/>
            {hasFooter && <Footer/>}
        </>
    )
}

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
                <ApprovalContent/>
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

