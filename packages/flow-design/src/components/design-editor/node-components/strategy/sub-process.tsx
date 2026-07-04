import React from "react";
import { Button, Form, Space, Switch } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { SubProcessConfigModal } from "@/script-components/modal/sub-process-config-modal";
import { GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";



interface SubProcessStrategyContentProps {
    value?: string;
    onChange?: (value: string) => void;
    scriptKey: string;
}

const SubProcessScriptContent: React.FC<SubProcessStrategyContentProps> = (props) => {
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

            <SubProcessConfigModal
                open={visible}
                onCancel={() => { setVisible(false); }}
                onConfirm={(value) => {
                    props.onChange?.(value)
                }}
                script={value}
                scriptKey={props.scriptKey}
            />
        </Space.Compact>
    )
}

/**
 * 子流程任务策略
 * @constructor
 */
export const SubProcessStrategy: React.FC = () => {
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
                        label={"子流程表达式"}
                        description={"子流程触发的脚本，用于构造并在当前流程中发起一个子流程。"}
                    />
                }
                name={["SubProcessStrategy", "script"]}
            >
                <Field
                    name={"SubProcessStrategy.script"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <GroovyScriptLoader
                            content={SubProcessScriptContent}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label={
                    <FieldTip
                        label={"创建后并提交"}
                        description={"开启后，子流程创建完毕后自动提交；关闭则仅创建不提交。"}
                    />
                }
                name={["SubProcessStrategy", "submit"]}
            >
                <Field
                    name={"SubProcessStrategy.submit"}
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <>
                            <Switch value={value} onChange={onChange} />
                        </>
                    )}
                />
            </Form.Item>
        </Form>
    )
}