import { describe, expect, it, rs } from "@rstest/core";
import { FlowActionPresenter } from "@/presenters/action";
import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FlowAction, FormActionContext } from "@coding-flow/flow-types";

/** 构造一个最小可用的流程操作按钮对象 */
const buildAction = (
    id: string,
    type: 'PASS' | 'REJECT' | 'CUSTOM' = 'PASS',
    triggerType?: string,
): FlowAction => ({
    id,
    title: id,
    type,
    display: 'BUTTON',
    enable: true,
    triggerType,
} as unknown as FlowAction);

/** 构造审批状态 */
const buildState = (actions: FlowAction[]): ApprovalState => ({
    flow: {
        recordId: 1,
        actions,
        mergeable: false,
    },
} as unknown as ApprovalState);

/** 构造可观测调用情况的 API mock */
const buildApi = (): FlowApprovalApi => ({
    create: rs.fn(async () => 100),
    processNodes: rs.fn(async () => []),
    action: rs.fn(async () => ({ success: true })),
    revoke: rs.fn(async () => ({ success: true })),
    urge: rs.fn(async () => ({ success: true })),
});

/** 注册一个业务表单，key 与审批表单视图保持一致 */
const registerForm = (context: FormActionContext, validate: () => Promise<unknown>) => {
    context.addAction({
        save: () => ({ amount: 100 }),
        key: () => 'view-form',
        validate,
    });
};

const buildPresenter = (
    actions: FlowAction[],
    formActionContext: FormActionContext,
    api: FlowApprovalApi = buildApi(),
) => new FlowActionPresenter(
    buildState(actions),
    api,
    formActionContext,
    'mockKey',
    () => {},
);

describe.sequential('FlowActionPresenter 表单预校验（issue-246）', () => {

    it('通过动作校验通过时返回 true', async () => {
        const formActionContext = new FormActionContext();
        const validate = rs.fn(async () => ({ amount: 100 }));
        registerForm(formActionContext, validate);
        const presenter = buildPresenter([buildAction('pass-1')], formActionContext);

        const result = await presenter.validateActionForm('pass-1');

        expect(result).toBe(true);
        expect(validate).toHaveBeenCalledTimes(1);
    });

    it('通过动作校验失败时返回 false，且不会触发提交', async () => {
        const formActionContext = new FormActionContext();
        registerForm(formActionContext, async () => {
            throw new Error('field required');
        });
        const api = buildApi();
        const presenter = buildPresenter([buildAction('pass-1')], formActionContext, api);

        const result = await presenter.validateActionForm('pass-1');

        expect(result).toBe(false);
        expect(api.action).not.toHaveBeenCalled();
    });

    it('非通过动作不校验业务表单，直接放行', async () => {
        const formActionContext = new FormActionContext();
        const validate = rs.fn(async () => {
            throw new Error('field required');
        });
        registerForm(formActionContext, validate);
        const presenter = buildPresenter([buildAction('reject-1', 'REJECT')], formActionContext);

        const result = await presenter.validateActionForm('reject-1');

        expect(result).toBe(true);
        expect(validate).not.toHaveBeenCalled();
    });

    it('triggerType 为 PASS 的自定义动作同样参与校验', async () => {
        const formActionContext = new FormActionContext();
        registerForm(formActionContext, async () => {
            throw new Error('field required');
        });
        const presenter = buildPresenter([buildAction('custom-1', 'CUSTOM', 'PASS')], formActionContext);

        const result = await presenter.validateActionForm('custom-1');

        expect(result).toBe(false);
    });

    it('未知动作无需校验，直接放行', async () => {
        const formActionContext = new FormActionContext();
        const validate = rs.fn(async () => ({ amount: 100 }));
        registerForm(formActionContext, validate);
        const presenter = buildPresenter([buildAction('pass-1')], formActionContext);

        const result = await presenter.validateActionForm('not-exists');

        expect(result).toBe(true);
        expect(validate).not.toHaveBeenCalled();
    });

    it('预校验通过后提交仍保留提交阶段校验', async () => {
        const formActionContext = new FormActionContext();
        const validate = rs.fn(async () => ({ amount: 100 }));
        registerForm(formActionContext, validate);
        const api = buildApi();
        const presenter = buildPresenter([buildAction('pass-1')], formActionContext, api);

        expect(await presenter.validateActionForm('pass-1')).toBe(true);
        await presenter.action('pass-1');

        expect(validate).toHaveBeenCalledTimes(2);
        expect(api.action).toHaveBeenCalledTimes(1);
    });
});
