import { httpClient } from "."

export const list = (request: any) => {
    return httpClient.page('/api/query/record-mock/list', request, {}, {}, []);
}

export const todo = (request: any) => {
    return httpClient.page('/api/query/record-mock/todo', request, {}, {}, []);
}

export const done = (request: any) => {
    return httpClient.page('/api/query/record-mock/done', request, {}, {}, []);
}

export const notify = (request: any) => {
    return httpClient.page('/api/query/record-mock/notify', request, {}, {}, []);
}