import React from "react";
import {FlowListProps} from "@/components/list/types";
import {CheckList} from "antd-mobile";
import {CheckCircleFilled, CheckCircleTwoTone} from "@ant-design/icons";

interface RightProps{
    active: boolean;
}

const Right:React.FC<RightProps> = (props)=>{
    if(props.active){
        return (
            <CheckCircleFilled />
        )
    }else {
        return (
            <CheckCircleTwoTone />
        )
    }
}


export const FlowList:React.FC<FlowListProps> = (props)=>{

    const {formList, meta} = props;

    return (
        <>
            <div>全选 返回 尚未完成 TODO </div>
            <CheckList
                extra={active =>
                    <Right active={active}/>
                }
                defaultValue={['B']}
                multiple={true}
            >
                <CheckList.Item value='A'>
                    <a
                        onClick={(event)=>{
                        event.stopPropagation();
                    }}>A</a>
                </CheckList.Item>
            </CheckList>
        </>
    )
}