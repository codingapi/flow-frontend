import React from "react";
import {Col, Form, FormInstance, Input, Modal, Row, Switch} from "antd";
import {FieldAttributeForm} from "./attrubute";
import {FormTypeItem} from "@/components/design-panel/tabs/form/form-type";
import {FieldTip} from "@/components/field-tip";

interface FormFieldModalProps {
    open: boolean;
    onClose: () => void;
    onFinish?: (values: any) => void;
    form: FormInstance;
}

export const FormFieldModal: React.FC<FormFieldModalProps> = (props) => {

    const form = props.form;


    const labelCol = {
        style: {
            width: 110
        }
    };

    return (
        <Modal
            open={props.open}
            title={"编辑字段"}
            width={"60%"}
            onCancel={props.onClose}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                title={"编辑字段"}
                layout="vertical"
                onFinish={(values: any) => {
                    delete values.enable;
                    props.onFinish?.(values);
                    props.onClose?.();
                }}
            >
                <Form.Item
                    name={"id"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name={"dataType"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Form.Item
                            name={"name"}
                            label={
                                <FieldTip
                                    label={"字段名称"}
                                    description={"表单字段的显示名称。"}
                                />
                            }
                            labelCol={labelCol}
                            rules={[
                                {
                                    required: true,
                                    message: '字段名称不能为空'
                                }
                            ]}
                        >
                            <Input placeholder={"请输入字段名称"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"code"}
                            label={
                                <FieldTip
                                    label={"字段编码"}
                                    description={"表单字段的唯一编码，用于数据存取，建议使用英文。"}
                                />
                            }
                            labelCol={labelCol}
                            rules={[
                                {
                                    required: true,
                                    message: '字段编码不能为空'
                                }
                            ]}
                        >
                            <Input placeholder={"请输入字段编码"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormTypeItem form={form}/>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            name={"required"}
                            label={
                                <FieldTip
                                    label={"是否必填"}
                                    description={"开启后，该字段为必填项。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name={"hidden"}
                            label={
                                <FieldTip
                                    label={"是否隐藏"}
                                    description={"开启后，该字段在表单中不展示（仍可参与逻辑）。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"placeholder"}
                            label={
                                <FieldTip
                                    label={"输入提示信息"}
                                    description={"字段输入框内的占位提示文字。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入输入提示信息"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"defaultValue"}
                            label={
                                <FieldTip
                                    label={"默认值"}
                                    description={"字段新增时的初始默认值。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入默认值"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"tooltip"}
                            label={
                                <FieldTip
                                    label={"提示信息"}
                                    description={"字段标签旁的提示说明，hover 时显示。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入提示信息"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"help"}
                            label={
                                <FieldTip
                                    label={"帮助提示"}
                                    description={"字段下方的帮助说明文字。"}
                                />
                            }
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入帮助提示"}/>
                        </Form.Item>
                    </Col>
                    <FieldAttributeForm/>
                </Row>
            </Form>
        </Modal>
    )
}
