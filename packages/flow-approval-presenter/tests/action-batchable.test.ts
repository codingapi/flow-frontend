import { describe, expect, it, rs } from "@rstest/core";
import { FlowActionPresenter } from "@/presenters/action";
import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FlowAction, FormActionContext } from "@coding-flow/flow-types";

const buildAction = (id: string, type: FlowAction['type'], batchable?: boolean): FlowAction => ({
    id,
    title: id,
    type,
    display: 'BUTTON',
    enable: true,
    batchable,
} as FlowAction);

/** 合并审批状态：当前详情记录为 1，合并组内还有记录 2 */
const buildMergeState = (actions: FlowAction[]): ApprovalState => ({
    flow: {
        recordId: 1,
        mergeable: true,
        actions,
        todos: [
            { recordId: 1, data: { name: 'a' } },
            { recordId: 2, data: { name: 'b' } },
        ],
    },
} as unknown as ApprovalState);

/** 表单上下文固定返回记录 2 的数据，用于验证非批量动作仍提交当前详情记录 */
const buildFormContext = () => {
    const formContext = new FormActionContext();
    formContext.addAction({
        save: () => ({ recordId: 2, name: 'b' }),
        key: () => 'view-form',
        validate: async () => ({ recordId: 2, name: 'b' }),
    });
    return formContext;
};

const buildApi = () => {
    const api: FlowApprovalApi = {
        create: rs.fn(async () => 100),
        processNodes: rs.fn(async () => []),
        action: rs.fn(async () => ({ success: true })),
        revoke: rs.fn(async () => ({ success: true })),
        urge: rs.fn(async () => ({ success: true })),
    };
    return api;
};

describe.sequential('FlowActionPresenter 合并批量提交（batchable）', () => {

    it('支持批量的动作按勾选记录逐条提交', async () => {
        const passAction = buildAction('pass-1', 'PASS');
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildMergeState([passAction]),
            api,
            buildFormContext(),
            'mockKey',
            () => {},
        );
        presenter.setSubmitRecordIds([1, 2]);

        await presenter.action('pass-1');

        expect(api.action).toHaveBeenCalledTimes(2);
        const recordIds = api.action.mock.calls.map((call) => call[0].recordId);
        expect(recordIds).toEqual([1, 2]);
        // 提交完成后清空勾选，避免下一次动作重复提交
        expect(presenter.getSubmitRecordIds()).toEqual([]);
    });

    it('不支持批量的动作（减签）只提交当前详情记录，忽略合并勾选', async () => {
        const reduceAction = buildAction('reduce-1', 'REDUCE_AUDIT', false);
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildMergeState([reduceAction]),
            api,
            buildFormContext(),
            'mockKey',
            () => {},
        );
        presenter.setSubmitRecordIds([1, 2]);

        await presenter.action('reduce-1', { forwardOperatorIds: [3] });

        expect(presenter.isBatchable('reduce-1')).toBe(false);
        expect(api.action).toHaveBeenCalledTimes(1);
        const request = api.action.mock.calls[0][0];
        // 表单上下文返回的是记录 2，但非批量动作必须强制提交当前详情记录 1
        expect(request.recordId).toBe(1);
        expect(request.advice.forwardOperatorIds).toEqual([3]);
        // 勾选记录保持不变，用户仍可用于通过等其他批量动作
        expect(presenter.getSubmitRecordIds()).toEqual([1, 2]);
    });

    it('缺少 batchable 标记时按支持批量处理（兼容旧服务端）', () => {
        const passAction = buildAction('pass-1', 'PASS');
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildMergeState([passAction]),
            api,
            buildFormContext(),
            'mockKey',
            () => {},
        );

        expect(presenter.isBatchable('pass-1')).toBe(true);
        expect(presenter.isBatchable('unknown')).toBe(true);
    });
});
