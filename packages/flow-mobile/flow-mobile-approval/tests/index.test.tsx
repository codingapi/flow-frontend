import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup} from "@testing-library/react";
import {ProcessNode, SubProcessState} from "@coding-flow/flow-types";
import {
    getNodeStatus,
    getProcessRecordSourceLabel,
    getSubProcessInstanceName,
    getSubProcessInstanceTitle,
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
        totalCount: 3,
        finishedCount: 2,
        state,
        createTime: 100,
        finishTime: state === 'WAITING' ? 0 : 200,
        instances: [],
    },
});

describe.sequential('移动端子流程节点记录展示', () => {

    afterEach(() => {
        // 清理每一次测试产生的数据
        cleanup();
    });

    test('展示子流程确认进度和实例状态', () => {
        const node = createSubProcessNode('PASSED', 'PASS');

        expect(getNodeStatus(node)).toEqual('finish');
        expect(getSubProcessSummary(node)).toEqual('子流程结果已确认（2/3）');
        expect(getSubProcessInstanceTitle('RUNNING', 0)).toEqual('子流程 1：处理中');
        expect(getSubProcessInstanceTitle('TERMINATED', 1)).toEqual('子流程 2：已终止');
    });

    test('子流程异常映射为步骤异常状态', () => {
        const node = createSubProcessNode('ERROR', 'ERROR');

        expect(getNodeStatus(node)).toEqual('error');
        expect(getSubProcessSummary(node)).toEqual('子流程结果异常（2/3）');
    });

    test('子流程实例优先展示流程名称并兼容历史数据', () => {
        expect(getSubProcessInstanceName({
            startRecordId: 1,
            processId: 'child-code',
            workTitle: '采购审批子流程',
            finishRecordId: 0,
            state: 'RUNNING',
            finishTime: 0,
        }, 0)).toEqual('采购审批子流程');
        expect(getSubProcessInstanceName({
            startRecordId: 2,
            processId: 'legacy-child-code',
            finishRecordId: 0,
            state: 'RUNNING',
            finishTime: 0,
        }, 1)).toEqual('子流程 2');
    });

    test('主流程历史节点展示来源标识', () => {
        const parentNode = {...createSubProcessNode('WAITING', 'PROCESSING'), parentProcessRecord: true};

        expect(getProcessRecordSourceLabel(parentNode)).toEqual('主流程');
        expect(getProcessRecordSourceLabel(createSubProcessNode('WAITING', 'PROCESSING')))
            .toBeUndefined();
    });

    test('主流程历史记录统一展示为已完成（对号）', () => {
        // 主流程子流程聚合节点即使处于 PROCESSING，在子流程视角也应展示为已完成，
        // 避免与子流程当前处理中的节点产生"两个运行中"的歧义
        const parentNode = {...createSubProcessNode('WAITING', 'PROCESSING'), parentProcessRecord: true};
        expect(getNodeStatus(parentNode)).toEqual('finish');
        // 主流程异常记录仍展示错误状态
        const errorParentNode = {...createSubProcessNode('ERROR', 'ERROR'), parentProcessRecord: true};
        expect(getNodeStatus(errorParentNode)).toEqual('error');
    });
});
