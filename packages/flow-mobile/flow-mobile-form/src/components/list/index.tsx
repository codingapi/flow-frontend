import React from "react";
import {FlowListProps} from "@/components/list/types";
import {FlowMultipleList} from "@/components/list/components/multiple-list";
import {FlowSingleList} from "@/components/list/components/single-list";


export const FlowList: React.FC<FlowListProps> = (props) => {

    const [multiple,setMultiple] = React.useState(true);

    if (multiple) {
        return (
            <FlowMultipleList
                {...props}
                onChangeMode={()=>{
                    setMultiple(false);
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
                    setMultiple(true);
                }}
            />
        )
    }

}