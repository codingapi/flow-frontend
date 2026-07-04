import React from "react";
import { Button, Form, Space } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { RouterConfigModal } from "@/script-components/modal/router-config-modal";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";


const RouterConfigContent: React.FC<GroovyScriptLoaderContent> = (props) => {

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

            <RouterConfigModal
                open={visible}
                script={value}
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
 * 路由策略配置
 * @constructor
 */
export const RouterStrategy: React.FC = () => {
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
                        label={"路由表达式"}
                        description={"路由节点的判断脚本，根据返回值决定下一个流转节点。"}
                    />
                }
                name={["RouterStrategy", "script"]}
            >
                <Field
                    name={"RouterStrategy.script"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <GroovyScriptLoader
                            content={RouterConfigContent}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    )
}