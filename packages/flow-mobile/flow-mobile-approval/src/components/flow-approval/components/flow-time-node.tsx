import React from "react";
import {FlowApprovalOperator, ProcessNode} from "@coding-flow/flow-types";
import dayjs from "dayjs";

// 获取节点状态
export const getNodeStatus = (node: ProcessNode): 'finish' | 'process' | 'wait' | 'error' => {
    if (node.approveState === 'PASS') {
        return 'finish';
    }
    if (node.approveState === 'ERROR') {
        return 'error';
    }
    // 非历史节点，检查是否有审批人
    if (node.approveState === 'PROCESSING') {
        return 'process';
    }
    return 'wait';
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

export const getSubProcessInstanceTitle = (
    state: 'RUNNING' | 'FINISHED' | 'TERMINATED',
    index: number,
): string => {
    const stateLabel = state === 'RUNNING' ? '处理中' : state === 'FINISHED' ? '已完成' : '已终止';
    return `子流程 ${index + 1}：${stateLabel}`;
};

interface FlowOperatorItemProps {
    operator: FlowApprovalOperator;
    approveState: string;
}

export const FlowOperatorItem: React.FC<FlowOperatorItemProps> = (props) => {
    const operator = props.operator;
    const approveState = props.approveState;

    if (approveState === 'PASS') {
        return (
            <>
                <div  style={{fontSize: 12}}>
                    审批人: {operator.flowOperator.name}
                </div>
                {operator.approveTime > 0 && (
                    <div style={{fontSize: 12}}>
                        {dayjs(operator.approveTime).format('YYYY-MM-DD HH:mm:ss')}  {operator.actionName}
                    </div>
                )}
                {operator.advice && (
                    <div style={{
                        padding: 8,
                        backgroundColor: '#fafafa',
                        borderRadius: 4,
                        marginTop: 4
                    }}>
                        <div style={{fontSize: 12}}>
                            {operator.advice}
                        </div>
                    </div>
                )}
            </>
        )
    } else {
        return (
            <div style={{fontSize: 12}}>
                待审批人: {operator.flowOperator.name}
            </div>
        )
    }
}
