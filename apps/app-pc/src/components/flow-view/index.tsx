import { EventBus } from "@coding-flow/flow-core";
import type { FormViewProps } from "@coding-flow/flow-types";
import { useApprovalContext, type ActionInterceptorContext } from "@coding-flow/flow-approval-presenter";
import { FormView } from "@coding-form/form-engine";
import React from "react";
import { Form } from "antd";

export const FlowView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const { state, context } = useApprovalContext();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    React.useEffect(() => {
        // 诊断日志：确认 FlowView 是否被挂载，以及当前流程实际使用的视图名称
        console.log('FlowView mounted, flow.view =', state.flow?.view);

        // 订阅前端自定义事件的触发操作，事件KEY再流程配置上设置：
        EventBus.getInstance().on('CUSTOM', () => {
            // 所有的按钮数据
            const actions = state.flow?.actionList || [];
            // 找到通过的按钮
            const pass = actions.find(item => item.type === 'PASS');
            // 更新form表单数据
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

                // 如果是根据action?.type 来处理拦截的话，会影响整个视图下所有该类型下的按钮操作
                // 如果是根据action.id 来处理拦截的话，只会影响该视图下某一节点的按钮操作业务
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
        // 自定义按钮操作框标题和内容信息

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

    React.useEffect(() => {
        // 审批意见策略：按动作类型决定意见框行为（隐藏 / 必填 / 默认意见 / 快捷模板）
        //
        // - 配置只在宿主侧生效，不写入流程定义，因此存量流程行为不受影响；
        // - 未返回策略（null）时沿用服务端下发的节点策略（adviceRequired / adviceHidden）；
        // - 隐藏意见时必填自动放宽，若节点要求必填，请同时给出 defaultContent 以便静默提交。
        const unsubscribe = actionPresenter.addAdvicePolicyProvider(({ action, flow }) => {
                // 流程内容上下文：flow.workCode / flow.workTitle 可用于区分不同流程的策略与模板
                const workCode = flow?.workCode ?? '';
                switch (action?.type) {
                    case 'PASS':
                        // 通过：不展示意见框，静默提交「同意」（可按流程定制默认文案）
                        return {hidden: true, defaultContent: workCode === 'expense' ? '同意报销' : '同意'};
                    case 'REJECT':
                        // 拒绝：必填 + 快捷意见模板
                        return {
                            required: true,
                            templates: ['材料不全，请补充后重新提交', '不符合规定，不予通过'],
                        };
                    case 'RETURN':
                        // 退回：预填默认意见（审批人可修改），限制长度
                        return {defaultContent: '请补充材料后重新提交', maxLength: 200};
                    default:
                        return null;
                }
            }
        );

        console.log('advice policy unsubscribe:', unsubscribe);

        return () => {
            // 组件卸载时取消订阅，避免重复添加提供器
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
