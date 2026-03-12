import { httpClient } from ".";

export const detail = (id:string,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.get('/api/cmd/record/detail?mockKey='+key,{id});
}

export const processNodes = (body:any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.post('/api/cmd/record/processNodes?mockKey='+key,body);
}

export const create = (body:any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.post('/api/cmd/record/create?mockKey='+key,body);
}

export const action = (body:any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.post('/api/cmd/record/action?mockKey='+key,body);
}

export const revoke = (id:any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.post('/api/cmd/record/revoke?mockKey='+key,{id});
}

export const urge = (id:any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.post('/api/cmd/record/urge?mockKey='+key,{id});
}

export const list = (request: any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.page('/api/query/record/list?mockKey='+key, request, {}, {}, []);
}

export const todo = (request: any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.page('/api/query/record/todo?mockKey='+key, request, {}, {}, []);
}

export const done = (request: any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.page('/api/query/record/done?mockKey='+key, request, {}, {}, []);
}

export const notify = (request: any,mockKey?:string) => {
    const key = mockKey?mockKey:'';
    return httpClient.page('/api/query/record/notify?mockKey='+key, request, {}, {}, []);
}