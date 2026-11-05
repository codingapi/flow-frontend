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

        expect(getProcessRecordSourceLabel(parentNode)).toEqual('主流程');
        expect(getProcessRecordSourceLabel(createSubProcessNode('WAITING', 'PROCESSING')))
            .toBeUndefined();
    });

    test('拒绝产生的记录展示为已拒绝，不展示为已审批', () => {
        // 拒绝记录与通过记录同为已办（approveState=PASS），需依赖 rejected 标记区分
        const node: ProcessNode = {
            id: '1',
            nodeId: 'node-b',
            nodeName: '审批节点',
            nodeType: 'APPROVAL',
            approveStrategy: 'SEQUENCE',
            approveState: 'PASS',
            rejected: true,
            operatorStrategy: 'OPERATOR_LIST',
            operators: [],
        };

        expect(getNodeStatus(node)).toEqual('rejected');
        expect(getNodeStatusLabel(node)).toEqual('已拒绝');
    });

    test('拒绝终止后结束节点展示为已终止', () => {
        const node: ProcessNode = {
            id: 'end',
            nodeId: 'end',
            nodeName: '结束节点',
            nodeType: 'END',
            approveStrategy: 'SEQUENCE',
            approveState: 'PASS',
            terminated: true,
            operatorStrategy: 'OPERATOR_LIST',
            operators: [],
        };

        expect(getNodeStatus(node)).toEqual('terminated');
        expect(getNodeStatusLabel(node)).toEqual('已终止');
    });

    test('审批通过时仍展示为已审批', () => {
        const node: ProcessNode = {
            id: '2',
            nodeId: 'node-b',
            nodeName: '审批节点',
            nodeType: 'APPROVAL',
            approveStrategy: 'SEQUENCE',
            approveState: 'PASS',
            operatorStrategy: 'OPERATOR_LIST',
            operators: [],
        };

        expect(getNodeStatus(node)).toEqual('completed');
        expect(getNodeStatusLabel(node)).toEqual('已审批');
    });

    test('主流程历史记录统一展示为已完成（对号）', () => {
        // 主流程子流程聚合节点即使处于 PROCESSING，在子流程视角也应展示为已完成，
        // 避免与子流程当前处理中的节点产生"两个运行中"的歧义
        const parentNode = {...createSubProcessNode('WAITING', 'PROCESSING'), parentProcessRecord: true};
        expect(getNodeStatus(parentNode)).toEqual('completed');
        expect(getNodeStatusLabel(parentNode)).toEqual('处理中');
        // 主流程异常记录仍展示错误状态
        const errorParentNode = {...createSubProcessNode('ERROR', 'ERROR'), parentProcessRecord: true};
        expect(getNodeStatus(errorParentNode)).toEqual('error');
    });
});
