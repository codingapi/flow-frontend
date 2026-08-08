import React from "react";
import {SubProcessFormValues, SubProcessViewProps} from "./typings";
import {Button, Card, Form, FormInstance, Input, Select, Space} from "antd";
import {useTargetWorkflowPresenter} from "./hooks/use-target-workflow-presenter";
import {SubProcessOperatorPluginView} from "@/plugins/view/sub-process-opreator-view";
import {FormDataView} from "../form-data";
import {useSubProcessPresenter} from "@/script-components/components/sub-process/hooks/use-sub-process-presenter";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import styles from "./sub_process.module.scss";

interface SubProcessConfigItemProps {
    form: FormInstance<SubProcessFormValues>;
    index: number;
    removable: boolean;
    remove: (index: number | number[]) => void;
}

const SubProcessConfigItem: React.FC<SubProcessConfigItemProps> = ({form, index, removable, remove}) => {
    const {state, presenter} = useTargetWorkflowPresenter();
    const workId = Form.useWatch(['processes', index, 'workId'], form);

    React.useEffect(() => {
        if (workId) {
            presenter.setCurrentWorkId(workId);
        }
    }, [presenter, workId]);

    return (
        <Card
            className={styles.configCard}
            size="small"
            title={`子流程 ${index + 1}`}
            extra={(
                <Button
                    type="text"
                    danger
                    disabled={!removable}
                    icon={<DeleteOutlined/>}
                    aria-label={`删除子流程 ${index + 1}`}
                    onClick={() => remove(index)}
                />
            )}
        >
            <Form.Item
                name={[index, "workId"]}
                label={"发起流程"}
                rules={[{required: true, message: '请选择发起流程'}]}
            >
                <Select
                    placeholder={"请选择发起流程"}
                    options={state.workflows}
                />
            </Form.Item>

            <Form.Item
                name={[index, "actionId"]}
                label={"触发动作"}
                rules={[{required: true, message: '请选择触发动作'}]}
            >
                <Select
                    placeholder={"请选择触发动作"}
                    options={(state.actions ?? []).map(item => ({
                        key: item.actionId,
                        value: item.actionId,
                        label: item.title,
                    }))}
                />
            </Form.Item>

            <Form.Item
                name={[index, "operatorId"]}
                label={"流程发起人"}
                rules={[{required: true, message: '请选择流程发起人'}]}
            >
                <SubProcessOperatorPluginView/>
            </Form.Item>

            <Form.Item name={[index, "formData"]} label={"流程数据"}>
                <FormDataView form={state.form}/>
            </Form.Item>

            <Form.Item
                name={[index, "workTitle"]}
                label={"子流程标题"}
                tooltip={"不填写时子流程使用流程定义标题；填写后该实例以自定义标题展示（issue #197）"}
            >
                <Input placeholder={"不填则使用流程定义标题"}/>
            </Form.Item>
        </Card>
    );
};

export const SubProcessView: React.FC<SubProcessViewProps> = (props) => {

    const [form] = Form.useForm();

    const subProcessPresenter = useSubProcessPresenter(props);

    React.useEffect(() => {
        // 仅外部脚本变更（加载、切换节点等）才重置并回填表单；
        // 自身编辑触发的变更跳过，避免输入时表单被重置导致自动刷新（issue #183）
        if (subProcessPresenter.isExternalChange(props.value)) {
            const data = subProcessPresenter.parserScript(props.value);
            form.resetFields();
            form.setFieldsValue({
                processes: data.processes.length > 0 ? data.processes : [{}],
            });
        }
    }, [form, props.value, subProcessPresenter]);

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                initialValues={{processes: [{}]}}
                onValuesChange={() => {
                    const values = form.getFieldsValue(true) as SubProcessFormValues;
                    subProcessPresenter.updateScript(values);
                }}
            >
                <Form.List name="processes">
                    {(fields, {add, remove}) => (
                        <Space className={styles.configList} direction="vertical" size="middle">
                            {fields.map(field => (
                                <SubProcessConfigItem
                                    key={field.key}
                                    form={form}
                                    index={field.name}
                                    removable={fields.length > 1}
                                    remove={remove}
                                />
                            ))}
                            <Button
                                className={styles.addButton}
                                type="dashed"
                                icon={<PlusOutlined/>}
                                onClick={() => add({})}
                            >
                                添加子流程
                            </Button>
                        </Space>
                    )}
                </Form.List>
            </Form>
        </>
    )
}
