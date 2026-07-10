import React from "react";
import { GroovyScriptContent } from "@/script-components/components/groovy-script-modal";
import { GroovyCodeEditor } from '@/components/groovy-code';
import { compile } from "@/api/script";
import { message } from "antd";
import { FlowMessageKey, FlowMessageRegistry } from "@coding-flow/flow-core";

export const AdvancedScriptEditor: React.FC<GroovyScriptContent> = (props) => {


    const { script, onChange, readonly } = props;

    const handleChange = (value: string) => {
        if (!readonly) {
            onChange(value);
        }
    };

    return (
        <GroovyCodeEditor
            title={props.title}
            value={script}
            scriptKey={props.scriptKey}
            readonly={readonly}
            onChange={handleChange}
            placeholder={"请输入脚本..."}
            onCompile={(code) => {
                console.log('编译脚本:', code);
                compile({ script: code }).then((res: any) => {
                    if (res.success) {
                        message.success(
                            FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_SCRIPT_COMPILE_SUCCESS)
                        );
                    } else {
                        message.error(
                            FlowMessageRegistry.getInstance().get(
                                FlowMessageKey.DESIGN_SCRIPT_COMPILE_FAILED,
                                { message: res.message }
                            )
                        );
                    }
                }).catch(err => {
                    message.error(
                        FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_SCRIPT_COMPILE_ERROR)
                    );
                });
            }}
            toolbar={[
                {
                    key: 'reset',
                    title: '重置',
                    label: '重置脚本',
                    backgroundColor: '#ff4d4f',
                    hoverBackgroundColor: '#ff7875',
                    textColor: '#fff',
                    borderColor: '#ff4d4f',
                    onClick: () => {
                        const newScript = props.resetScript?.() || '';
                        handleChange(newScript);
                    }
                }
            ]}
            theme={'light'}
            options={{
                fontSize: 14,
                minHeight: 300,
                maxHeight: 300,
            }}
        />
    );
}