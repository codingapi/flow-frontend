import React from "react";
import { Button, Form, Space, Switch } from "antd";
import { Field, FieldRenderProps } from "@flowgram.ai/fixed-layout-editor";
import { GroovyScriptPreview } from "@/script-components/components/groovy-script-preview";
import { EditOutlined } from "@ant-design/icons";
import { SubProcessConfigModal } from "@/script-components/modal/sub-process-config-modal";
import { GroovyScriptLoader } from "@/script-components/components/groovy-script-loader";
import {FieldTip} from "@/components/field-tip";
import {SubProcessResultConfigModal} from "@/script-components/modal/sub_process_result_config_modal";
import styles from "./sub_process.module.scss";



interface SubProcessStrategyContentProps {
    value?: string;
    onChange?: (value: string) => void;
    scriptKey: string;
}

const SubProcessScriptContent: React.FC<SubProcessStrategyContentProps> = (props) => {
    const [visible, setVisible] = React.useState(false);
    const value = props.value || '';

    return (
        <Space.Compact className={styles.scriptInput}>
            <GroovyScriptPreview
                script={value}
            />

            <Button
                icon={<EditOutlined />}
                onClick={() => {
                    setVisible(true);
                }}
                className={styles.editButton}
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

const SubProcessResultScriptContent: React.FC<SubProcessStrategyContentProps> = props => {
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
            <SubProcessResultConfigModal
                open={visible}
                onCancel={() => setVisible(false)}
                onConfirm={script => props.onChange?.(script)}
                script={value}
                scriptKey={props.scriptKey}
            />
        </Space.Compact>
    );
};

/**
 * 子流程任务策略
 * @constructor
 */
export const SubProcessStrategy: React.FC = () => {
    const [form] = Form.useForm();


    return (
        <Form
            form={form}
            className={styles.form}
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
                    render={({ field: { value, onChange } }: FieldRenderProps<string>) => (
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
                        label={"结果判定脚本"}
                        description={"每个子流程结束时执行；返回 true 则主流程继续，全部结束仍为 false 则执行异常跳转。"}
                    />
                }
                name={["SubProcessStrategy", "resultScript"]}
            >
                <Field
                    name={"SubProcessStrategy.resultScript"}
                    render={({field: {value, onChange}}: FieldRenderProps<string>) => (
                        <GroovyScriptLoader
                            content={SubProcessResultScriptContent}
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
                    render={({ field: { value, onChange } }: FieldRenderProps<boolean>) => (
                        <>
                            <Switch value={value} onChange={onChange}/>
                        </>
                    )}
                />
            </Form.Item>
        </Form>
    );
};
