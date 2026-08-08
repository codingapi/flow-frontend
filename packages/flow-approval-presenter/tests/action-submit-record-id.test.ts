import { describe, expect, it, rs } from "@rstest/core";
import { FlowActionPresenter } from "@/presenters/action";
import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FlowAction, FormActionContext } from "@coding-flow/flow-types";

const buildAction = (id: string, type: 'PASS' | 'REJECT' | 'CUSTOM' = 'PASS'): FlowAction => ({
    id,
    title: id,
    type,
    display: 'BUTTON',
    enable: true,
} as FlowAction);

/** 发起流程时的状态：无 recordId */
const buildStartState = (actions: FlowAction[]): ApprovalState => ({
    flow: {
        recordId: undefined,
        actions,
        mergeable: false,
    },
} as unknown as ApprovalState);

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

describe.sequential('FlowActionPresenter 发起流程提交（issue-195 双待办回归）', () => {

    it('create 后 syncState 覆盖内部快照，再次提交不应重复 create', async () => {
        const action = buildAction('pass-1');
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildStartState([action]),
            api,
            new FormActionContext(),
            'mockKey',
            () => {},
        );

        // 第一次提交（发起流程）：create + action（无选人，后端返回选人提示）
        await presenter.action('pass-1');
        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.action).toHaveBeenCalledTimes(1);

        // 模拟 Redux state 变化触发的 syncState：用未含 recordId 的状态覆盖内部快照
        presenter.syncState(buildStartState([action]));

        // 第二次提交（选人后）：应直接走 action，不再 create
        await presenter.action('pass-1', { operatorSelectMap: { 'node-b': [1, 2] } });

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.action).toHaveBeenCalledTimes(2);
        // 第二次 action 请求携带首次 create 的记录 ID 与选人信息
        const secondRequest = api.action.mock.calls[1][0];
        expect(secondRequest.recordId).toBe(100);
        expect(secondRequest.advice.operatorSelectMap).toEqual({ 'node-b': [1, 2] });
    });

    it('无 syncState 覆盖时，create 后再次提交同样不重复 create', async () => {
        const action = buildAction('pass-1');
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildStartState([action]),
            api,
            new FormActionContext(),
            'mockKey',
            () => {},
        );

        await presenter.action('pass-1');
        await presenter.action('pass-1', { operatorSelectMap: { 'node-b': [1] } });

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.action).toHaveBeenCalledTimes(2);
    });
});