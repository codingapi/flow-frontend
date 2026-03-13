import React from "react";
import {Form, FormInstance, Input, Modal} from "antd";


interface SubFormModalProps {
    open: boolean;
    onClose: () => void;
    onFinish?: (values: any) => void;
    form: FormInstance;
}

export const SubFormModal = (props: SubFormModalProps) => {

    const form = props.form;

    return (
        <Modal
            title={"添加子表"}
            width={"60%"}
            open={props.open}
            onCancel={props.onClose}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values: any) => {
                    props.onFinish?.(values);
                    props.onClose();
                }}
            >
                <Form.Item
                    name={"name"}
                    label={"子表名称"}
                    rules={[
                        {
                            required: true,
                            message: '子表名称不能为空'
                        }
                    ]}
                >
                    <Input placeholder={"添加子表名称"}/>

                </Form.Item>

                <Form.Item
                    name={"code"}
                    label={"子表编码"}
                    rules={[
                        {
                            required: true,
                            message: '子表编码不能为空'
                        }
                    ]}
                >
                    <Input placeholder={"添加子表编码"}/>

                </Form.Item>
            </Form>
        </Modal>
    )
}

