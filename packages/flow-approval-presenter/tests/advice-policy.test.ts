import { beforeEach, describe, expect, it, rs } from "@rstest/core";
import {
    AdvicePolicyManager,
    AdvicePolicyProvider,
    DEFAULT_ADVICE_MAX_LENGTH,
    mergeAdvicePolicy,
} from "@/interceptor/advice-policy";
import { FlowActionPresenter } from "@/presenters/action";
import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FlowAction, FormActionContext } from "@coding-flow/flow-types";

/** 构造一个最小可用的流程操作按钮对象 */
const buildAction = (id: string, type: 'PASS' | 'REJECT' | 'CUSTOM' = 'PASS'): FlowAction => ({
    id,
    title: id,
    type,
    display: 'BUTTON',
    enable: true,
} as unknown as FlowAction);

/** 构造审批状态 */
const buildState = (actions: FlowAction[], flow: Record<string, any> = {}): ApprovalState => ({
    flow: {
        recordId: 1,
        actions,
        mergeable: false,
        adviceRequired: false,
        adviceHidden: false,
        ...flow,
    },
} as unknown as ApprovalState);

/** 构造可观测调用情况的 API mock */
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

const buildPresenter = (actions: FlowAction[], flow: Record<string, any> = {}) => {
    return new FlowActionPresenter(
        buildState(actions, flow),
        buildApi(),
        new FormActionContext(),
        'mockKey',
        () => {},
    );
};

describe.sequential('mergeAdvicePolicy', () => {

    it('未提供宿主策略时沿用节点策略', () => {
        const policy = mergeAdvicePolicy({ hidden: false, required: true }, null);

        expect(policy.hidden).toBe(false);
        expect(policy.required).toBe(true);
        expect(policy.defaultContent).toBe('');
        expect(policy.templates).toEqual([]);
        expect(policy.maxLength).toBe(DEFAULT_ADVICE_MAX_LENGTH);
    });

    it('宿主策略优先于节点策略', () => {
        const policy = mergeAdvicePolicy(
            { hidden: false, required: true },
            { hidden: true, required: false },
        );

        expect(policy.hidden).toBe(true);
        expect(policy.required).toBe(false);
    });

    it('隐藏意见时必填恒为 false，避免无输入入口却被拦截', () => {
        const policy = mergeAdvicePolicy(
            { hidden: false, required: true },
            { hidden: true },
        );

        expect(policy.hidden).toBe(true);
        expect(policy.required).toBe(false);
    });

    it('模板去重并保持声明顺序，空值被过滤', () => {
        const policy = mergeAdvicePolicy({}, { templates: ['同意', '', '同意', '已阅'] });

        expect(policy.templates).toEqual(['同意', '已阅']);
    });

    it('maxLength 非法时回退默认值', () => {
        expect(mergeAdvicePolicy({}, { maxLength: 0 }).maxLength).toBe(DEFAULT_ADVICE_MAX_LENGTH);
        expect(mergeAdvicePolicy({}, { maxLength: -1 }).maxLength).toBe(DEFAULT_ADVICE_MAX_LENGTH);
        expect(mergeAdvicePolicy({}, { maxLength: 200 }).maxLength).toBe(200);
    });
});

describe.sequential('AdvicePolicyManager', () => {

    let manager: AdvicePolicyManager;

    beforeEach(() => {
        manager = new AdvicePolicyManager();
    });

    it('未订阅任何提供器时返回 null', async () => {
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toBeNull();
    });

    it('提供器返回策略时命中', async () => {
        manager.add(() => ({ hidden: true }));
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ hidden: true });
    });

    it('首个返回非 null 策略的提供器命中并短路', async () => {
        const second = rs.fn(() => ({ hidden: true }));
        manager.add(() => ({ defaultContent: '同意' }));
        manager.add(second);
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ defaultContent: '同意' });
        expect(second).not.toHaveBeenCalled();
    });

    it('异步提供器 resolve 策略后命中', async () => {
        manager.add(async () => {
            await Promise.resolve();
            return { templates: ['同意'] };
        });
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ templates: ['同意'] });
    });

    it('add 返回的函数可取消订阅', async () => {
        const unsubscribe = manager.add(() => ({ hidden: true }));
        expect(manager.size()).toBe(1);
        unsubscribe();
        expect(manager.size()).toBe(0);
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toBeNull();
    });

    it('remove 可移除指定提供器', () => {
        const provider: AdvicePolicyProvider = () => ({ hidden: true });
        manager.add(provider);
        manager.remove(provider);
        expect(manager.size()).toBe(0);
    });

    it('clear 清空全部提供器', () => {
        manager.add(() => ({ hidden: true }));
        manager.add(() => ({ templates: ['同意'] }));
        manager.clear();
        expect(manager.size()).toBe(0);
    });

    it('提供器接收到完整上下文', async () => {
        const action = buildAction('pass-1');
        const received = rs.fn(() => ({ hidden: true }));
        manager.add(received);
        await manager.resolve({ actionId: 'pass-1', action, flow: null });
        expect(received).toHaveBeenCalledWith({
            actionId: 'pass-1',
            action,
            flow: null,
        });
    });
});

describe.sequential('FlowActionPresenter 意见策略集成', () => {

    it('未订阅提供器时返回节点策略', async () => {
        const presenter = buildPresenter([buildAction('pass-1')], { adviceRequired: true });

        const policy = await presenter.resolveAdvicePolicy('pass-1');

        expect(policy.hidden).toBe(false);
        expect(policy.required).toBe(true);
    });

    it('按 actionType 命中策略', async () => {
        const presenter = buildPresenter([buildAction('reject-1', 'REJECT')]);
        presenter.addAdvicePolicyProvider(({ action }) => {
            if (action?.type === 'REJECT') {
                return { required: true, templates: ['材料不全'] };
            }
            return null;
        });

        const policy = await presenter.resolveAdvicePolicy('reject-1');

        expect(policy.required).toBe(true);
        expect(policy.templates).toEqual(['材料不全']);
    });

    it('通过动作隐藏意见并预填默认意见', async () => {
        const presenter = buildPresenter([buildAction('pass-1')], { adviceRequired: true });
        presenter.addAdvicePolicyProvider(({ action }) => {
            if (action?.type === 'PASS') {
                return { hidden: true, defaultContent: '同意' };
            }
            return null;
        });

        const policy = await presenter.resolveAdvicePolicy('pass-1');

        expect(policy.hidden).toBe(true);
        expect(policy.required).toBe(false);
        expect(policy.defaultContent).toBe('同意');
    });

    it('取消订阅后恢复节点策略', async () => {
        const presenter = buildPresenter([buildAction('pass-1')], { adviceHidden: true });
        const unsubscribe = presenter.addAdvicePolicyProvider(() => ({ hidden: false }));

        const hit = await presenter.resolveAdvicePolicy('pass-1');
        expect(hit.hidden).toBe(false);

        unsubscribe();
        const miss = await presenter.resolveAdvicePolicy('pass-1');
        expect(miss.hidden).toBe(true);
    });

    it('提供器上下文包含动作与流程内容', async () => {
        const action = buildAction('pass-1');
        const presenter = buildPresenter([action], { nodeType: 'START', adviceRequired: true });
        const received = rs.fn(() => ({ defaultContent: '同意' }));
        presenter.addAdvicePolicyProvider(received);

        await presenter.resolveAdvicePolicy('pass-1');

        expect(received).toHaveBeenCalledWith(expect.objectContaining({
            actionId: 'pass-1',
            action: expect.objectContaining({ id: 'pass-1', type: 'PASS' }),
            flow: expect.objectContaining({ nodeType: 'START' }),
        }));
    });
});
