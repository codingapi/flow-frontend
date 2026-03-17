import {SubProcessViewApi, SubProcessViewState} from "@/script-components/components/sub-process/typings";
import {Dispatch} from "@coding-flow/flow-core";

export class TargetWorkflowPresenter{

    private state:SubProcessViewState;
    private readonly dispatch:Dispatch<SubProcessViewState>;
    private readonly api:SubProcessViewApi;

    constructor(state:SubProcessViewState,
                dispatch:Dispatch<SubProcessViewState>,
                api:SubProcessViewApi) {
        this.state = state;
        this.api = api;
        this.dispatch = dispatch;
    }

    public syncState(state:SubProcessViewState){
        this.state = state;
    }


    public initState(){
        this.api.options().then(list=>{
            this.dispatch(prevState=>{
                return {
                    ...prevState,
                    workflows: list,
                }
            })
        })
    }

    public setCurrentWorkId(workId:string){
        this.api.meta(workId).then(meta=>{
            this.dispatch(prevState=>{
                return {
                    ...prevState,
                    currentWorkId:workId,
                    actions:meta.actions,
                    form:meta.form
                }
            })
        })
    }
}