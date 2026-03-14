import {FlowAction} from "@flow-engine/flow-types";

export interface FlowActionProps{
    action:FlowAction;

    onClickCheck?:(actionId:string) => boolean;
}