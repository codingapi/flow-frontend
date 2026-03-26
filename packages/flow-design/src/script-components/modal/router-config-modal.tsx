import React from "react";
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import {GroovyScriptContent, GroovyScriptModal} from "@/script-components/components/groovy-script-modal";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {SCRIPT_DEFAULT_ROUTER} from "@/script-components/default-script";
import {RouterPluginView} from "@/plugins/view/router-view";

export interface RouterConfigModalProps {
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

const RouterConfigContent: React.FC<GroovyScriptContent> = (props) => {
    const isAdvance = GroovyScriptConvertorUtil.isCustomScript(props.script);

    return (
        <>
            {isAdvance && (
                <AdvancedScriptEditor
                    {...props}
                    resetScript={()=>{
                        return SCRIPT_DEFAULT_ROUTER;
                    }}
                />
            )}
            {!isAdvance && (
                <RouterPluginView {...props} />
            )}
        </>
    );
}

export const RouterConfigModal:React.FC<RouterConfigModalProps> = (props) => {
    return (
        <GroovyScriptModal
            type={ScriptType.ROUTER}
            width={"70%"}
            open={props.open}
            script={props.script}
            variables={props.variables || []}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            title="路由配置"
            content={RouterConfigContent}
        />
    );
}