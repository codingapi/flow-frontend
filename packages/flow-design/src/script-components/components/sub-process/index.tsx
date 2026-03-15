import React from "react";
import {SubProcessViewProps} from "./typings";
import {Form, Select} from "antd";
import {useTargetWorkflowPresenter} from "./hooks/use-target-workflow-presenter";
import {SubProcessOperatorPluginView} from "@/plugins/view/sub-process-opreator-view";
import {FormDataView} from "../form-data";
import {useSubProcessPresenter} from "@/script-components/components/sub-process/hooks/use-sub-process-presenter";

export const SubProcessView: React.FC<SubProcessViewProps> = (props) => {

    const [form] = Form.useForm();

    const {state, presenter} = useTargetWorkflowPresenter();

    const subProcessPresenter = useSubProcessPresenter(props);

    React.useEffect(() => {
        if (props.value) {
            const data = subProcessPresenter.parserScript(props.value);

            const workId = data.workId;
            form.resetFields();
            form.setFieldsValue(data);

            if(workId){
                presenter.setCurrentWorkId(workId);
            }
        }
    }, [props.value]);

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={()=>{
                    const values = form.getFieldsValue();
                    subProcessPresenter.updateScript(values);
                }}
            >
                <Form.Item
                    name={"workId"}
                    label={"发起流程"}
                >
                    <Select
                        placeholder={"请选择发起流程"}
                        options={state.workflows}
                        onChange={(value) => {
                            presenter.setCurrentWorkId(value);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name={"actionId"}
                    label={"触发动作"}
                >
                    <Select
                        placeholder={"请选择触发动作"}
                        options={state.actions.map((item) => {
                            return {
                                key: item.actionId,
                                value: item.actionId,
                                label: item.title
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    name={"operatorId"}
                    label={"流程发起人"}
                >
                    <SubProcessOperatorPluginView/>
                </Form.Item>

                <Form.Item
                    name={"formData"}
                    label={"流程数据"}
                >
                    <FormDataView
                        form={state.form}
                    />
                </Form.Item>
            </Form>
        </>
    )
}