import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {ProcessNode} from "@coding-flow/flow-types";
import {Empty, Timeline} from "antd";
import {FlowTimeNode, getNodeStatus, getStatusConfig} from "@/components/flow-approval/components/flow-time-node";


export interface FlowNodeHistoryAction {
    refresh: () => void;
}

interface FlowNodeHistoryProps {
    actionRef?: React.Ref<FlowNodeHistoryAction>;
}


export const FlowNodeHistory: React.FC<FlowNodeHistoryProps> = (props) => {
    const {context} = useApprovalContext();
    const [processNodes, setProcessNodes] = React.useState<ProcessNode[]>([]);

    const triggerProcessNodes = () => {
        context.getPresenter().processNodes().then(nodes => {
            setProcessNodes(nodes);
        });
    }

    React.useEffect(() => {
        setTimeout(() => {
            triggerProcessNodes();
        }, 100);
    }, []);

    React.useImperativeHandle(props.actionRef, () => {
        return {
            refresh: () => {
                triggerProcessNodes();
            }
        }
    }, []);

    return (
        <>
            {processNodes.length > 0 ? (
                <Timeline items={processNodes.map(node => ({
                    icon: getStatusConfig(getNodeStatus(node)).icon,
                    content: (
                        <FlowTimeNode node={node}/>
                    )
                }))}/>
            ) : (
                <Empty description="暂无审批流程记录"/>
            )}
        </>
    )
}