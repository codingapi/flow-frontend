import React from "react";
import {ReduceAuditViewPlugin, ReduceAuditViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Select} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

/**
 * 减签人员选择视图
 *
 * 默认实现只提供占位选项，真实项目应通过 ViewBindPlugin 注册视图，
 * 列出当前节点的待审批人（不含当前审批人）。
 */
export const ReduceAuditView: React.FC<ReduceAuditViewPlugin> = (props) => {
    const ReduceAuditViewComponent = ViewBindPlugin.getInstance().get(ReduceAuditViewPluginKey);

    const {state} = useApprovalContext();

    const createOperator = state.flow?.createOperator;

    const options = createOperator?[
        {
            label:createOperator.name,
            value:createOperator.id,
        }
    ]:[];

    if (ReduceAuditViewComponent) {
        return (
            <ReduceAuditViewComponent {...props} />
        );
    }

    const handleChange = (value: string|string[]) => {
        props.onChange?.(value);
    }

    return (
        <Select
            placeholder={"请选择减签人员"}
            mode={"multiple"}
            value={props.value}
            onChange={(value) => {
               handleChange(value);
            }}
            options={options}
        />
    )
}
