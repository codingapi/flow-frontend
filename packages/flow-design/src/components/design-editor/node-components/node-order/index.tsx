import React from "react";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {Form, Input} from "antd";
import {FieldTip} from "@/components/field-tip";


export const NodeOrder = () => {
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            style={{
                width: '100%',
            }}
            layout="vertical"
        >
            <Form.Item
                label={
                    <FieldTip
                        label={"优先级"}
                        description={"数字越小优先级越高。当多个分支或节点可同时执行时，按此排序。"}
                    />
                }
                name={"order"}
            >
                <Field
                    name={"order"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => (
                        <Input
                            type="number"
                            value={value}
                            placeholder={"请输入优先级"}
                            onChange={(event) => {
                                onChange(event.target.value);
                            }}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    )
}