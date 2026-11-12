import React from "react";
import {FlowListProps} from "@/components/list/types";
import {FlowMultipleList} from "@/components/list/components/multiple-list";
import {FlowSingleList} from "@/components/list/components/single-list";


export const FlowList: React.FC<FlowListProps> = (props) => {

    const [multiple,setMultiple] = React.useState(true);

    /**
     * 切换逐条/批量模式。
     *
     * 必须清空上一模式的勾选：批量勾选的记录残留在 presenter 中时，
     * 切到逐条模式后未重新选择就点通过，会按旧勾选批量提交。
     * 进入逐条模式同时恢复合并列表口径的按钮/选人范围。
     */
    const changeMode = (toMultiple: boolean) => {
        props.onMergeRecordIdsSelected?.([]);
        if (!toMultiple) {
            props.onMergeRecordView?.(undefined);
        }
        setMultiple(toMultiple);
    };

    if (multiple) {
        return (
            <FlowMultipleList
                {...props}
                onChangeMode={()=>{
                    changeMode(false);
                }}
                onSelect={(recordIds)=>{
                    props.onMergeRecordIdsSelected?.(recordIds);
                }}
            />
        )
    }else {
        return (
            <FlowSingleList
                {...props}
                onChangeMode={()=>{
                    changeMode(true);
                }}
            />
        )
    }

}