import React from "react";
import {ReduceAuditViewPlugin, ReduceAuditViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector} from "antd-mobile";
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

    const operators = state.flow?.currentNodeOperators || [];

    const options = operators.map(operator => ({
        label: operator.name,
        value: operator.id + '',
    }));

    if (ReduceAuditViewComponent) {
        return (
            <ReduceAuditViewComponent {...props} />
        );
    }

    return (
        <Selector
            multiple={true}
            value={value}
            onChange={(next) => {
               props.onChange?.(next);
            }}
            options={options}
        />
    )
}
