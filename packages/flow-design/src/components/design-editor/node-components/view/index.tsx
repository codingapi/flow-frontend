import React from "react";
import { Button, Form, Input, Space } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { BugOutlined } from "@ant-design/icons";
import { ViewCodeDrawer } from "@/script-components/components/view-code-drawer";
import {FieldTip} from "@/components/field-tip";

export const View = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);

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
                        label={"视图名称"}
                        description={"节点绑定的展示视图，用于自定义该节点的表单或界面展示。"}
                    />
                }
                name={["view"]}
            >
                <Field
                    name={"view"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input value={value} onChange={onChange} />
                                <Button
                                    icon={<BugOutlined />}
                                    onClick={() => {
                                        setVisible(true);
                                    }}
                                    style={{ borderRadius: '0 6px 6px 0' }}
                                >
                                    代码
                                </Button>
                            </Space.Compact>
                        </>
                    )}
                />
            </Form.Item>

            <Field
                name={"code"}
                render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                    <>
                        <ViewCodeDrawer
                            code={value}
                            visible={visible}
                            onClose={() => setVisible(false)}
                        />
                    </>
                )}
            />
        </Form>
    )
};