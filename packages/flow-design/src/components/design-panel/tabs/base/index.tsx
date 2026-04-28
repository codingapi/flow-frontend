import React from "react";
import {Input} from "antd";
import {CardForm, Panel} from "@coding-flow/flow-pc-ui";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {FlowCreateOperatorEditor} from "./operator";

export const TabBase = () => {

    const [baseForm] = CardForm.useForm();
    const [operatorForm] = CardForm.useForm();
    const {state, context} = useDesignContext();

    const formActionContext = context.getPresenter().getFormActionContext();

    React.useEffect(() => {
        baseForm.resetFields();
        baseForm.setFieldsValue(state.workflow);
        operatorForm.resetFields();
        operatorForm.setFieldsValue(state.workflow);
    }, []);

    // 注册form行为
    React.useEffect(() => {
        formActionContext.addAction({
            save:()=> {
                return baseForm.getFieldsValue();
            },
            key:()=> {
                return 'base';
            },
            validate:()=>{
                return new Promise((resolve, reject) => {
                    baseForm.validateFields().then(values => {
                        resolve(values);
                    }).catch(reject);
                })
            }
        });

        formActionContext.addAction({
            save:()=> {
                return operatorForm.getFieldsValue();
            },
            key:()=> {
                return 'operator';
            },
            validate:()=>{
                return new Promise((resolve, reject) => {
                    operatorForm.validateFields().then(values=>{
                        resolve(values);
                    }).catch(reject)
                })
            }
        });

        return () => {
            formActionContext.removeAction('base');
            formActionContext.removeAction('operator');
        }
    }, []);

    React.useEffect(() => {
        baseForm.setFieldsValue(state.workflow);
        operatorForm.setFieldsValue(state.workflow);
    }, [state.workflow]);

    return (
        <Panel>
            <CardForm
                form={baseForm}
                title="基本信息"
            >
                <CardForm.Item
                    name={"title"}
                    label={"流程标题"}
                    rules={[
                        {
                            required: true,
                            message: '请输入流程标题'
                        }
                    ]}
                >
                    <Input placeholder={"请输入流程标题"}/>
                </CardForm.Item>

                <CardForm.Item
                    name={"description"}
                    label={"流程备注"}
                >
                    <Input.TextArea placeholder={"请输入流程备注"}/>
                </CardForm.Item>


                <CardForm.Item
                    name={"code"}
                    label={"流程编码"}
                    rules={[
                        {
                            required: true,
                            message: '请输入流程编码'
                        }
                    ]}
                >
                    <Input placeholder={"请输入流程编码"}/>
                </CardForm.Item>

            </CardForm>

            <CardForm
                form={operatorForm}
                title="发起配置"
            >
                <CardForm.Item
                    name={"operatorCreateScript"}
                    label={"发起人范围"}
                    rules={[
                        {
                            required: true,
                            message: '请输入发起人范围'
                        }
                    ]}
                >
                    <FlowCreateOperatorEditor/>
                </CardForm.Item>
            </CardForm>
        </Panel>
    )
}