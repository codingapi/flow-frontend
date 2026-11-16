import { describe, expect, it } from "@rstest/core";
import { FlowContent, NodeOption } from "@coding-flow/flow-types";
import { buildReturnNodeOptions } from "@/utils/return-nodes";

/** 构造最小可用的节点选项 */
const buildNode = (id: string, name: string, display = true): NodeOption => ({
    id,
    name,
    type: 'APPROVAL',
    display,
} as NodeOption);

/** 构造仅包含退回相关字段的流程详情 */
const buildFlow = (data: Partial<FlowContent>): FlowContent => ({
    nodeId: 'C',
    nodes: [buildNode('A', '开始节点'), buildNode('B', 'B审批'), buildNode('C', 'C审批'), buildNode('D', '结束节点')],
    ...data,
} as FlowContent);

describe('buildReturnNodeOptions（退回候选节点）', () => {
    it('优先使用后端 backNodes，并按最近优先顺序输出', () => {
        const flow = buildFlow({
            backNodes: [buildNode('B', 'B审批'), buildNode('A', '开始节点')],
        });
        expect(buildReturnNodeOptions(flow)).toEqual([
            {label: 'B审批', value: 'B'},
            {label: '开始节点', value: 'A'},
        ]);
    });

    it('backNodes 为空数组时表示没有可退回节点，不再按 nodes 截取', () => {
        const flow = buildFlow({backNodes: []});
        expect(buildReturnNodeOptions(flow)).toEqual([]);
    });

    it('旧版后端缺失 backNodes 时回退到按定义顺序截取到当前节点', () => {
        const flow = buildFlow({});
        expect(buildReturnNodeOptions(flow)).toEqual([
            {label: '开始节点', value: 'A'},
            {label: 'B审批', value: 'B'},
        ]);
    });

    it('回退逻辑仍会跳过硬编码 display=false 的节点', () => {
        const flow = buildFlow({
            nodes: [buildNode('A', '开始节点'), buildNode('X', '隐藏节点', false), buildNode('C', 'C审批')],
            nodeId: 'C',
        });
        expect(buildReturnNodeOptions(flow)).toEqual([{label: '开始节点', value: 'A'}]);
    });

    it('流程内容为空时返回空列表', () => {
        expect(buildReturnNodeOptions(undefined)).toEqual([]);
    });
});
