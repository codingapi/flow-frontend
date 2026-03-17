import React from "react";
import {ConditionViewPlugin, VIEW_KEY} from "@/plugins/condition-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {ConditionView} from "@/script-components/components/condition";

/**
 * @param props
 * @constructor
 */
export const ConditionPluginView: React.FC<ConditionViewPlugin> = (props) => {
    const ConditionPluginViewComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);

    if (ConditionPluginViewComponent) {
        return (
            <ConditionPluginViewComponent {...props} />
        );
    }

    return (
        <ConditionView {...props}/>
    );
}
