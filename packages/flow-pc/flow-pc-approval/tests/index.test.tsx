import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup} from "@testing-library/react";
import {ProcessNode, SubProcessState} from "@coding-flow/flow-types";
import {
    getNodeStatus,
    getNodeStatusLabel,
    getProcessRecordSourceLabel,
    getSubProcessInstanceName,
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
                workTitle: '请假子流程',
                finishRecordId: 21,
                state: 'FINISHED',
                finishTime: 150,
            },
            {
                startRecordId: 12,
                processId: 'child-2',
                workTitle: '报销子流程',
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

    test('子流程实例优先展示流程名称并兼容历史数据', () => {
        const node = createSubProcessNode('WAITING', 'PROCESSING');
        const instances = node.subProcess!.instances;

        expect(getSubProcessInstanceName(instances[0], 0)).toEqual('请假子流程');
        expect(getSubProcessInstanceName({...instances[1], workTitle: undefined}, 1))
            .toEqual('子流程 2');
    });

    test('主流程历史节点展示来源标识', () => {
        const parentNode = {...createSubProcessNode('WAITING', 'PROCESSING'), parentProcessRecord: true};

        expect(getProcessRecordSourceLabel(parentNode)).toEqual('主流程记录');
        expect(getProcessRecordSourceLabel(createSubProcessNode('WAITING', 'PROCESSING')))
            .toBeUndefined();
    });
});
