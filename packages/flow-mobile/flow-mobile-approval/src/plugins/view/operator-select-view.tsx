import React from "react";
import {OperatorSelectViewPlugin, OperatorSelectViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Form, Input} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";

export const OperatorSelectView: React.FC<OperatorSelectViewPlugin> = (props) => {

    const CustomComponent = ViewBindPlugin.getInstance().get(OperatorSelectViewPluginKey);
    const [visible, setVisible] = React.useState(true);
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
        <PopupModal
            open={visible}
            onClose={() => {
                setVisible(false);
                props.onChange({});
            }}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
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
        </PopupModal>
    )
}
