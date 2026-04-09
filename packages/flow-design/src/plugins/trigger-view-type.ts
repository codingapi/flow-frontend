import {GroovyVariableMapping, ScriptType} from "@/script-components/typings";
import React from "react";
import {DesignViewPluginAction} from "@/plugins/design-view-plugin-action";

export const VIEW_KEY = 'TriggerViewPlugin';

export interface TriggerViewPlugin {
    /** 脚本类型 */
    type: ScriptType;
    /** 当前脚本 */
    script: string;
    /** 变量映射列表 */
    variables: GroovyVariableMapping[];
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?:React.Ref<DesignViewPluginAction>;
}