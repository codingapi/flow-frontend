import React from "react";
import {GroovyScriptContent, GroovyScriptModal} from "@/script-components/components/groovy-script-modal";
import {ScriptType} from "@/script-components/typings";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {OperatorLoadPluginView} from "@/plugins/view/operator-load-view";
import {SCRIPT_DEFAULT_OPERATOR_LOAD} from "@/script-components/default-script";

interface OperatorLoadConfigModalProps{
    /** 是否展示 **/
    open: boolean;
    /** 当前脚本 */
    script: string;
    /** 取消回调 */
    onCancel: () => void;
    /** 确认回调 */
    onConfirm: (script: string) => void;
}


const OperatorLoadConfigContent:React.FC<GroovyScriptContent> = (props)=>{
    const isAdvance = GroovyScriptConvertorUtil.isCustomScript(props.script);

    return (
        <>
            {isAdvance && (
                <AdvancedScriptEditor
                    {...props}
                    resetScript={()=>{
                        return SCRIPT_DEFAULT_OPERATOR_LOAD;
                    }}
                />
            )}
            {!isAdvance && (
                <OperatorLoadPluginView script={props.script} onChange={props.onChange} />
            )}
        </>
    );
}


export const OperatorLoadConfigModal:React.FC<OperatorLoadConfigModalProps> = (props)=>{

    return (
        <GroovyScriptModal
            title={"操作人配置"}
            type={ScriptType.OPERATOR_LOAD}
            variables={[]}
            script={props.script}
            content={OperatorLoadConfigContent}
            open={props.open}
            onCancel={props.onCancel}
            onConfirm={props.onConfirm}
        />
    )

}