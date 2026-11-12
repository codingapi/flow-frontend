import {beforeEach, describe, expect, it, rs} from "@rstest/core";
import React from "react";
import {act, render} from "@testing-library/react";
import {Provider} from "react-redux";
import {Form} from "antd";
import {registerFormItems} from "@coding-form/form-engine";
import {
    ApprovalContext,
    ApprovalContextScope,
    approvalStore,
    updateState,
} from "@coding-flow/flow-approval-presenter";
import {FormActionContext} from "@coding-flow/flow-types";
import {FormViewComponent} from "@/components/flow-approval/components/form-view-component";

/**
 * 审批表单视图（合并审批）
 *
 * 回归场景：合并审批中查看第二条流程后提交，formData 不能为空，且组件在重渲染时
 * 不能因为 hook 数量变化而崩溃（createFormInstance 内部是 hook 工厂）。
 */

// jsdom 未实现 matchMedia，antd Table 的响应式列依赖它
if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: rs.fn(),
        removeListener: rs.fn(),
        addEventListener: rs.fn(),
        removeEventListener: rs.fn(),
        dispatchEvent: rs.fn(),
    })) as any;
}

/** 注册表单组件必须在渲染期执行（registerFormItems 内部调用了 hook） */
const Registrations: React.FC<{ children: React.ReactNode }> = ({children}) => {
    registerFormItems(Form, []);
    return <>{children}</>;
};

const buildFlow = () => ({
    recordId: 3658,
    view: 'default',
    mergeable: true,
    form: {
        code: 'leave',
        name: '请假单',
        fields: [],
        subForms: null,
    },
    fieldPermissions: [],
    currentNodeOperators: [{id: 2, name: 'lorne'}],
    todos: [
        {
            recordId: 3655,
            processId: 'p1',
            workTitle: '请假测试',
            nodeId: 'n1',
            nodeName: '审批节点',
            nodeType: 'APPROVAL',
            title: '你有一条待办',
            createTime: 0,
            recordState: 0,
            flowState: 0,
            submitOperator: {id: 1, name: 'admin'},
            createdOperator: {id: 1, name: 'admin'},
            data: {days: 11, desc: '22'},
        },
        {
            recordId: 3658,
            processId: 'p2',
            workTitle: '请假测试',
            nodeId: 'n1',
            nodeName: '审批节点',
            nodeType: 'APPROVAL',
            title: '你有一条待办',
            createTime: 0,
            recordState: 0,
            flowState: 0,
            submitOperator: {id: 1, name: 'admin'},
            createdOperator: {id: 1, name: 'admin'},
            data: {days: 22, desc: '33'},
        },
    ],
} as any);

describe('审批表单视图（合并审批）', () => {

    let formActionContext: FormActionContext;
    let flow: any;

    const buildWrapper = () => {
        const presenter = {
            getFormActionContext: () => formActionContext,
            getFlowActionPresenter: () => ({setSubmitRecordIds: rs.fn()}),
            updateState: rs.fn(),
            getState: () => ({flow}),
            syncState: rs.fn(),
        } as any;
        const scope = new ApprovalContextScope(presenter, {content: flow, initData: {}} as any);
        return (
            <Provider store={approvalStore}>
                <ApprovalContext.Provider value={scope}>
                    <Registrations>
                        <FormViewComponent/>
                    </Registrations>
                </ApprovalContext.Provider>
            </Provider>
        );
    };

    beforeEach(() => {
        formActionContext = new FormActionContext();
        flow = buildFlow();
        approvalStore.dispatch(updateState({flow}));
    });

    it('重渲染不会因 hook 数量变化崩溃', () => {
        // given
        const view = render(buildWrapper());

        // when 合并审批查看单条流程会触发状态更新与重渲染
        act(() => {
            approvalStore.dispatch(updateState({recordState: 1}));
        });
        act(() => {
            approvalStore.dispatch(updateState({recordState: 0}));
        });

        // then
        expect(view.container).toBeTruthy();
    });

    it('提交的是打开详情那条记录的表单数据，不是空 formData', () => {
        // given
        const view = render(buildWrapper());

        // when
        const formData = formActionContext.save();

        // then 合并列表默认提交打开详情的那条记录（recordId 3658）
        expect(formData).toEqual({
            days: 22,
            desc: '33',
            recordId: 3658,
        });
        view.unmount();
    });
});
