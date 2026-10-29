import React from "react";
import {DesignViewPluginAction} from "@/plugins/design-view-plugin-action";

export const VIEW_KEY = 'ActionRejectViewPlugin';

export interface ActionRejectViewPlugin {
    // 当前节点id
    nodeId:string;
    // 当前的脚本正文（由脚本key加载，兼容历史内联脚本）
    value?: string;
    // 脚本更改回掉
    onChange?: (value: string) => void;
    /** 动作控制 **/
    action?:React.Ref<DesignViewPluginAction>;
}