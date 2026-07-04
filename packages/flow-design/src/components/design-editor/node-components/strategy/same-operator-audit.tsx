import React from "react";
import {Form, Select} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 提交人与审批人一致配置
 * @constructor
 */
export const SameOperatorAuditStrategy:React.FC = () => {

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
                        label={"相同人员提交配置"}
                        description={"当提交人与审批人为同一人时的处理方式。"}
                        items={[
                            {label: "自动通过", detail: "提交人与审批人为同一人时，自动通过该节点。"},
                            {label: "手动审批", detail: "即使提交人与审批人相同，仍需手动审批。"},
                        ]}
                    />
                }
                name={["SameOperatorAuditStrategy", "type"]}
            >
                <Field
                    name={"SameOperatorAuditStrategy.type"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => {
                        return (
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    {
                                        label: '自动通过',
                                        value: 'AUTO_PASS'
                                    },
                                    {
                                        label: '手动审批',
                                        value: 'MANUAL_PASS'
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