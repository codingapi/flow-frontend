import React from "react";
import {FlowApprovalOperator, ProcessNode} from "@flow-engine/flow-types";
import dayjs from "dayjs";

// 获取节点状态
export const getNodeStatus = (node: ProcessNode): 'finish' | 'process' | 'wait' => {
    if (node.state === -1) {
        return 'finish';
    }
    // 非历史节点，检查是否有审批人
    if (node.state === 0) {
        return 'process';
    }
    return 'wait';
};

interface FlowOperatorItemProps {
    operator: FlowApprovalOperator;
    state: number;
}

export const FlowOperatorItem: React.FC<FlowOperatorItemProps> = (props) => {
    const operator = props.operator;
    const state = props.state;

    if (state === -1) {
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
