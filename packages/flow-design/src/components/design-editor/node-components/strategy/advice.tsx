import React from "react";
import {Form, Switch} from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 节点审批意见策略
 * @constructor
 */
export const AdviceStrategy: React.FC = () => {


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
                        label={"审批意见是否必填"}
                        description={"开启后，审批人提交审批时必须填写审批意见。"}
                    />
                }
                name={["AdviceStrategy","adviceRequired"]}
            >
                <Field
                    name="AdviceStrategy.adviceRequired"
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Switch value={value} onChange={onChange} />
                        </>
                    )}
                />
            </Form.Item>

            <Form.Item
                label={
                    <FieldTip
                        label={"审批签名是否必填"}
                        description={"开启后，审批人提交审批时必须完成签名。"}
                    />
                }
                name={["AdviceStrategy","signRequired"]}
            >
                <Field
                    name="AdviceStrategy.signRequired"
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Switch value={value} onChange={onChange} />
                        </>
                    )}
                />
            </Form.Item>
        </Form>
    )
}