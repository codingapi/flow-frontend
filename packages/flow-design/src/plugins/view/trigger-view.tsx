import React from "react";
import {TriggerViewPlugin, VIEW_KEY} from "@/plugins/trigger-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {AdvancedScriptEditor} from "@/script-components/components/advanced-script-editor";
import {SCRIPT_DEFAULT_TRIGGER} from "@/script-components/default-script";

export const TriggerPluginView: React.FC<TriggerViewPlugin> = (props) => {
    const TriggerPluginViewComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
    if(TriggerPluginViewComponent){
        return (
            <TriggerPluginViewComponent {...props} />
        );
    }


    return (
        <AdvancedScriptEditor
            {...props}
            resetScript={()=>{
                return SCRIPT_DEFAULT_TRIGGER;
            }}
        />
    );
}
