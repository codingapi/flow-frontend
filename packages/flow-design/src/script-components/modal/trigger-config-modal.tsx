import React from "react";
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import {GroovyScriptContent, GroovyScriptModal} from "@/script-components/components/groovy-script-modal";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {SCRIPT_DEFAULT_TRIGGER} from "@/script-components/default-script";
import {TriggerPluginView} from "@/plugins/view/trigger-view";

export interface TriggerConfigModalProps {
    /** 是否展示 **/
    open: boolean;
    /** 当前脚本 */
    script: string;
    /** 表单字段（用于动态生成变量） */
    variables?: GroovyVariableMapping[];
    /** 取消回调 */
    onCancel: () => void;
    /** 确认回调 */
    onConfirm: (script: string) => void;
}



const TriggerConfigContent: React.FC<GroovyScriptContent> = (props) => {
    const isAdvance = GroovyScriptConvertorUtil.isCustomScript(props.script);

    return (
        <>
            {isAdvance && (
                <AdvancedScriptEditor
                    {...props}
                    resetScript={()=>{
                        return SCRIPT_DEFAULT_TRIGGER;
                    }}
                />
            )}
            {!isAdvance && (
                <TriggerPluginView {...props} />
            )}
        </>
    );
}

export const TriggerConfigModal:React.FC<TriggerConfigModalProps> = (props) => {
    return (
        <GroovyScriptModal
            type={ScriptType.TRIGGER}
            open={props.open}
            script={props.script}
            variables={props.variables || []}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            title="触发配置"
            content={TriggerConfigContent}
        />
    );
}