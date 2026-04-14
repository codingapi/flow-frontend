import React, {useState} from "react";
import {FlowNodeHistory, FlowNodeHistoryAction} from "@/components/flow-approval/components/flow-node-history";
import {ApprovalSidebarCollapsedWidth, ApprovalSidebarWidth,} from "@/components/flow-approval/typings";
import {Button, Flex, Layout, Typography} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {APPROVAL_BODY_SIDER_VIEW_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

const {Sider} = Layout;
const {Title} = Typography;

interface FlowApprovalSiderProps {
    flowNodeHistoryAction: React.RefObject<FlowNodeHistoryAction>;
}

export const FlowApprovalSider: React.FC<FlowApprovalSiderProps> = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const flowNodeHistoryAction = props.flowNodeHistoryAction;

    const FlowApprovalSiderView = ViewBindPlugin.getInstance().get(APPROVAL_BODY_SIDER_VIEW_KEY);

    if (FlowApprovalSiderView) {
        return (
            <FlowApprovalSiderView
                {...props}
            />
        )
    }

    return (
        <Sider
            width={ApprovalSidebarWidth}
            collapsedWidth={ApprovalSidebarCollapsedWidth}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            style={{
                marginLeft: "8px",
                backgroundColor: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
            }}
        >
            {!collapsed && (
                <Flex vertical style={{height: '100%'}}>
                    <Flex
                        justify="space-between"
                        align="center"
                        style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: '#fafafa'
                        }}
                    >
                        <Title level={5} style={{margin: 0, fontSize: 15}}>流程记录</Title>
                        <Button
                            type="text"
                            size="small"
                            icon={<LeftOutlined style={{fontSize: 12}}/>}
                            onClick={() => setCollapsed(true)}
                            style={{color: '#8c8c8c'}}
                        />
                    </Flex>
                    <div style={{padding: 16, flex: 1, overflow: 'auto'}}>
                        <FlowNodeHistory actionRef={flowNodeHistoryAction}/>
                    </div>
                </Flex>
            )}
            {collapsed && (
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    gap={16}
                    style={{height: '100%', padding: '12px 8px', backgroundColor: '#fafafa'}}
                >
                    <Button
                        type="text"
                        size="small"
                        icon={<RightOutlined style={{fontSize: 12}}/>}
                        onClick={() => setCollapsed(false)}
                        style={{color: '#8c8c8c'}}
                    />
                    <div style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        letterSpacing: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#595959',
                    }}>
                        流程记录
                    </div>
                </Flex>
            )}
        </Sider>
    )
}