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
 * 当前用户是否可执行「强制同步运行中实例」（仅流程管理员）
 */
export const forceSyncPermission = () => {
    return httpClient.get('/api/query/workflow/permission/forceSync');
}
