import {FlowApprovalApi} from "@/components/flow-approval/typings";
import {action as actionRecord, create as createRecord, processNodes as postProcessNodes,revoke as revokeRecord,urge as urgeRecord} from "@/api/record";

export class FlowApprovalApiImpl implements FlowApprovalApi {

    create = async (body: Record<string, any>,mockKey:string)=> {
        const response = await createRecord(body,mockKey);
        if(response.success){
            return response.data;
        }
    }

    action =async (body: Record<string, any>,mockKey:string)=> {
        return await actionRecord(body,mockKey);
    }

    processNodes =async (body: Record<string, any>,mockKey:string)=> {
        const response =  await postProcessNodes(body,mockKey);
        if(response.success){
            return response.data.list;
        }
    }

    revoke =async (id:any,mockKey:string)=> {
        return await revokeRecord(id,mockKey);
    }

    urge =async (id:any,mockKey:string)=> {
        return await urgeRecord(id,mockKey);
    }

}