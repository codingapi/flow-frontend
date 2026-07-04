import React from "react";
import {Form, Switch} from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 记录合并策略配置
 * @constructor
 */
export const RecordMergeStrategy:React.FC = () => {


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
                        label={"启用合并审批"}
                        description={"开启后，当流程流转到该节点时，同一流程下的多条审批记录将自动合并到一起进行审批。"}
                    />
                }
                name={["RecordMergeStrategy","enable"]}
            >
                <Field
                    name="RecordMergeStrategy.enable"
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