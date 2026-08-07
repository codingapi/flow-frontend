import React from "react";
import {OperatorSelectViewPlugin, OperatorSelectViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {ResizableModal} from "@/components/flow-approval/components/resizable-modal";
import {Form, Input} from "antd";

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

    // 有可选范围的节点默认全选：把范围内人员 ID 预填进输入框
    const initialValues = props.options.reduce<Record<string, string>>((acc, option) => {
        if (option.operators && option.operators.length > 0) {
            acc[option.id] = option.operators.map(o => o.userId).join(',');
        }
        return acc;
    }, {});

    return (
        <ResizableModal
            title={"请选择操作人"}
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
                initialValues={initialValues}
            >
                {props.options.map(option => {
                    const rangeHint = option.operators && option.operators.length > 0
                        ? `可选：${option.operators.map(o => `${o.name}(${o.userId})`).join('、')}`
                        : undefined;
                    return (
                        <Form.Item
                            key={option.id}
                            name={option.id}
                            label={`${option.name} - 操作人`}
                            extra={rangeHint}
                            rules={[
                                {
                                    required: true,
                                    message: `请为 ${option.name} 指定操作人`
                                }
                            ]}
                        >
                            <Input placeholder={"请输入操作人ID，多个用逗号分隔"}/>
                        </Form.Item>
                    );
                })}
            </Form>
        </ResizableModal>
    )
}
