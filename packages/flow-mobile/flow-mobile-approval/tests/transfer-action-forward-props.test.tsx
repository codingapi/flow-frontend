import { afterEach, describe, expect, test, rs } from "@rstest/core";
import { Provider } from "react-redux";
import { render, cleanup } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import {
    ApprovalContext,
    approvalSlice,
    updateState,
} from "@coding-flow/flow-approval-presenter";
import { FlowAction } from "@coding-flow/flow-types";
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { APPROVAL_ACTION_TRANSFER_KEY } from "@/components/flow-approval";
import { TransferAction } from "@/components/flow-approval/components/action/transfer";

const buildTransferAction = (id: string): FlowAction => ({
    id,
    title: '转办',
    type: 'TRANSFER',
    display: { title: '转办', style: 'primary', icon: '' },
    enable: true,
} as FlowAction);

/** 覆盖视图收到的 props（结构上等同于 FlowActionProps） */
interface FlowActionProps {
    action: FlowAction;
}

describe.sequential('移动端转办动作（TransferAction）覆盖视图 props 透传', () => {

    afterEach(() => {
        cleanup();
    });

    test('渲染覆盖视图时应透传 action（回归：未透传导致 PersonSelectModal 崩溃）', () => {
        // given：注册一个 spy 覆盖视图，并搭建 redux + ApprovalContext 环境
        const transferAction = buildTransferAction('transfer-1');
        const spy = rs.fn((props: FlowActionProps) => <div>转办覆盖视图</div>);
        ViewBindPlugin.getInstance().register(APPROVAL_ACTION_TRANSFER_KEY, spy);

        const store = configureStore({
            reducer: { approval: approvalSlice.reducer },
        });
        store.dispatch(updateState({ flow: { actions: [transferAction] }, actionLoading: false }));

        // 最小可用的 context：TransferAction 仅在选中 ActionView 分支前读取
        // state.actionLoading 与 context.getPresenter().getFlowActionPresenter()
        const fakeContext = {
            getPresenter: () => ({ getFlowActionPresenter: () => null }),
        };

        render(
            <Provider store={store}>
                <ApprovalContext.Provider value={fakeContext}>
                    <TransferAction action={transferAction}/>
                </ApprovalContext.Provider>
            </Provider>
        );

        // then：覆盖视图被渲染，且收到 action props
        expect(spy).toHaveBeenCalledTimes(1);
        const receivedProps = spy.mock.calls[0][0];
        expect(receivedProps.action).toBe(transferAction);
    });
});