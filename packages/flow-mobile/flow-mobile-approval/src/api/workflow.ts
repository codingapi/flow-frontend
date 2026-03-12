import {httpClient} from "./index";

export const mock = () => {
    return httpClient.post('/api/cmd/workflow/mock',{});
}

export const cleanMock = (id:string) => {
    return httpClient.post('/api/cmd/workflow/cleanMock',{id});
}

export const options = () => {
    return httpClient.get('/api/query/workflow/options');
}