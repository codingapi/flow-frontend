import {HttpClient, resolveHttpTimeout} from "@coding-flow/flow-core";
import { message } from "antd";

export const httpClient = new HttpClient(resolveHttpTimeout(),{
    success:(msg:string)=>{
        message.success(msg)
    },
    error:(msg:string)=>{
        console.log(msg);
        message.error(msg)
    }
})