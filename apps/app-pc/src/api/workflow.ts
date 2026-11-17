import { httpClient } from ".";

export const list = (request: any) => {
    return httpClient.page('/api/query/workflow/list', request, {}, {}, []);
}
export const remove = (id:string) => {
    return httpClient.post('/api/cmd/workflow/remove',{id});
}

export const changeState = (id:string) => {
    return httpClient.post('/api/cmd/workflow/changeState',{id});
}

/**
 * 当前用户是否可执行「同步流程」（仅流程管理员）
 */
export const forceSyncPermission = () => {
    return httpClient.get('/api/query/workflow/permission/forceSync');
}

export interface ForceSyncRequest {
    /** 流程编码 */
    workCode: string;
    /** 需要同步的流程实例，未指定的实例不受影响 */
    processIds: string[];
}

export interface ForceSyncResult {
    workflowRuntimeId: number;
    workVersion: number;
    syncedProcessIds: string[];
    skippedProcessIds: string[];
}

/**
 * 把指定流程实例的配置同步为最新流程设计
 */
export const forceSync = (request: ForceSyncRequest) => {
    return httpClient.post('/api/cmd/record/forceSync', request);
}
