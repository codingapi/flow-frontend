import React from "react";
import {Col, Form, FormInstance, Input, Modal, Row, Select, Switch} from "antd";
import {dataTypeOptions} from "@flow-engine/flow-types";
import {FieldAttributeForm} from "./attrubute";

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
            width: 100
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
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Form.Item
                            name={"name"}
                            label={"字段名称"}
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
                            label={"字段编码"}
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
                        <Form.Item
                            name={"type"}
                            label={"字段类型"}
                            labelCol={labelCol}
                            rules={[
                                {
                                    required: true,
                                    message: '字段类型不能为空'
                                }
                            ]}
                        >
                            <Input placeholder={"请输入字段类型"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"dataType"}
                            label={"数据类型"}
                            labelCol={labelCol}
                            rules={[
                                {
                                    required: true,
                                    message: '数据类型不能为空'
                                }
                            ]}
                        >
                            <Select
                                placeholder={"请输入数据类型"}
                                options={dataTypeOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"required"}
                            label={"是否必填"}
                            labelCol={labelCol}
                        >
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"hidden"}
                            label={"是否隐藏"}
                            labelCol={labelCol}
                        >
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"placeholder"}
                            label={"输入提示信息"}
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入输入提示信息"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"defaultValue"}
                            label={"默认值"}
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入默认值"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"tooltip"}
                            label={"提示信息"}
                            labelCol={labelCol}
                        >
                            <Input placeholder={"请输入提示信息"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"help"}
                            label={"帮助提示"}
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
