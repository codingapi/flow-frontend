import React from 'react';
import { message } from 'antd';
import { ScriptCodeEditor, ScriptMetadata, ToolbarItem } from '@coding-script/script-engine';
import { getMetadata } from '@/api/script';
import { FlowMessageKey, FlowMessageRegistry } from '@coding-flow/flow-core';

interface GroovyCodeEditorProps {
    title?: string;
    value?: string;
    toolbar?:ToolbarItem[];
    scriptKey?: string;
    readonly?: boolean;
    onChange?: (value: string) => void;
    onCompile?: (code: string) => void;
    resetScript?: () => string;
    placeholder?: string;
    theme?: 'dark' | 'light';
    options?: {
        fontSize?: number;
        minHeight?: number;
        maxHeight?: number;
    };
}

export const GroovyCodeEditor: React.FC<GroovyCodeEditorProps> = (props) => {

    const title = props.title || '脚本编辑器';

    const [metadata, setMetadata] = React.useState<ScriptMetadata>();

    React.useEffect(() => {
        if (props.scriptKey) {
            getMetadata(props.scriptKey).then(res => {
                setMetadata(res.data);
            }).catch(err => {
                message.error(
                    FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_GROOVY_META_FAILED)
                );
            });
        }
    }, [props.scriptKey]);


    return (
        <ScriptCodeEditor
            title={title}
            language="groovy"
            toolbar={props.toolbar}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            readonly={props.readonly}
            options={props.options}
            defaultTheme={props.theme || 'light'}
            metadata={metadata}
            enableCompile={true}
            enableFormat={true}
            enableFullscreen={true}
            enableThemeToggle={true}
            onCompile={(code) => {
                props.onCompile?.(code);
            }}
        />
    )
};
