import React from "react";
import {BODY_HEIGHT} from "@/components/flow-approval/typings";
import {Tabs} from "antd-mobile";

export const Body = () => {

    return (
        <div
            style={{
                height: BODY_HEIGHT,
                overflowY: "auto",
            }}
        >
            <Tabs
                style={{
                    width: '100%',
                }}
            >
                <Tabs.Tab title="流程详情" key="detail">
                    流程详情
                </Tabs.Tab>
                <Tabs.Tab title="流程记录" key="history">
                    流程记录
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}