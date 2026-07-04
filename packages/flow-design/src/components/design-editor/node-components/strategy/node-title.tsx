import React from 'react';
import { Button, Form, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Field, FieldRenderProps } from '@flowgram.ai/fixed-layout-editor';
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { NodeTitleConfigModal } from "@/script-components/modal/node-title-config-modal";
import { useScriptVariables } from "@/components/design-editor/hooks/use-script-variables";
import { GroovyScriptLoaderContent, GroovyScriptLoader } from '@/script-components/components/groovy-script-loader';
import {FieldTip} from "@/components/field-tip";


const NodeTitleConfigContent: React.FC<GroovyScriptLoaderContent> = (props) => {

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

            <NodeTitleConfigModal
                open={visible}
                script={value}
                variables={scriptVariables}
                onCancel={() => setVisible(false)}
                onConfirm={(script) => {
                    props.onChange?.(script);
                }}
                scriptKey={props.scriptKey}
            />
        </Space.Compact>
    )
}


/**
 * 节点标题策略配置
 */
export const NodeTitleStrategy: React.FC = () => {
    return (
        <>
            <Form style={{ width: '100%' }} layout="vertical">
                <Form.Item label={
                    <FieldTip
                        label={"待办标题"}
                        description={"通过脚本设置待办消息的展示标题。"}
                    />
                }>
                    <Field
                        name="NodeTitleStrategy.script"
                        render={(props: FieldRenderProps<any>) => {
                            const { value, onChange } = props.field;
                            return (
                                <GroovyScriptLoader
                                    content={NodeTitleConfigContent}
                                    value={value}
                                    onChange={onChange}
                                />
                            );
                        }}
                    />
                </Form.Item>
            </Form>
        </>
    );
};
