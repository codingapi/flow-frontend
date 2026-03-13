import React from "react";
import {Button, Space} from "antd";
import {GroovyScriptPreview} from "@/script-components/components/groovy-script-preview";
import {EditOutlined} from "@ant-design/icons";
import {OperatorCreateConfigModal} from "@/script-components/modal/operator-create-config-modal";

interface FlowCreateOperatorEditorProps {
    value?: string;
    onChange?: (value: string) => void;
}

export const FlowCreateOperatorEditor: React.FC<FlowCreateOperatorEditorProps> = (props) => {

    const script = props.value || '';

    const [visible, setVisible] = React.useState(false);


    return (
        <Space.Compact style={{width: '100%'}}>
            <GroovyScriptPreview
                script={script}
            />

            <Button
                icon={<EditOutlined/>}
                onClick={() => {
                    setVisible(true);
                }}
                style={{borderRadius: '0 6px 6px 0'}}
            >
                编辑
            </Button>

            <OperatorCreateConfigModal
                open={visible}
                script={script}
                onCancel={() => {
                    setVisible(false);
                }}
                onConfirm={(script) => {
                    props.onChange?.(script);
                }}
            />
        </Space.Compact>
    )
}
