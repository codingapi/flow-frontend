import { EventBus } from "@coding-flow/flow-core";
import { FlowActionPresenter } from "@coding-flow/flow-approval-presenter";

/**
 * 派发前端触发事件前执行审批操作拦截器（与 PC 端语义一致）。
 *
 * 配置了 `triggerFrontEvent` 的自定义按钮不调用 `action()`，因此不会自动执行拦截器。
 * 本方法手动执行 `interceptAction`：全部拦截器放行后才派发事件，
 * 任一拦截器返回 false 则终止本次派发。
 *
 * @param actionPresenter 审批动作 Presenter（用于执行拦截器）
 * @param actionId        触发的动作 ID
 * @param triggerFrontEvent 前端触发事件名
 * @returns 是否放行并已派发事件
 */
export async function dispatchApprovalFrontEvent(
    actionPresenter: FlowActionPresenter,
    actionId: string,
    triggerFrontEvent: string,
): Promise<boolean> {
    const passed = await actionPresenter.interceptAction(actionId);
    if (!passed) {
        return false;
    }
    EventBus.getInstance().emit(triggerFrontEvent);
    return true;
}