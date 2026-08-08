import React from "react";
import {TransferViewPlugin, TransferViewPluginKey} from "@coding-flow/flow-approval-presenter"
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Select} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

export const TransferView: React.FC<TransferViewPlugin> = (props) => {
    const TransferViewComponent = ViewBindPlugin.getInstance().get(TransferViewPluginKey);

    const {state} = useApprovalContext();

    const createOperator = state.flow?.createOperator;

    const options = createOperator?[
        {
            label:createOperator.name,
            value:createOperator.id,
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

    // 最大可选人数：1 时切换为单选，>1 时限制多选数量，-1/缺省不限制
    const maxOperatorCount = props.maxOperatorCount ?? -1;
    const isSingle = maxOperatorCount === 1;

    return (
        <Select
            placeholder={"请选择转办人员"}
            mode={isSingle ? undefined : "multiple"}
            maxCount={!isSingle && maxOperatorCount > 1 ? maxOperatorCount : undefined}
            value={props.value}
            onChange={(value,option) => {
               handleChange(value);
            }}
            options={options}
        />
    )
}