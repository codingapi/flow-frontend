import React from "react";
import {GroovyVariableUtil} from "@/script-components/utils/varibale";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";

export const useScriptVariables = () => {
    const {state} = useDesignContext();
    return React.useMemo(() => {
        return GroovyVariableUtil.getVariables(state.workflow.form);
    }, [state.workflow.form]);
}