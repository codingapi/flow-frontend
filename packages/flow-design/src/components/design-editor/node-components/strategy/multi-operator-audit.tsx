import React from "react";
import {Form, Input, Select} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 多人审批策略配置
 * @constructor
 */
export const MultiOperatorAuditStrategy: React.FC = () => {

    const [form] = Form.useForm();

    const [percentVisible, setPercentVisible] = React.useState(false);

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
                        label={"多人审批策略"}
                        description={"当节点有多个审批人时，决定审批结果的判定方式。"}
                        items={[
                            {label: "循序提交", detail: "多个审批人按顺序依次审批。"},
                            {label: "合并审核", detail: "按会签通过百分比合并判定（需设置百分比）。"},
                            {label: "任意审核", detail: "任意一位审批人审核后即流转。"},
                            {label: "任意一人", detail: "随机指定一位审批人进行审核。"},
                        ]}
                    />
                }
                name={["MultiOperatorAuditStrategy", "type"]}
            >
                <Field
                    name={"MultiOperatorAuditStrategy.type"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => {
                        setPercentVisible(value === 'MERGE');
                        return (
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    {
                                        label: '循序提交',
                                        value: 'SEQUENCE'
                                    },
                                    {
                                        label: '合并审核',
                                        value: 'MERGE'
                                    },
                                    {
                                        label: '任意审核',
                                        value: 'ANY'
                                    },
                                    {
                                        label: '任意一人',
                                        value: 'RANDOM_ONE'
                                    }
                                ]}
                            />
                        )
                    }}
                />

            </Form.Item>

            {percentVisible && (
                <Form.Item
                    label={
                        <FieldTip
                            label={"会签通过比例"}
                            description={"合并审核时，通过人数达到该比例才视为该节点通过，取值 0~1 的小数（如 0.5 表示半数通过）。"}
                        />
                    }
                    name={["MultiOperatorAuditStrategy", "percent"]}
                >
                    <Field
                        name={"MultiOperatorAuditStrategy.percent"}
                        render={({field: {value, onChange}}: FieldRenderProps<any>) => (
                            <>
                                <Input value={value} onChange={onChange} type="number"/>
                            </>
                        )}
                    />
                </Form.Item>
            )}
        </Form>
    )
}