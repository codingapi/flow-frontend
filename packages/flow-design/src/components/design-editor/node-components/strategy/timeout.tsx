import React from "react";
import {Form, Input,Select} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 超时策略配置
 * @constructor
 */
export const TimeoutStrategy:React.FC = () => {

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
                        label={"超时类型"}
                        description={"节点超时后自动执行的动作。"}
                        items={[
                            {label: "自动提醒", detail: "超时后发送提醒，不改变审批状态。"},
                            {label: "自动同意", detail: "超时后自动通过该节点。"},
                            {label: "自动拒绝", detail: "超时后自动拒绝该节点。"},
                        ]}
                    />
                }
                name={["TimeoutStrategy","type"]}
            >
                <Field
                    name={"TimeoutStrategy.type"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    { label: '自动提醒', value: 'REMIND' },
                                    { label: '自动同意', value: 'PASS' },
                                    { label: '自动拒绝', value: 'REJECT' },
                                ]}
                            />
                        </>
                    )}
                />
            </Form.Item>

            <Form.Item
                label={
                    <FieldTip
                        label={"超时时间(分钟)"}
                        description={"触发超时动作的等待时长，单位为分钟。"}
                    />
                }
                name={["TimeoutStrategy","timeoutTime"]}
            >
                <Field
                    name={"TimeoutStrategy.timeoutTime"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Input
                                value={value}
                                onChange={onChange}
                            />
                        </>
                    )}
                />
            </Form.Item>
        </Form>
    )
}