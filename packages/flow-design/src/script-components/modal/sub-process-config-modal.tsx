import React from "react";
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import {GroovyScriptContent, GroovyScriptModal} from "@/script-components/components/groovy-script-modal";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {SCRIPT_DEFAULT_SUB_PROCESS} from "@/script-components/default-script";
import {SubProcessPluginView} from "@/plugins/view/sub-process-view";

export interface SubProcessConfigModalProps {
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



const SubProcessConfigContent: React.FC<GroovyScriptContent> = (props) => {
    const isAdvance = GroovyScriptConvertorUtil.isCustomScript(props.script);

    return (
        <>
            {isAdvance && (
                <AdvancedScriptEditor
                    {...props}
                    resetScript={()=>{
                        return SCRIPT_DEFAULT_SUB_PROCESS;
                    }}
                />
            )}
            {!isAdvance && (
                <SubProcessPluginView {...props} />
            )}
        </>
    );
}

export const SubProcessConfigModal:React.FC<SubProcessConfigModalProps> = (props) => {
    return (
        <GroovyScriptModal
            type={ScriptType.SUB_PROCESS}
            width={"70%"}
            open={props.open}
            script={props.script}
            variables={props.variables || []}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            title="子流程配置"
            content={SubProcessConfigContent}
        />
    );
}