import React from "react";
import {TransferViewPlugin, TransferViewPluginKey} from "@coding-flow/flow-approval-presenter"
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const TransferView: React.FC<TransferViewPlugin> = (props) => {
    const TransferViewComponent = ViewBindPlugin.getInstance().get(TransferViewPluginKey);

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

    if (TransferViewComponent) {
        return (
            <TransferViewComponent {...props} />
        );
    }

    const handleChange = (value: string|string[]) => {
        props.onChange?.(value);
    }

    return (
        <Selector<string>
            value={value}
            onChange={(value,option) => {
               handleChange(value);
            }}
            options={options}
        />
    )
}