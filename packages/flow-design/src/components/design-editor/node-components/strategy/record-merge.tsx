import React from "react";
import {Form, Select, Switch} from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 记录合并策略配置
 * @constructor
 */
export const RecordMergeStrategy:React.FC = () => {

    const [form] = Form.useForm();

    const [mergeTypeVisible, setMergeTypeVisible] = React.useState(false);

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
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => {
                        setMergeTypeVisible(value === true);
                        return (
                            <>
                                <Switch value={value} onChange={onChange} />
                            </>
                        )
                    }}
                />
            </Form.Item>

            {mergeTypeVisible && (
                <Form.Item
                    label={
                        <FieldTip
                            label={"合并类型"}
                            description={"选择合并审批的合并依据：按审批人、发起人或提交人合并。"}
                            items={[
                                {label: "审批人合并", detail: "同一审批人（当前审批人）的多条记录合并为一条待办。"},
                                {label: "发起人合并", detail: "同一发起人的多条记录合并为一条待办。"},
                                {label: "提交人合并", detail: "同一提交人的多条记录合并为一条待办。"},
                            ]}
                        />
                    }
                    name={["RecordMergeStrategy","mergeType"]}
                >
                    <Field
                        name="RecordMergeStrategy.mergeType"
                        render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                            <Select
                                value={value}
                                onChange={onChange}
                                options={[
                                    {
                                        label: '审批人合并',
                                        value: 'APPROVER'
                                    },
                                    {
                                        label: '发起人合并',
                                        value: 'CREATOR'
                                    },
                                    {
                                        label: '提交人合并',
                                        value: 'SUBMITTER'
                                    }
                                ]}
                            />
                        )}
                    />
                </Form.Item>
            )}
        </Form>
    )
}