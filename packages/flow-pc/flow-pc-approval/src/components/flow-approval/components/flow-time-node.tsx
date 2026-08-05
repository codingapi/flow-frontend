import { CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, SyncOutlined } from "@ant-design/icons";
import { Space, Tag, Typography } from "antd";
import React from "react";
import {
    FlowApprovalOperator,
    ProcessNode,
    ProcessNodeSubProcessInstance,
} from "@coding-flow/flow-types";
import dayjs from "dayjs";
import styles from "./flow_time_node.module.scss";

const { Text } = Typography;

// 获取状态配置
export const getStatusConfig = (status: 'completed' | 'current' | 'pending' | 'error') => {
    switch (status) {
        case 'completed':
            return {
                color: 'success',
                label: '已审批',
                icon: <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
            };
        case 'current':
            return {
                color: 'processing',
                label: '待审批',
                icon: <SyncOutlined spin style={{ color: '#1890ff', fontSize: 16 }} />
            };
        case 'pending':
            return {
                color: 'default',
                label: '未执行',
                icon: <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: 16 }} />
            };
        case 'error':
            return {
                color: 'error',
                label: '执行异常',
                icon: <CloseCircleFilled />
            };
    }
};


// 获取节点状态
export const getNodeStatus = (node: ProcessNode): 'completed' | 'current' | 'pending' | 'error' => {
    if (node.approveState === 'PASS') {
        return 'completed';
    }
    if (node.approveState === 'ERROR') {
        return 'error';
    }
    // 非历史节点，检查是否有审批人
    if (node.approveState === 'PROCESSING') {
        return 'current';
    }
    return 'pending';
};

export const getSubProcessSummary = (node: ProcessNode): string | undefined => {
    const subProcess = node.subProcess;
    if (!subProcess) {
        return undefined;
    }
    const progress = `${subProcess.finishedCount}/${subProcess.totalCount}`;
    if (subProcess.state === 'PASSED') {
        return `子流程结果已确认（${progress}）`;
    }
    if (subProcess.state === 'ERROR') {
        return `子流程结果异常（${progress}）`;
    }
    return `子流程处理中（${progress}）`;
};

export const getNodeStatusLabel = (node: ProcessNode): string => {
    if (node.subProcess?.state === 'WAITING') {
        return '处理中';
    }
    if (node.subProcess?.state === 'PASSED') {
        return '已确认';
    }
    if (node.subProcess?.state === 'ERROR') {
        return '执行异常';
    }
    return getStatusConfig(getNodeStatus(node)).label;
};

export const getProcessRecordSourceLabel = (node: ProcessNode): string | undefined => (
    node.parentProcessRecord === true ? '主流程' : undefined
);

const getSubProcessInstanceTitle = (
    state: 'RUNNING' | 'FINISHED' | 'TERMINATED',
    index: number,
): string => {
    const stateLabel = state === 'RUNNING' ? '处理中' : state === 'FINISHED' ? '已完成' : '已终止';
    return `子流程 ${index + 1}：${stateLabel}`;
};

export const getSubProcessInstanceName = (
    instance: ProcessNodeSubProcessInstance,
    index: number,
): string => instance.workTitle?.trim() || `子流程 ${index + 1}`;


export const getOperatorTitle = (node: ProcessNode) => {
    const subProcessSummary = getSubProcessSummary(node);
    if (subProcessSummary) {
        return subProcessSummary;
    }
    const operatorStatregy = node.operatorStrategy;
    if (operatorStatregy === 'INITIATOR_SELECT') {
        return '发起人选择审批人';
    }
    if (operatorStatregy === 'APPROVER_SELECT') {
        return '审批人选择审批人';
    }
    if (operatorStatregy === 'NO_OPERATOR') {
        return node.nodeName;
    }
}

interface FlowTimeNodeProps {
    node: ProcessNode;
}


interface FlowOperatorItemProps {
    operator: FlowApprovalOperator;
    approveState: string;
}

const FlowOperatorItem: React.FC<FlowOperatorItemProps> = (props) => {
    const operator = props.operator;
    const approveState = props.approveState;

    if (approveState === 'PASS') {
        return (
            <>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    审批人: {operator.flowOperator.name}
                </Text>
                {operator.approveTime > 0 && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(operator.approveTime).format('YYYY-MM-DD HH:mm:ss')}  {operator.actionName}
                    </Text>
                )}
                {operator.advice && (
                    <div style={{
                        padding: 8,
                        backgroundColor: '#fafafa',
                        borderRadius: 4,
                        marginTop: 4
                    }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {operator.advice}
                        </Text>
                    </div>
                )}
            </>
        )
    } else {
        return (
            <Text type="secondary" style={{ fontSize: 12 }}>
                待审批人: {operator.flowOperator.name}
            </Text>
        )
    }
}

export const FlowTimeNode: React.FC<FlowTimeNodeProps> = (props) => {
    const node = props.node;
    const operators = node.operators || [];
    const operatorStatregy = node.operatorStrategy;
    const sourceLabel = getProcessRecordSourceLabel(node);
    if (operatorStatregy === 'INITIATOR_SELECT' || operatorStatregy === 'APPROVER_SELECT' || operatorStatregy === 'NO_OPERATOR') {
        return (
            <div className={styles.node}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: 14 }}>{node.nodeName}</Text>
                    {sourceLabel && (
                        <Tag color="blue" className={styles.sourceTag}>{sourceLabel}</Tag>
                    )}
                    <Tag color={getStatusConfig(getNodeStatus(node)).color} style={{ margin: 0 }}>
                        {getNodeStatusLabel(node)}
                    </Tag>

                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {getOperatorTitle(node)}
                </Text>
                {node.subProcess?.instances.map((instance, index) => (
                    <Text key={instance.processId} type="secondary">
                        {getSubProcessInstanceTitle(instance.state, index)} · {getSubProcessInstanceName(instance, index)}
                    </Text>
                ))}
            </div>
        )
    }

    return (
        <div className={styles.node}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                <Text strong style={{ fontSize: 14 }}>{node.nodeName} </Text>
                {sourceLabel && (
                    <Tag color="blue" className={styles.sourceTag}>{sourceLabel}</Tag>
                )}
                <Tag color={getStatusConfig(getNodeStatus(node)).color} style={{ margin: 0 }}>
                    {getNodeStatusLabel(node)}
                </Tag>
            </div>

            {operators.map(operator => {
                return (
                    <FlowOperatorItem
                        key={operator.flowOperator.id}
                        operator={operator}
                        approveState={node.approveState}
                    />
                )
            })}
        </div>
    )
}
