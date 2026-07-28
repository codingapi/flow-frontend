import { EventBus } from "@coding-flow/flow-core";
import type { FormViewProps } from "@coding-flow/flow-types";
import { useApprovalContext, type ActionInterceptorContext } from "@coding-flow/flow-approval-presenter";
import { FormView } from "@coding-form/form-engine";
import React from "react";
import { Form, Modal } from "antd";

export const FlowView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const { state, context } = useApprovalContext();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    React.useEffect(() => {
        // 诊断日志：确认 FlowView 是否被挂载，以及当前流程实际使用的视图名称
        console.log('FlowView mounted, flow.view =', state.flow?.view);

        EventBus.getInstance().on('CUSTOM', () => {
            const actions = state.flow?.actionList || [];
            const pass = actions.find(item => item.type === 'PASS');
            form?.setFieldValue('test', '123');
            if (pass) {
                EventBus.getInstance().emit(pass.id);
            }
        });

        // 订阅审批操作拦截器：
        // - 所有审批按钮点击后、真正提交前会先执行拦截器
        // - 返回 true（或 resolve true）放行；返回 false（或 resolve false）拦截
        // - 支持异步，例如先弹窗二次确认、做业务校验、调用远程接口等
        //
        // addActionInterceptor 返回取消订阅函数，必须在组件卸载时调用，
        // 否则 StrictMode 或组件重复挂载会导致拦截器被重复添加。
        const unsubscribe = actionPresenter.addActionInterceptor(
            (interceptorContext: ActionInterceptorContext) => {
                const { action } = interceptorContext;

                console.log('click action:',action);

                return false;
            }
        );

        console.log('unsubscribe:',unsubscribe);

        return () => {
            EventBus.getInstance().off('CUSTOM');
            // 组件卸载时取消订阅，避免重复添加拦截器
            unsubscribe();
        };
    }, []);

    return (
        <>
            <FormView
                form={form}
                data={props.data}
                initData={props.initData}
                meta={props.meta}
                onValuesChange={props.onValuesChange}
                review={props.review}
                fieldPermissions={props.fieldPermissions}
            >
                <Form.Item
                    name={"test"}
                    hidden={true}
                />
            </FormView>
        </>
    )
}
