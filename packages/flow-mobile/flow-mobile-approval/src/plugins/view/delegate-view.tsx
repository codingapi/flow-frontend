import React from "react";
import {DelegateViewPlugin, DelegateViewPluginKey} from "@flow-engine/flow-approval-presenter";
import {ViewBindPlugin} from "@flow-engine/flow-core";
import {Selector} from "antd-mobile";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";

export const DelegateView: React.FC<DelegateViewPlugin> = (props) => {
    const DelegateViewComponent = ViewBindPlugin.getInstance().get(DelegateViewPluginKey);

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

    const createOperator = state.flow?.createOperator;

    const options = createOperator?[
        {
            label:createOperator.name,
            value:createOperator.id+'',
        }
    ]:[];

    if (DelegateViewComponent) {
        return (
            <DelegateViewComponent {...props} />
        );
    }

    const handleChange = (value: string|string[]) => {
        props.onChange?.(value);
    }

    return (
        <Selector
            value={value}
            onChange={(value,option) => {
               handleChange(value);
            }}
            options={options}
        />
    )
}