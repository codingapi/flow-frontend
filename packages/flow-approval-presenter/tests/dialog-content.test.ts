import { beforeEach, describe, expect, it, rs } from "@rstest/core";
import { DialogContentManager, DialogContentProvider } from "@/interceptor/dialog-content";
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
} as FlowAction);

/** 构造审批状态 */
const buildState = (actions: FlowAction[]): ApprovalState => ({
    flow: {
        recordId: 1,
        actions,
        mergeable: false,
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

const buildPresenter = (actions: FlowAction[], setLoading = () => {}) => {
    return new FlowActionPresenter(
        buildState(actions),
        buildApi(),
        new FormActionContext(),
        'mockKey',
        setLoading,
    );
};

describe.sequential('DialogContentManager', () => {

    let manager: DialogContentManager;

    beforeEach(() => {
        manager = new DialogContentManager();
    });

    it('未订阅任何提供器时返回 null', async () => {
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toBeNull();
    });

    it('提供器返回内容时命中', async () => {
        manager.add(() => ({ title: '确认通过？' }));
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ title: '确认通过？' });
    });

    it('提供器返回 null 时继续查找下一个', async () => {
        manager.add(() => null);
        manager.add(() => ({ content: '确认文案' }));
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ content: '确认文案' });
    });

    it('首个返回非 null 内容的提供器命中并短路', async () => {
        const second = rs.fn(() => ({ title: '不应命中' }));
        manager.add(() => ({ title: '命中' }));
        manager.add(second);
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ title: '命中' });
        expect(second).not.toHaveBeenCalled();
    });

    it('异步提供器 resolve 内容后命中', async () => {
        manager.add(async () => {
            await Promise.resolve();
            return { title: '异步命中' };
        });
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toEqual({ title: '异步命中' });
    });

    it('add 返回的函数可取消订阅', async () => {
        const unsubscribe = manager.add(() => ({ title: '确认' }));
        expect(manager.size()).toBe(1);
        unsubscribe();
        expect(manager.size()).toBe(0);
        const result = await manager.resolve({ actionId: 'a', action: null });
        expect(result).toBeNull();
    });

    it('remove 可移除指定提供器', () => {
        const provider: DialogContentProvider = () => ({ title: '确认' });
        manager.add(provider);
        manager.remove(provider);
        expect(manager.size()).toBe(0);
    });

    it('clear 清空全部提供器', () => {
        manager.add(() => ({ title: '确认' }));
        manager.add(() => ({ content: '文案' }));
        manager.clear();
        expect(manager.size()).toBe(0);
    });

    it('提供器接收到完整上下文', async () => {
        const action = buildAction('pass-1');
        const received = rs.fn(() => ({ title: '确认' }));
        manager.add(received);
        await manager.resolve({ actionId: 'pass-1', action });
        expect(received).toHaveBeenCalledWith({
            actionId: 'pass-1',
            action,
        });
    });
});

describe.sequential('FlowActionPresenter 弹框内容集成', () => {

    it('未订阅提供器时返回 null', async () => {
        const presenter = buildPresenter([buildAction('pass-1')]);

        const result = await presenter.resolveDialogContent('pass-1');

        expect(result).toBeNull();
    });

    it('按 actionId 命中的提供器返回内容', async () => {
        const action = buildAction('custom-1', 'CUSTOM');
        const presenter = buildPresenter([action]);
        presenter.addDialogContentProvider(({ actionId }) => {
            if (actionId === 'custom-1') {
                return { title: '确认自定义审批？', content: '提交后不可撤回' };
            }
            return null;
        });

        const result = await presenter.resolveDialogContent('custom-1');

        expect(result).toEqual({ title: '确认自定义审批？', content: '提交后不可撤回' });
    });

    it('按 actionType 命中的提供器返回内容', async () => {
        const presenter = buildPresenter([buildAction('reject-1', 'REJECT')]);
        presenter.addDialogContentProvider(({ action }) => {
            if (action?.type === 'REJECT') {
                return { title: '确认驳回？' };
            }
            return null;
        });

        const result = await presenter.resolveDialogContent('reject-1');

        expect(result).toEqual({ title: '确认驳回？' });
    });

    it('未命中任何提供器时返回 null', async () => {
        const presenter = buildPresenter([buildAction('pass-1')]);
        presenter.addDialogContentProvider(() => null);

        const result = await presenter.resolveDialogContent('pass-1');

        expect(result).toBeNull();
    });

    it('取消订阅后恢复正常（返回 null）', async () => {
        const presenter = buildPresenter([buildAction('pass-1')]);
        const unsubscribe = presenter.addDialogContentProvider(() => ({ title: '确认通过？' }));

        const hit = await presenter.resolveDialogContent('pass-1');
        expect(hit).toEqual({ title: '确认通过？' });

        unsubscribe();
        const miss = await presenter.resolveDialogContent('pass-1');
        expect(miss).toBeNull();
    });

    it('removeDialogContentProvider 移除后恢复正常（返回 null）', async () => {
        const presenter = buildPresenter([buildAction('pass-1')]);
        const provider: DialogContentProvider = () => ({ title: '确认通过？' });
        presenter.addDialogContentProvider(provider);

        const hit = await presenter.resolveDialogContent('pass-1');
        expect(hit).toEqual({ title: '确认通过？' });

        presenter.removeDialogContentProvider(provider);
        const miss = await presenter.resolveDialogContent('pass-1');
        expect(miss).toBeNull();
    });

    it('提供器上下文包含动作类型与动作对象', async () => {
        const action = buildAction('custom-1', 'CUSTOM');
        const presenter = buildPresenter([action]);
        const received = rs.fn(() => ({ title: '确认' }));
        presenter.addDialogContentProvider(received);

        await presenter.resolveDialogContent('custom-1');

        expect(received).toHaveBeenCalledWith({
            actionId: 'custom-1',
            action,
        });
    });
});