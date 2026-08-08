import React from "react";
import { Button, Form, Select, Space } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { EditOutlined } from "@ant-design/icons";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { OperatorLoadConfigModal } from "@/script-components/modal/operator-load-config-modal";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import { MaxOperatorCountInput } from "@/script-components/components/action/components/max-operator-count";
import {FieldTip} from "@/components/field-tip";

const SELECT_TYPE_OPTIONS = [
    { label: '脚本指定', value: 'SCRIPT' },
    { label: '发起人设定', value: 'INITIATOR_SELECT' },
    { label: '审批人设定', value: 'APPROVER_SELECT' },
];


const OperatorLoadScriptContent: React.FC<GroovyScriptLoaderContent> = (props) => {

    const [visible, setVisible] = React.useState(false);
    const value = props.value || '';

    return (
        <Space.Compact style={{ width: '100%' }}>
            <GroovyScriptPreview
                script={value}
            />

            <Button
                icon={<EditOutlined />}
                onClick={() => {
                    setVisible(true);
                }}
                style={{ borderRadius: '0 6px 6px 0' }}
            >
                编辑
            </Button>

            <OperatorLoadConfigModal
                script={value}
                open={visible}
                onCancel={() => { setVisible(false); }}
                onConfirm={(value) => {
                    props.onChange?.(value);
                }}
                scriptKey={props.scriptKey}
            />

        </Space.Compact>
    )
}


/**
 * 操作人配置策略
 * @constructor
 */
export const OperatorLoadStrategy: React.FC = () => {

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
                        label={"操作人设定方式"}
                        description={"选择该节点操作人的指定方式。"}
                        items={[
                            {label: "脚本指定", detail: "通过脚本计算得出操作人。"},
                            {label: "发起人设定", detail: "由发起人在提交时选择操作人。"},
                            {label: "审批人设定", detail: "由上一审批人在审批时选择操作人。"},
                        ]}
                    />
                }
                name={["OperatorLoadStrategy", "selectType"]}
            >
                <Field
                    name="OperatorLoadStrategy.selectType"
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <Select
                            value={value || 'SCRIPT'}
                            options={SELECT_TYPE_OPTIONS}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>

            <Field
                name="OperatorLoadStrategy.selectType"
                render={({ field: { value: selectType } }: FieldRenderProps<any>) => {
                    // 发起人/审批人设定模式下，复用脚本配置能力设定「可选人员范围」与「最大可选人数」
                    const isRangeMode = selectType === 'INITIATOR_SELECT' || selectType === 'APPROVER_SELECT';
                    return (
                        <>
                            <Form.Item
                                label={
                                    <FieldTip
                                        label={isRangeMode ? "设定人员范围" : "当前操作人"}
                                        description={isRangeMode ? "设定可选人员范围，留空表示不限范围（可选任意人）。" : "通过脚本设定该节点的操作人。"}
                                    />
                                }
                                name={["OperatorLoadStrategy", "script"]}
                            >
                                <Field
                                    name="OperatorLoadStrategy.script"
                                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                                       <GroovyScriptLoader
                                            content={OperatorLoadScriptContent}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </Form.Item>
                            {isRangeMode && (
                                <Form.Item
                                    label={
                                        <FieldTip
                                            label="最大可选人数"
                                            description="限制发起人/审批人可选人数的最大值，-1 表示不限制；固定为 1 时即为单选。"
                                        />
                                    }
                                    name={["OperatorLoadStrategy", "maxOperatorCount"]}
                                >
                                    <Field
                                        name="OperatorLoadStrategy.maxOperatorCount"
                                        render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                                            <MaxOperatorCountInput value={value} onChange={onChange} />
                                        )}
                                    />
                                </Form.Item>
                            )}
                        </>
                    );
                }}
            />
        </Form>
    )
}
