import { beforeEach, describe, expect, it, rs } from "@rstest/core";
import { ActionInterceptor, ActionInterceptorManager } from "@/interceptor/action-interceptor";
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

describe.sequential('ActionInterceptorManager', () => {

    let manager: ActionInterceptorManager;

    beforeEach(() => {
        manager = new ActionInterceptorManager();
    });

    it('未订阅任何拦截器时应放行', async () => {
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(true);
    });

    it('同步拦截器返回 true 时放行', async () => {
        manager.add(() => true);
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(true);
    });

    it('同步拦截器返回 false 时拦截', async () => {
        manager.add(() => false);
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(false);
    });

    it('异步拦截器 resolve true 时放行', async () => {
        manager.add(async () => {
            await Promise.resolve();
            return true;
        });
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(true);
    });

    it('异步拦截器 resolve false 时拦截', async () => {
        manager.add(async () => {
            await Promise.resolve();
            return false;
        });
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(false);
    });

    it('按订阅顺序依次执行拦截器', async () => {
        const order: number[] = [];
        manager.add(() => {
            order.push(1);
            return true;
        });
        manager.add(() => {
            order.push(2);
            return true;
        });
        await manager.intercept({ actionId: 'a', action: null });
        expect(order).toEqual([1, 2]);
    });

    it('任一拦截器返回 false 时短路，后续拦截器不再执行', async () => {
        const second = rs.fn(() => true);
        manager.add(() => false);
        manager.add(second);
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(false);
        expect(second).not.toHaveBeenCalled();
    });

    it('add 返回的函数可取消订阅', async () => {
        const unsubscribe = manager.add(() => false);
        expect(manager.size()).toBe(1);
        unsubscribe();
        expect(manager.size()).toBe(0);
        const result = await manager.intercept({ actionId: 'a', action: null });
        expect(result).toBe(true);
    });

    it('remove 可移除指定拦截器', async () => {
        const interceptor: ActionInterceptor = () => false;
        manager.add(interceptor);
        manager.remove(interceptor);
        expect(manager.size()).toBe(0);
    });

    it('clear 清空全部拦截器', () => {
        manager.add(() => true);
        manager.add(() => true);
        manager.clear();
        expect(manager.size()).toBe(0);
    });

    it('拦截器接收到完整上下文', async () => {
        const action = buildAction('pass-1');
        const received = rs.fn(() => true);
        manager.add(received);
        await manager.intercept({ actionId: 'pass-1', action, params: { advice: 'ok' } });
        expect(received).toHaveBeenCalledWith({
            actionId: 'pass-1',
            action,
            params: { advice: 'ok' },
        });
    });
});

describe.sequential('FlowActionPresenter 拦截器集成', () => {

    it('未订阅拦截器时正常提交', async () => {
        const action = buildAction('pass-1');
        const setLoading = rs.fn();
        const presenter = buildPresenter([action], setLoading);

        const result = await presenter.action('pass-1');

        expect(result.success).toBe(true);
        expect(setLoading).toHaveBeenCalledWith(true);
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('拦截器返回 false 时不提交且不触发 loading', async () => {
        const action = buildAction('pass-1');
        const setLoading = rs.fn();
        const presenter = buildPresenter([action], setLoading);
        presenter.addActionInterceptor(() => false);

        const result = await presenter.action('pass-1');

        expect(result.success).toBe(false);
        expect(result.intercepted).toBe(true);
        expect(setLoading).not.toHaveBeenCalled();
    });

    it('异步拦截器 resolve true 后继续提交', async () => {
        const action = buildAction('pass-1');
        const presenter = buildPresenter([action]);
        presenter.addActionInterceptor(async () => {
            await Promise.resolve();
            return true;
        });

        const result = await presenter.action('pass-1');

        expect(result.success).toBe(true);
    });

    it('任一拦截器拦截则终止提交', async () => {
        const action = buildAction('pass-1');
        const presenter = buildPresenter([action]);
        presenter.addActionInterceptor(() => true);
        presenter.addActionInterceptor(() => false);

        const result = await presenter.action('pass-1');

        expect(result.success).toBe(false);
        expect(result.intercepted).toBe(true);
    });

    it('取消订阅后恢复正常提交', async () => {
        const action = buildAction('pass-1');
        const presenter = buildPresenter([action]);
        const unsubscribe = presenter.addActionInterceptor(() => false);

        const blocked = await presenter.action('pass-1');
        expect(blocked.success).toBe(false);

        unsubscribe();
        const passed = await presenter.action('pass-1');
        expect(passed.success).toBe(true);
    });

    it('removeActionInterceptor 移除后恢复正常提交', async () => {
        const action = buildAction('pass-1');
        const presenter = buildPresenter([action]);
        const interceptor: ActionInterceptor = () => false;
        presenter.addActionInterceptor(interceptor);

        const blocked = await presenter.action('pass-1');
        expect(blocked.success).toBe(false);

        presenter.removeActionInterceptor(interceptor);
        const passed = await presenter.action('pass-1');
        expect(passed.success).toBe(true);
    });

    it('interceptAction 未订阅拦截器时放行', async () => {
        const presenter = buildPresenter([buildAction('custom-1', 'CUSTOM')]);

        const passed = await presenter.interceptAction('custom-1');

        expect(passed).toBe(true);
    });

    it('interceptAction 可独立执行拦截器（供前端触发事件等路径使用）', async () => {
        const action = buildAction('custom-1', 'CUSTOM');
        const presenter = buildPresenter([action]);
        const received = rs.fn(() => false);
        presenter.addActionInterceptor(received);

        const passed = await presenter.interceptAction('custom-1', { source: 'front-event' });

        expect(passed).toBe(false);
        expect(received).toHaveBeenCalledWith({
            actionId: 'custom-1',
            action,
            params: { source: 'front-event' },
        });
    });

    it('拦截器接收到动作对象与参数', async () => {
        const action = buildAction('reject-1', 'REJECT');
        const presenter = buildPresenter([action]);
        const received = rs.fn(() => true);
        presenter.addActionInterceptor(received);

        await presenter.action('reject-1', { advice: '不同意' });

        expect(received).toHaveBeenCalledWith({
            actionId: 'reject-1',
            action,
            params: { advice: '不同意' },
        });
    });
});
