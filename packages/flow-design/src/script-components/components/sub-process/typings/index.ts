import {FlowForm} from "@coding-flow/flow-types";

/**
 *  子流程组件数据
 */
export interface SubProcessViewProps {
    value: string;
    onChange: (value: string) => void;
}

export interface SubProcessConfig {
    workId?: string;
    actionId?: string;
    operatorId?: string | number;
    formData?: string;
    /**
     * 子流程标题；不填则子流程回落流程定义标题（issue #197）
     */
    workTitle?: string;
}

export interface SubProcessFormValues {
    processes: SubProcessConfig[];
}


export interface WorkflowMeta {
    workId:string;
    actions:ActionOption[];
    form:FlowForm
}

export interface SubProcessViewState {
    workflows: WorkflowOption[];
    actions: ActionOption[];
    currentWorkId?:string;
    form?:FlowForm;
}

export interface WorkflowOption {
    label: string;
    value: string;
}

export interface ActionOption {
    actionId: string;
    title: string;
    type: string;
}

export interface SubProcessViewApi{

    options():Promise<WorkflowOption[]>;

    meta(workId:string):Promise<WorkflowMeta>;

}
