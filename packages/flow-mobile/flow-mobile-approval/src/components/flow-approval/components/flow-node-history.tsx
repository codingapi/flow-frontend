import React from "react";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {ProcessNode} from "@flow-engine/flow-types";
import {Empty, Steps} from "antd-mobile";
import {FlowOperatorItem, getNodeStatus} from "@/components/flow-approval/components/flow-time-node";

const {Step} = Steps;

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
                <Steps
                    direction="vertical"
                >
                    {processNodes.map(node => {
                        const operators = node.operators
                        return (
                            <Step
                                title={node.nodeName}
                                description={(
                                    <>
                                        {operators.map(operator => {
                                            return (
                                                <FlowOperatorItem operator={operator} state={node.state}/>
                                            )
                                        })}
                                    </>
                                )}
                                status={getNodeStatus(node)}
                            />
                        )
                    })}
                </Steps>
            ) : (
                <Empty description="暂无审批流程记录"/>
            )}
        </>
    )
}