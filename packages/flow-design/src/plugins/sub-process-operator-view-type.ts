import React from "react";
import {DesignViewPluginAction} from "@/plugins/design-view-plugin-action";

export const VIEW_KEY = 'SubProcessOperatorViewPlugin';

export interface SubProcessOperatorViewPlugin {
    /** 当前人员 */
    value?: string;
    /** 选择人员 */
    onChange?: (value: string) => void;
    /** 动作控制 **/
    action?:React.Ref<DesignViewPluginAction>;
}