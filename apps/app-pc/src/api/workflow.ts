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
