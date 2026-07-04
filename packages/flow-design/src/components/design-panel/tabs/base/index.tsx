import React from "react";
import {Input} from "antd";
import {CardForm, Panel} from "@coding-flow/flow-pc-ui";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {FlowCreateOperatorEditor} from "./operator";
import { GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";

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
                    label={
                        <FieldTip
                            label={"流程标题"}
                            description={"流程的显示名称，便于识别与管理。"}
                        />
                    }
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
                    label={
                        <FieldTip
                            label={"流程备注"}
                            description={"对流程用途、规则的补充说明，可选填。"}
                        />
                    }
                >
                    <Input.TextArea placeholder={"请输入流程备注"}/>
                </CardForm.Item>


                <CardForm.Item
                    name={"code"}
                    label={
                        <FieldTip
                            label={"流程编码"}
                            description={"流程的唯一编码，用于系统识别与接口调用。"}
                        />
                    }
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
                    label={
                        <FieldTip
                            label={"发起人范围"}
                            description={"通过脚本限定有权发起该流程的人员范围。"}
                        />
                    }
                    rules={[
                        {
                            required: true,
                            message: '请输入发起人范围'
                        }
                    ]}
                >
                    <GroovyScriptLoader
                        content={FlowCreateOperatorEditor}
                    />
                </CardForm.Item>
            </CardForm>
        </Panel>
    )
}