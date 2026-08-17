import { describe, expect, it, rs } from "@rstest/core";
import { EventBus } from "@coding-flow/flow-core";
import {
    dispatchApprovalFrontEvent,
} from "@/components/flow-approval/components/action-front-event";
import { FlowActionPresenter } from "@coding-flow/flow-approval-presenter";

/**
 * 构造一个只暴露 interceptAction 的假 Presenter。
 * 事件触发逻辑仅依赖拦截器放行结果，无需完整 Presenter 栈。
 */
const buildPresenter = (interceptAction: () => Promise<boolean> | boolean) => {
    return {
        interceptAction: rs.fn(interceptAction),
    } as unknown as FlowActionPresenter;
};

describe.sequential('移动端前端触发事件（triggerFrontEvent）拦截器', () => {

    it('拦截器全部放行后派发事件', async () => {
        // given：一个放行的拦截器 + 事件监听
        const presenter = buildPresenter(async () => true);
        let emitted = 0;
        EventBus.getInstance().on('front-event-b', () => {
            emitted += 1;
        });

        // when
        const passed = await dispatchApprovalFrontEvent(presenter, 'custom-1', 'front-event-b');

        // then：放行且事件已派发
        expect(passed).toBe(true);
        expect(presenter.interceptAction).toHaveBeenCalledWith('custom-1');
        expect(emitted).toBe(1);
        EventBus.getInstance().off('front-event-b');
    });

    it('任一拦截器拦截则不派发事件', async () => {
        // given：一个拦截的拦截器 + 事件监听
        const presenter = buildPresenter(async () => false);
        let emitted = 0;
        EventBus.getInstance().on('front-event-blocked', () => {
            emitted += 1;
        });

        // when
        const passed = await dispatchApprovalFrontEvent(presenter, 'custom-1', 'front-event-blocked');

        // then：被拦截且未派发事件
        expect(passed).toBe(false);
        expect(presenter.interceptAction).toHaveBeenCalledWith('custom-1');
        expect(emitted).toBe(0);
        EventBus.getInstance().off('front-event-blocked');
    });

    it('放行拦截器返回空 payload 也可派发', async () => {
        // given
        const presenter = buildPresenter(() => true);
        let emitted = 0;
        EventBus.getInstance().on('front-event-ok', () => {
            emitted += 1;
        });

        // when
        const passed = await dispatchApprovalFrontEvent(presenter, 'custom-ok', 'front-event-ok');

        // then
        expect(passed).toBe(true);
        expect(emitted).toBe(1);
        EventBus.getInstance().off('front-event-ok');
    });
});