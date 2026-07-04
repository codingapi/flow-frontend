import React from "react";
import {Form, Input, Select} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 延迟策略配置
 * @constructor
 */
export const DelayStrategy: React.FC = () => {

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
                        label={"延迟时间类型"}
                        description={"延迟时间的计量单位（秒、分、时、天）。"}
                    />
                }
                name={["DelayStrategy", "type"]}
            >
                <Field
                    name={"DelayStrategy.type"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => {
                        return (
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    {
                                        label: '秒',
                                        value: 'SECOND'
                                    },
                                    {
                                        label: '分',
                                        value: 'MINUTE'
                                    },
                                    {
                                        label: '时',
                                        value: 'HOUR'
                                    },
                                    {
                                        label: '天',
                                        value: 'DAY'
                                    }
                                ]}
                            />
                        )
                    }}
                />

            </Form.Item>

            <Form.Item
                label={
                    <FieldTip
                        label={"延迟时间"}
                        description={"节点执行的延迟时长，需配合延迟时间类型一起使用。"}
                    />
                }
                name={["DelayStrategy", "time"]}
            >
                <Field
                    name={"DelayStrategy.time"}
                    render={({field: {value, onChange}}: FieldRenderProps<any>) => (
                        <>
                            <Input value={value} onChange={onChange} type="number"/>
                        </>
                    )}
                />
            </Form.Item>
        </Form>
    )
}