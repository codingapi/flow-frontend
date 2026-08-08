import React from "react";
import {DelegateViewPlugin, DelegateViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";

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

    // 最大可选人数：1 时切换为单选，>1 时限制多选数量，-1/缺省不限制
    const maxOperatorCount = props.maxOperatorCount ?? -1;
    const isSingle = maxOperatorCount === 1;

    const handleChange = (next: string[]) => {
        // 超过上限时截断，保证前端组件呈现与后端校验一致
        if (maxOperatorCount >= 0 && next.length > maxOperatorCount) {
            next = next.slice(0, maxOperatorCount);
        }
        props.onChange?.(next);
    }

    return (
        <Selector
            multiple={!isSingle}
            value={value}
            onChange={(value,option) => {
               handleChange(value);
            }}
            options={options}
        />
    )
}