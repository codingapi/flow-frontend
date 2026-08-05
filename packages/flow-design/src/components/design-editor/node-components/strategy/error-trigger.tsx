import React from "react";
import {EditOutlined} from "@ant-design/icons";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {Button, Form, Space} from "antd";
import {FieldTip} from "@/components/field-tip";
import {GroovyScriptLoader, GroovyScriptLoaderContent} from "@/script-components/components/groovy-script-loader";
import {GroovyScriptPreview} from "@/script-components/components/groovy-script-preview";
import {ErrorTriggerConfigModal} from "@/script-components/modal/error-trigger-config-modal";
import styles from "./error_trigger.module.scss";

interface ErrorTriggerConfigContentProps extends GroovyScriptLoaderContent {
    nodeOnly?: boolean;
}

const ErrorTriggerConfigContent: React.FC<ErrorTriggerConfigContentProps> = props => {
    const [visible, setVisible] = React.useState(false);
    const value = props.value || '';

    return (
        <Space.Compact className={styles.scriptInput}>
            <GroovyScriptPreview script={value}/>
            <Button
                icon={<EditOutlined/>}
                className={styles.editButton}
                onClick={() => setVisible(true)}
            >
                编辑
            </Button>
            <ErrorTriggerConfigModal
                open={visible}
                onCancel={() => setVisible(false)}
                onConfirm={script => props.onChange?.(script)}
                script={value}
                scriptKey={props.scriptKey}
                nodeOnly={props.nodeOnly}
            />
        </Space.Compact>
    );
};

export interface ErrorTriggerStrategyProps {
    nodeOnly?: boolean;
}

/**
 * 错误触发策略配置。
 */
export const ErrorTriggerStrategy: React.FC<ErrorTriggerStrategyProps> = props => {
    const [form] = Form.useForm();

    return (
        <Form form={form} className={styles.form} layout="vertical">
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
                    render={({field: {value, onChange}}: FieldRenderProps<string>) => (
                        <GroovyScriptLoader
                            content={contentProps => (
                                <ErrorTriggerConfigContent {...contentProps} nodeOnly={props.nodeOnly}/>
                            )}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>
        </Form>
    );
};
