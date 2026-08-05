import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {ProcessNode} from "@coding-flow/flow-types";
import {Empty, Steps} from "antd-mobile";
import {
    FlowOperatorItem,
    getNodeStatus,
    getProcessRecordSourceLabel,
    getSubProcessInstanceName,
    getSubProcessInstanceTitle,
    getSubProcessSummary,
} from "@/components/flow-approval/components/flow-time-node";
import styles from "./flow_node_history.module.scss";

const {Step} = Steps;

export interface FlowNodeHistoryAction {
    refresh: () => void;
}

interface FlowNodeHistoryProps {
    actionRef?: React.Ref<FlowNodeHistoryAction>;
}


export const getOperatorTitle = (node: ProcessNode)=>{
    const operatorStatregy = node.operatorStrategy;
    if(operatorStatregy === 'INITIATOR_SELECT') {
        return '发起人选择审批人';
    }
    if(operatorStatregy === 'APPROVER_SELECT') {
        return '审批人选择审批人';
    }
    if(operatorStatregy === 'NO_OPERATOR') {
        return node.nodeName;
    }
}

const getNodeTitle = (node: ProcessNode): React.ReactNode => {
    const sourceLabel = getProcessRecordSourceLabel(node);
    return (
        <span className={styles.nodeTitle}>
            <span>{node.nodeName}</span>
            {sourceLabel && <span className={styles.sourceTag}>{sourceLabel}</span>}
        </span>
    );
};

const getDescriptionClassName = (node: ProcessNode): string | undefined => (
    node.parentProcessRecord ? styles.parentProcessRecord : undefined
);

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
                        const operators = node.operators || [];
                        const operatorStatregy = node.operatorStrategy;
                        if (node.subProcess) {
                            return (
                                <Step
                                    key={node.id}
                                    title={getNodeTitle(node)}
                                    description={(
                                        <div className={getDescriptionClassName(node)}>
                                            <div>{getSubProcessSummary(node)}</div>
                                            {node.subProcess.instances.map((instance, index) => (
                                                <div key={instance.processId}>
                                                    {getSubProcessInstanceTitle(instance.state, index)} · {getSubProcessInstanceName(instance, index)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    status={getNodeStatus(node)}
                                />
                            );
                        }
                        if(operatorStatregy === 'INITIATOR_SELECT' || operatorStatregy === 'APPROVER_SELECT' || operatorStatregy === 'NO_OPERATOR') {
                            return (
                                <Step
                                    key={node.id}
                                    title={getNodeTitle(node)}
                                    description={(
                                        <div className={getDescriptionClassName(node)}>
                                            {getOperatorTitle(node)}
                                        </div>
                                    )}
                                    status={getNodeStatus(node)}
                                />
                            )
                        }
                        return (
                            <Step
                                key={node.id}
                                title={getNodeTitle(node)}
                                description={(
                                    <div className={getDescriptionClassName(node)}>
                                        {operators.map(operator => {
                                            return (
                                                <FlowOperatorItem operator={operator} approveState={node.approveState}/>
                                            )
                                        })}
                                    </div>
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
