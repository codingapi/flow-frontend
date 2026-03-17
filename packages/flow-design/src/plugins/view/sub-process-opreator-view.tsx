import React from "react";
import {SubProcessOperatorViewPlugin, VIEW_KEY} from "@/plugins/sub-process-operator-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Select} from "antd";
import {
    useCurrentWorkflowPresenter
} from "@/script-components/components/sub-process/hooks/use-current-workflow-presenter";


/**
 * @param props
 * @constructor
 */
export const SubProcessOperatorPluginView: React.FC<SubProcessOperatorViewPlugin> = (props) => {

    const presenter = useCurrentWorkflowPresenter();
    const SubProcessOperatorViewPluginComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
    if (SubProcessOperatorViewPluginComponent) {
        return (
            <SubProcessOperatorViewPluginComponent {...props} />
        );
    }

    return (
        <Select
            placeholder={"请选择流程发起人"}
            options={presenter.getOperatorOptions()}
            onChange={props.onChange}
            value={props.value}
        />
    );
}
