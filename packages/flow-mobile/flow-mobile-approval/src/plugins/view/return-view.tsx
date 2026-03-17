import React from "react";
import {ReturnViewPlugin, ReturnViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const ReturnView: React.FC<ReturnViewPlugin> = (props) => {
    const ReturnViewComponent = ViewBindPlugin.getInstance().get(ReturnViewPluginKey);

    const {state} = useApprovalContext();

    const value = React.useMemo(()=>{
        if(props.value) {
            if (Array.isArray(props.value)) {
                return props.value;
            }else {
                return [props.value]
            }
        }
        return [];
    },[props.value]);

    const nodeOptions = React.useMemo(() => {
        const nodes = state.flow?.nodes || [];
        const currentId = state.flow?.nodeId || '';
        const options:any[] = [];
        for (const node of nodes) {
            if (currentId === node.id) {
                break;
            }
            if(node.display) {
                options.push({
                    label: node.name,
                    value: node.id,
                })
            }
        }
        return options;
    }, [state.flow?.nodes])


    if (ReturnViewComponent) {
        return (
            <ReturnViewComponent {...props} />
        );
    }

    const handleChange = (value: string | string[]) => {
        props.onChange?.(value);
    }

    return (
        <Selector
            value={value}
            onChange={(value, option) => {
                handleChange(value);
            }}
            options={nodeOptions}
        />
    )
}