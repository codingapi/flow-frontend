import React from "react";
import {
    buildReturnNodeOptions,
    ReturnViewPlugin,
    ReturnViewPluginKey
} from "@coding-flow/flow-approval-presenter";
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

    /** 候选节点由后端按执行历史下发（最近优先），不在前端从流程定义节点中截取 */
    const nodeOptions = React.useMemo(() => {
        return buildReturnNodeOptions(state.flow);
    }, [state.flow?.backNodes, state.flow?.nodes, state.flow?.nodeId])


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
