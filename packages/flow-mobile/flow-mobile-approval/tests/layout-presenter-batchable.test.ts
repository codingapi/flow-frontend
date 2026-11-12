import { describe, expect, it } from "@rstest/core";
import { LayoutPresenter } from "@/components/flow-approval/layout/presenter";
import type { ApprovalState } from "@coding-flow/flow-approval-presenter";
import type { FlowAction } from "@coding-flow/flow-types";

const passAction = { id: 'pass-1', type: 'PASS', batchable: true } as FlowAction;
const reduceAction = { id: 'reduce-1', type: 'REDUCE_AUDIT', batchable: false } as FlowAction;

/**
 * 构造审批状态。
 *
 * @param mergeable       节点是否开启记录合并策略（单条记录时也可能是 true）
 * @param todoCount       合并组内的流程记录数
 * @param singleRecordId  当前查看的单条流程记录id（为空表示仍在合并列表）
 */
const buildState = (mergeable: boolean, todoCount: number, singleRecordId?: number) => ({
    flow: {
        mergeable,
        todos: Array.from({ length: todoCount }, (_, index) => ({ recordId: index + 1 })),
        actions: [passAction, reduceAction],
        actionList: [passAction, reduceAction],
    },
    mergeSingleRecordId: singleRecordId,
} as unknown as ApprovalState);

const optionIds = (state: ApprovalState) => {
    return new LayoutPresenter(state).getFooterOptions().map(action => action.id);
};

describe.sequential('移动端合并审批动作批量能力', () => {

    it('多条流程合并成一条待办时，隐藏不支持批量的减签按钮', () => {
        expect(optionIds(buildState(true, 2))).toEqual(['pass-1']);
    });

    it('开启合并策略但只有一条流程记录时，减签按钮应正常展示', () => {
        // mergeable 只是策略开关，单条记录不存在批量语义
        expect(optionIds(buildState(true, 1))).toEqual(['pass-1', 'reduce-1']);
    });

    it('未开启记录合并时，减签按钮应正常展示', () => {
        expect(optionIds(buildState(false, 1))).toEqual(['pass-1', 'reduce-1']);
    });

    it('从合并列表进入单条流程后，减签按钮应正常展示', () => {
        expect(optionIds(buildState(true, 2, 1))).toEqual(['pass-1', 'reduce-1']);
    });
});
