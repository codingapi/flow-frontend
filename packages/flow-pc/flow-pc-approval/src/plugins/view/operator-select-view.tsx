import React from "react";
import {OperatorSelectViewPlugin, OperatorSelectViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Modal, Form, Input} from "antd";

export const OperatorSelectView: React.FC<OperatorSelectViewPlugin> = (props) => {

    const [visible, setVisible] = React.useState(true);
    const CustomComponent = ViewBindPlugin.getInstance().get(OperatorSelectViewPluginKey);
    const [form] = Form.useForm();

    if (CustomComponent) {
        return (
            <CustomComponent
                {...props}
            />
        );
    }

    const handleFinish = (values: any) => {
        const result: Record<string, number[]> = {};
        for (const option of props.options) {
            const inputVal = values[option.id];
            if (inputVal) {
                const ids = String(inputVal)
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)
                    .map(Number)
                    .filter(n => !isNaN(n));
                if (ids.length > 0) {
                    result[option.id] = ids;
                }
            }
        }
        props.onChange(result);
        setVisible(false);
    }

    return (
        <Modal
            title={"请选择操作人"}
            width={"40%"}
            open={visible}
            destroyOnHidden
            onCancel={() => {
                setVisible(false);
                props.onChange({});
            }}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                {props.options.map(option => (
                    <Form.Item
                        key={option.id}
                        name={option.id}
                        label={`${option.name} - 操作人`}
                        rules={[
                            {
                                required: true,
                                message: `请为 ${option.name} 指定操作人`
                            }
                        ]}
                    >
                        <Input placeholder={"请输入操作人ID，多个用逗号分隔"}/>
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    )
}
