import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { Button, Form, Space } from "antd";
import React from "react";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { ConditionConfigModal } from "@/script-components/modal/condition-config-modal";
import { useScriptVariables } from "@/components/design-editor/hooks/use-script-variables";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";


const ConditionConfigContent: React.FC<GroovyScriptLoaderContent> = (props) => {

    const [visible, setVisible] = React.useState(false);
    const scriptVariables = useScriptVariables();

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

            <ConditionConfigModal
                open={visible}
                onCancel={() => { setVisible(false); }}
                onConfirm={(value) => { props.onChange?.(value) }}
                scriptKey={props.scriptKey}
                script={value}
                variables={scriptVariables}
            />

        </Space.Compact>
    )
}


/**
 * 条件配置
 * @constructor
 */
export const ConditionScript = () => {

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
                        label={"条件表达式"}
                        description={"条件分支的判断脚本，返回 true 时流程走该分支。"}
                    />
                }
                name={"script"}
            >
                <Field
                    name={"script"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <GroovyScriptLoader
                            content={ConditionConfigContent}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    )
}