import { describe, expect, it, rs } from "@rstest/core";
import { FlowActionPresenter } from "@/presenters/action";
import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FormActionContext } from "@coding-flow/flow-types";

/** 已完成的流程记录详情：仅用于验证二次发起的请求参数 */
const buildFinishedState = (): ApprovalState => ({
    flow: {
        recordId: 88,
        reissue: true,
    },
} as unknown as ApprovalState);

interface ReissueMock {
    mock: { calls: any[][] };
}

const buildApi = () => {
    const api: FlowApprovalApi = {
        create: rs.fn(async () => 100),
        processNodes: rs.fn(async () => []),
        action: rs.fn(async () => ({ success: true })),
        revoke: rs.fn(async () => ({ success: true })),
        urge: rs.fn(async () => ({ success: true })),
        resetSubProcess: rs.fn(async () => ({ success: true })),
        reissue: rs.fn(async () => ({ success: true, data: 99 })),
    };
    return api;
};

describe('FlowActionPresenter 二次发起（reissue）', () => {

    it('以当前详情记录作为源记录调用二次发起接口', async () => {
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildFinishedState(),
            api,
            new FormActionContext(),
            'mockKey',
            () => {},
        );

        const res = await presenter.reissue('业务数据有误，重新发起');

        const reissueMock = api.reissue as unknown as ReissueMock;
        expect(reissueMock.mock.calls.length).toBe(1);
        const [body, mockKey] = reissueMock.mock.calls[0];
        expect(body.sourceRecordId).toBe(88);
        expect(body.advice).toBe('业务数据有误，重新发起');
        expect(mockKey).toBe('mockKey');
        expect(res.success).toBe(true);
        expect(res.data).toBe(99);
    });

    it('未提供数据时只提交源记录 id，由服务端复制源流程表单数据', async () => {
        const api = buildApi();
        const presenter = new FlowActionPresenter(
            buildFinishedState(),
            api,
            new FormActionContext(),
            'mockKey',
            () => {},
        );

        await presenter.reissue();

        const body = (api.reissue as unknown as ReissueMock).mock.calls[0][0];
        expect(body.sourceRecordId).toBe(88);
        expect(body.advice).toBeUndefined();
        expect(body.formData).toBeUndefined();
    });
});
