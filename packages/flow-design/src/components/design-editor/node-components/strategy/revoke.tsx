import React from "react";
import {Form, Switch,Select} from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import {FieldTip} from "@/components/field-tip";

/**
 * 撤回策略
 * @constructor
 */
export const RevokeStrategy:React.FC = () => {

    const [form] = Form.useForm();
    const [enable, setEnable] = React.useState<boolean>(false);

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
                        label={"启动撤回功能"}
                        description={"开启后，审批人在自己审批通过后可发起撤回，撤回时流程回到本节点重新审批。"}
                    />
                }
                name={["RevokeStrategy","enable"]}
            >
                <Field
                    name="RevokeStrategy.enable"
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => {
                        setEnable(value);
                        return (
                            <Switch value={value} onChange={onChange} />
                        )
                    }}
                />
            </Form.Item>
            {enable && (
                <Form.Item
                    label={
                        <FieldTip
                            label={"撤回方式"}
                            description={"审批人在自己审批通过后可发起撤回，撤回后流程回到本节点重新审批。仅“已通过”状态且由原审批人发起时有效。"}
                            items={[
                                {label: "撤回到当前节点", detail: "无论下级是否已审批，均可撤回，下级记录全部作废。"},
                                {label: "撤回上级节点", detail: "仅当下级节点尚未审批时才允许撤回；下级一旦审批完成则无法撤回。"},
                            ]}
                        />
                    }
                    name={["RevokeStrategy","type"]}
                >
                    <Field
                        name="RevokeStrategy.type"
                        render={({ field: { value, onChange } }: FieldRenderProps<any>) => {
                            return (
                                <Select
                                    value={value}
                                    onChange={onChange}
                                    options={[
                                        {
                                            label: '撤回上级节点',
                                            value: 'REVOKE_NEXT'
                                        },
                                        {
                                            label: '撤回到当前节点',
                                            value: 'REVOKE_CURRENT'
                                        },
                                    ]}
                                />
                            )
                        }}
                    />
                </Form.Item>
            )}
        </Form>
    )
}