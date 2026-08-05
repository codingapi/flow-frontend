import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup} from "@testing-library/react";
import {ProcessNode, SubProcessState} from "@coding-flow/flow-types";
import {
    getNodeStatus,
    getNodeStatusLabel,
    getSubProcessSummary,
} from "@/components/flow-approval/components/flow-time-node";

const createSubProcessNode = (
    state: SubProcessState,
    approveState: ProcessNode['approveState'],
): ProcessNode => ({
    id: 'sub-process:1',
    nodeId: 'sub-node',
    nodeName: '子流程',
    nodeType: 'SUB_PROCESS',
    approveStrategy: 'SEQUENCE',
    approveState,
    operatorStrategy: 'NO_OPERATOR',
    operators: [],
    subProcess: {
        recordId: 1,
        groupId: 'group-1',
        parentRecordId: 10,
        totalCount: 2,
        finishedCount: 1,
        state,
        createTime: 100,
        finishTime: state === 'WAITING' ? 0 : 200,
        instances: [
            {
                startRecordId: 11,
                processId: 'child-1',
                finishRecordId: 21,
                state: 'FINISHED',
                finishTime: 150,
            },
            {
                startRecordId: 12,
                processId: 'child-2',
                finishRecordId: 0,
                state: 'RUNNING',
                finishTime: 0,
            },
        ],
    },
});

describe.sequential('子流程节点记录展示', () => {

    afterEach(() => {
        // 清理每一次测试产生的数据
        cleanup();
    });

    test('等待子流程时展示处理进度', () => {
        const node = createSubProcessNode('WAITING', 'PROCESSING');

        expect(getNodeStatus(node)).toEqual('current');
        expect(getNodeStatusLabel(node)).toEqual('处理中');
        expect(getSubProcessSummary(node)).toEqual('子流程处理中（1/2）');
    });

    test('子流程结果异常时展示异常状态', () => {
        const node = createSubProcessNode('ERROR', 'ERROR');

        expect(getNodeStatus(node)).toEqual('error');
        expect(getNodeStatusLabel(node)).toEqual('执行异常');
        expect(getSubProcessSummary(node)).toEqual('子流程结果异常（1/2）');
    });
});
