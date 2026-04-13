import {FormViewComponent} from "@/components/flow-approval/components/form-view-component";
import {FlowNodeHistory, FlowNodeHistoryAction} from "@/components/flow-approval/components/flow-node-history";
import React from "react";
import {Tabs} from "antd-mobile";


export const FlowApprovalContent = () => {

    const flowNodeHistoryAction = React.useRef<FlowNodeHistoryAction>(null);

    return (
        <Tabs
            style={{
                width: '100%',
            }}
            onChange={(key) => {
                if (key === "history") {
                    flowNodeHistoryAction.current?.refresh();
                }
            }}
        >
            <Tabs.Tab title="流程详情" key="detail">
                <FormViewComponent/>
            </Tabs.Tab>
            <Tabs.Tab title="流程记录" key="history">
                <FlowNodeHistory actionRef={flowNodeHistoryAction}/>
            </Tabs.Tab>
        </Tabs>
    )
}