import { describe, expect, it } from "@rstest/core";
import { FlowAction } from "@coding-flow/flow-types";
import { ActionFactory } from "@/components/flow-approval/components/action/factory";

/**
 * 减签动作（后端 issue #266 / 前端 issue-72）
 *
 * 后端审批节点会返回 REDUCE_AUDIT 动作，前端必须注册对应组件，否则按钮不渲染。
 */
describe('减签动作注册', () => {

    it('REDUCE_AUDIT 应映射到减签组件', () => {
        // given
        const action = {
            id: 'reduce-audit-1',
            type: 'REDUCE_AUDIT',
        } as FlowAction;

        // when
        const component = ActionFactory.getInstance().getFlowActionComponent(action);

        // then
        expect(component).toBeTruthy();
    });

    it('未注册的动作类型应返回 undefined', () => {
        // given
        const action = {
            id: 'unknown-1',
            type: 'UNKNOWN_ACTION',
        } as unknown as FlowAction;

        // when
        const component = ActionFactory.getInstance().getFlowActionComponent(action);

        // then
        expect(component).toBeUndefined();
    });
});
