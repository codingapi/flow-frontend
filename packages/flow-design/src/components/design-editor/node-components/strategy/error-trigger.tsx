import React from "react";
import { Button, Form, Space } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { ErrorTriggerConfigModal } from "@/script-components/modal/error-trigger-config-modal";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";


const ErrorTriggerConfigContent: React.FC<GroovyScriptLoaderContent> = (props) => {

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

            <ErrorTriggerConfigModal
                open={visible}
                onCancel={() => { setVisible(false); }}
                onConfirm={(value) => { props.onChange?.(value) }}
                script={value}
                scriptKey={props.scriptKey}
            />
        </Space.Compact>
    )
}


/**
 * 错误触发策略配置(没有匹配到人时)
 * @constructor
 */
export const ErrorTriggerStrategy: React.FC = () => {

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
                        label={"异常配置"}
                        description={"当节点未能匹配到任何操作人时触发的脚本配置，可用于兜底处理。"}
                    />
                }
                name={["ErrorTriggerStrategy", "script"]}
            >
                <Field
                    name={"ErrorTriggerStrategy.script"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <GroovyScriptLoader
                            content={ErrorTriggerConfigContent}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    )
}