import React from "react";
import {Form, Select} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 重新提交策略配置
 * @constructor
 */
export const ResubmitStrategy:React.FC = () => {

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
                        label={"重新提交配置"}
                        description={"审批被退回后，重新提交时的流转方式。"}
                        items={[
                            {label: "跳转到撤回节点", detail: "退回后直接跳转到上次撤回的节点继续审批。"},
                            {label: "从头逐级提交", detail: "退回后回到流程起点，逐级重新提交审批。"},
                        ]}
                    />
                }
                name={["ResubmitStrategy", "type"]}
            >
                <Field
                    name={"ResubmitStrategy.type"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => {
                        return (
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    {
                                        label: '跳转到撤回节点',
                                        value: 'RESUME'
                                    },
                                    {
                                        label: '从头逐级提交',
                                        value: 'CHAIN'
                                    },
                                ]}
                            />
                        )
                    }}
                />

            </Form.Item>

        </Form>
    )
}