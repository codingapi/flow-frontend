import React from "react";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {
    GroovyScriptContent,
    GroovyScriptModal,
} from "@/script-components/components/groovy-script-modal";
import {SCRIPT_DEFAULT_SUB_PROCESS_RESULT} from "@/script-components/default-script";
import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";

export interface SubProcessResultConfigModalProps {
    open: boolean;
    script: string;
    scriptKey: string;
    variables?: GroovyVariableMapping[];
    onCancel: () => void;
    onConfirm: (script: string) => void;
}

const SubProcessResultConfigContent: React.FC<GroovyScriptContent> = props => (
    <AdvancedScriptEditor
        {...props}
        title={"子流程结果判定脚本"}
        resetScript={() => SCRIPT_DEFAULT_SUB_PROCESS_RESULT}
    />
);

export const SubProcessResultConfigModal: React.FC<SubProcessResultConfigModalProps> = props => (
    <GroovyScriptModal
        type={ScriptType.SUB_PROCESS_RESULT}
        open={props.open}
        width="70%"
        script={props.script}
        variables={props.variables ?? []}
        onConfirm={props.onConfirm}
        onCancel={props.onCancel}
        title="结果判定脚本"
        content={SubProcessResultConfigContent}
        scriptKey={props.scriptKey}
    />
);
