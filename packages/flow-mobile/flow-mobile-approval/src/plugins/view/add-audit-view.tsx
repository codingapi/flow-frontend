import React from "react";
import {AddAuditViewPlugin, AddAuditViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const AddAuditView: React.FC<AddAuditViewPlugin> = (props) => {
    const AddAuditViewComponent = ViewBindPlugin.getInstance().get(AddAuditViewPluginKey);

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
            value:createOperator.id + '',
        }
    ]:[];

    if (AddAuditViewComponent) {
        return (
            <AddAuditViewComponent {...props} />
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