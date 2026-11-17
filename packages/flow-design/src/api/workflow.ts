import { httpClient } from "./index";

export const list = (request: any) => {
    return httpClient.page('/api/query/workflow/list', request, {}, {}, []);
}

export const versions = (workId:string) => {
    return httpClient.get('/api/query/workflow/versions',{id:workId});
}

export const options = () => {
    return httpClient.get('/api/query/workflow/options');
}

export const meta = (workId:string) => {
    return httpClient.get('/api/cmd/workflow/meta',{id:workId});
}

export const remove = (id:string) => {
    return httpClient.post('/api/cmd/workflow/remove',{id});
}

export const updateVersionName = (body:any) => {
    return httpClient.post('/api/cmd/workflow/updateVersionName',body);
}

export const changeVersion = (id:any) => {
    return httpClient.post('/api/cmd/workflow/changeVersion',{id});
}

export const deleteVersion = (id:any) => {
    return httpClient.post('/api/cmd/workflow/deleteVersion',{id});
}

export const changeState = (id:string) => {
    return httpClient.post('/api/cmd/workflow/changeState',{id});
}

export const create = () => {
    return httpClient.post('/api/cmd/workflow/create',{});
}

export const createNode = (type:string) => {
    return httpClient.post('/api/cmd/workflow/create-node',{type});
}

export const createCustomAction = () => {
    return httpClient.post('/api/cmd/workflow/create-custom-action',{});
}

export const save = (body:any) => {
    return httpClient.post('/api/cmd/workflow/save',body);
}

export const load = (id:string) => {
    return httpClient.get('/api/cmd/workflow/load',{id});
}

export const exportWorkflow = (id:string) => {
    const filename = `workflow_${id}.json`
    return httpClient.download('/api/cmd/workflow/export?id='+id,filename);
}

export interface WorkflowImportRequest {
    file: string;
    mode: 'REPLACE' | 'INCREMENTAL';
}

export const importWorkflow = (request: WorkflowImportRequest) => {
    return httpClient.post('/api/cmd/workflow/import',request);
}

export const workflowCodeExists = (code: string) => {
    return httpClient.get('/api/cmd/workflow/exists', {code});
}

/**
 * 运行中的流程实例（以开始节点记录代表一个实例），用于强制同步时选择范围
 */
export interface RunningInstanceQuery {
    workCode: string;
    current: number;
    pageSize: number;
}

export interface RunningInstanceItem {
    processId: string;
    recordId: number;
    title?: string;
    workTitle?: string;
    workCode?: string;
    nodeName?: string;
    createOperatorId?: number;
    createOperatorName?: string;
    createTime?: number;
    workflowRuntimeId?: number;
}

export const runningInstances = (request: RunningInstanceQuery) => {
    return httpClient.page('/api/query/record/running', request, {}, {}, []);
}

export interface ForceSyncRequest {
    workCode: string;
    /** 选中同步的流程实例，未选中的实例不会被修改 */
    processIds: string[];
}

export interface ForceSyncResult {
    workflowRuntimeId: number;
    workVersion: number;
    syncedProcessIds: string[];
    skippedProcessIds: string[];
}

/**
 * 运行中流程实例强制同步最新流程设计
 */
export const forceSync = (request: ForceSyncRequest) => {
    return httpClient.post('/api/cmd/record/forceSync', request);
}
