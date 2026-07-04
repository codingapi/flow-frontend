import React from "react";
import { Button, Form, Space } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { TriggerConfigModal } from "@/script-components/modal/trigger-config-modal";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";


const TriggerConfigContent: React.FC<GroovyScriptLoaderContent> = (props) => {

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

            <TriggerConfigModal
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
 * 触发策略配置
 * @constructor
 */
export const TriggerStrategy: React.FC = () => {
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
                        label={"触发表达式"}
                        description={"节点触发时执行的脚本，可用于动态计算或副作用处理。"}
                    />
                }
                name={["TriggerStrategy", "script"]}
            >
                <Field
                    name={"TriggerStrategy.script"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <GroovyScriptLoader
                            content={TriggerConfigContent}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    )
}