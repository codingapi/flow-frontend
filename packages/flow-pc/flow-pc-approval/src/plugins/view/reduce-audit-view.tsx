import React from "react";
import {ReduceAuditViewPlugin, ReduceAuditViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Select} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

/**
 * 减签人员选择视图
 *
 * 默认实现列出当前节点的待审批人（服务端 detail 响应的 currentNodeOperators，
 * 已排除当前审批人，含顺序审批尚未激活的隐藏记录）；真实项目可通过 ViewBindPlugin 覆盖。
 */
export const ReduceAuditView: React.FC<ReduceAuditViewPlugin> = (props) => {
    const ReduceAuditViewComponent = ViewBindPlugin.getInstance().get(ReduceAuditViewPluginKey);

    const {state} = useApprovalContext();

    const operators = state.flow?.currentNodeOperators || [];

    const options = operators.map(operator => ({
        label: operator.name,
        value: operator.id,
    }));

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
