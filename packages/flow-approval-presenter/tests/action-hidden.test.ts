import { describe, expect, it } from "@rstest/core";
import { FlowActionPresenter } from "@/presenters/action";
import { FlowAction } from "@coding-flow/flow-types";

/** 构造一个最小可用的流程操作按钮对象 */
const buildAction = (id: string): FlowAction => ({
    id,
    title: id,
    type: 'PASS',
    display: 'BUTTON',
    enable: true,
} as FlowAction);

describe('FlowActionPresenter.isActionHidden（静态纯函数）', () => {

    it('动作 id 命中可见集合时返回 false（显示）', () => {
        const actions = [buildAction('pass'), buildAction('reject')];
        expect(FlowActionPresenter.isActionHidden(actions, 'pass')).toBe(false);
        expect(FlowActionPresenter.isActionHidden(actions, 'reject')).toBe(false);
    });

    it('动作 id 未命中可见集合时返回 true（隐藏）', () => {
        const actions = [buildAction('pass')];
        expect(FlowActionPresenter.isActionHidden(actions, 'reject')).toBe(true);
    });

    it('可见集合为空时一律返回 true（隐藏）', () => {
        expect(FlowActionPresenter.isActionHidden([], 'pass')).toBe(true);
    });
});
