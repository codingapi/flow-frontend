import {EventBus} from "@coding-flow/flow-core";
import type {FormViewProps} from "@coding-flow/flow-types";
import {type ActionInterceptorContext, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {FormView} from "@coding-form/form-engine";
import {Form, Input} from "antd-mobile";
import React from "react";

/**
 * 移动端流程表单视图（与 app-pc 的 FlowView 机制对齐）。
 *
 * 通过 `register-form-view` 注册为 `ViewBindPlugin` 的 'default' 视图，
 * 在审批表单渲染处挂载以下三种自定义能力：
 * 1. EventBus 前端自定义事件触发；
 * 2. 审批操作拦截器（action type / action id 二选一）；
 * 3. 审批弹框标题与内容提供器（action type / action id 二选一）。
 */
export const FlowView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const {state, context} = useApprovalContext();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    React.useEffect(() => {
        // 场景一：订阅前端自定义事件的触发操作，事件 KEY 在流程配置上设置
        EventBus.getInstance().on('CUSTOM', () => {
            // 所有的按钮数据
            const actions = state.flow?.actionList || [];
            // 找到通过的按钮
            const pass = actions.find(item => item.type === 'PASS');
            // 更新 form 表单数据
            form?.setFieldValue('test', '123');
            if (pass) {
                // 触发某个按钮的交互操作
                EventBus.getInstance().emit(pass.id);
            }
        });

        return () => {
            // 注销前端自定义事件的触发操作
            EventBus.getInstance().off('CUSTOM');
        }

    }, []);

    React.useEffect(() => {

        // 场景二：订阅审批操作拦截器：
        // - 所有审批按钮点击后、真正提交前会先执行拦截器
        // - 返回 true（或 resolve true）放行；返回 false（或 resolve false）拦截
        // - 支持异步，例如先弹窗二次确认、做业务校验、调用远程接口等
        //
        // addActionInterceptor 返回取消订阅函数，必须在组件卸载时调用，
        // 否则 StrictMode 或组件重复挂载会导致拦截器被重复添加。
        const unsubscribe = actionPresenter.addActionInterceptor(
            (interceptorContext: ActionInterceptorContext) => {
                const {action} = interceptorContext;

                // 如果根据 action?.type 来处理拦截的话，会影响整个视图下所有该类型下的按钮操作
                // 如果根据 action.id 来处理拦截的话，只会影响该视图下某一节点的按钮操作业务
                console.log('click action:', action);

                return true;
            }
        );

        console.log('action unsubscribe:', unsubscribe);

        return () => {
            // 组件卸载时取消订阅，避免重复添加拦截器
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        // 场景三：自定义按钮操作框标题和内容信息

        // 根据按钮类型约定按钮的提示文字信息，将会影响该视图下所有节点类型下确认框信息
        // const unsubscribe = actionPresenter.addDialogContentProvider(({action}) => {
        //         if (action?.type === 'PASS') {
        //             return {title: '自定义确认'}
        //         }
        //         return null;
        //     }
        // );

        // 根据按钮 ID 约定按钮的提示文字信息，将只会影响该视图某一节点的按钮操作确认框信息
        const unsubscribe = actionPresenter.addDialogContentProvider(({actionId}) => {
                if (actionId === 'KYykw8pigO') {
                    // 当返回content之后，若存在意见框等内容也会完全被content替换,因此使用content时请确保弹框内容已经时空白时在使用。
                    return {title: '确认小额审批？', content: '提交后不可撤回'}
                }
                return null;
            }
        );

        console.log('dialog unsubscribe:', unsubscribe);

        return () => {
            // 组件卸载时取消订阅，避免重复添加拦截器
            unsubscribe();
        };

    }, []);

    return (
        <>
            <FormView
                form={form as any}
                layout={"vertical"}
                meta={props.meta}
                review={props.review}
                onValuesChange={(_, values) => {
                    props.onValuesChange?.(values);
                }}
            >
                <Form.Item
                    key={"recordId"}
                    name={"recordId"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    key={"test"}
                    name={"test"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
            </FormView>
        </>
    )
}