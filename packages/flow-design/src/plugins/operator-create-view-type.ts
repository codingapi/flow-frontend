import React from "react";
import {DesignViewPluginAction} from "@/plugins/design-view-plugin-action";

export const VIEW_KEY = 'OperatorCreateViewPlugin';

export interface OperatorCreateViewPlugin {
    /** 当前脚本 */
    script: string;
    /** 确认回调 */
    onChange: (script: string) => void;
    /** 动作控制 **/
    action?:React.Ref<DesignViewPluginAction>;
}