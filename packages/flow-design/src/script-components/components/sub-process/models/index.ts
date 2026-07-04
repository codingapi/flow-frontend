import {SubProcessViewApi, WorkflowMeta} from "@/script-components/components/sub-process/typings";
import {options as flowOptions,meta as metaApi} from "@/api/workflow";

export class SubProcessViewApiImpl implements SubProcessViewApi {

    options = async () => {
        const res = await flowOptions();
        if (res.success) {
            return res.data.list;
        }
        return []
    }

    meta = async (workId: string)=>{
        const res =  await metaApi(workId)
        if (res.success && res.data) {
            return {
                workId,
                actions: res.data.actions ?? [],
                form: res.data.form,
            };
        }
        return {
            workId,
            actions: [],
            form: undefined,
        };
    }



}