import React from "react";
import { GroovyVariableMapping, ScriptType } from "@/script-components/typings";
import { GroovyScriptContent, GroovyScriptModal } from "@/script-components/components/groovy-script-modal";
import { GroovyScriptConvertorUtil } from "@coding-flow/flow-core";
import { AdvancedScriptEditor } from "@/script-components/components/advanced-script-editor";
import { SCRIPT_DEFAULT_ERROR_TRIGGER } from "@/script-components/default-script";
import { ErrorTriggerPluginView } from "@/plugins/view/error-trigger-view";

export interface ErrorTriggerConfigModalProps {
    /** 是否展示 **/
    open: boolean;
    /** 脚本内容 */
    script: string;
    /** 脚本key */
    scriptKey: string;
    /** 表单字段（用于动态生成变量） */
    variables?: GroovyVariableMapping[];
    /** 取消回调 */
    onCancel: () => void;
    /** 确认回调 */
    onConfirm: (script: string) => void;
    /** 是否仅允许配置节点跳转 */
    nodeOnly?: boolean;
}



interface ErrorTriggerConfigContentProps extends GroovyScriptContent {
    nodeOnly?: boolean;
}

const ErrorTriggerConfigContent: React.FC<ErrorTriggerConfigContentProps> = props => {
    const isAdvance = GroovyScriptConvertorUtil.isCustomScript(props.script);

    return (
        <>
            {isAdvance && (
                <AdvancedScriptEditor
                    {...props}
                    resetScript={() => {
                        return SCRIPT_DEFAULT_ERROR_TRIGGER;
                    }}
                />
            )}
            {!isAdvance && (
                <ErrorTriggerPluginView {...props} nodeOnly={props.nodeOnly}/>
            )}
        </>
    );
}

export const ErrorTriggerConfigModal: React.FC<ErrorTriggerConfigModalProps> = (props) => {
    return (
        <GroovyScriptModal
            type={ScriptType.ERROR_TRIGGER}
            open={props.open}
            width={"70%"}
            script={props.script}
            variables={props.variables || []}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            title="异常配置"
            content={contentProps => (
                <ErrorTriggerConfigContent {...contentProps} nodeOnly={props.nodeOnly}/>
            )}
            scriptKey={props.scriptKey}
        />
    );
}
