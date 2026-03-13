import React from "react";
import {Tabs} from "antd-mobile";
import {FormViewComponent} from "@/components/flow-approval/components/form-view-component";

interface BodyProps {
    height: string
}

export const Body:React.FC<BodyProps> = (props) => {

    const handleValuesChange = (values:any) => {

    }

    return (
        <div
            style={{
                height: props.height,
                overflowY: "auto",
            }}
        >
            <Tabs
                style={{
                    width: '100%',
                }}
            >
                <Tabs.Tab title="流程详情" key="detail">
                    <FormViewComponent onValuesChange={handleValuesChange}/>
                </Tabs.Tab>
                <Tabs.Tab title="流程记录" key="history">
                    流程记录
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}