import {FlowApprovalApi, ApprovalState} from "@/typings";
import {Dispatch} from "@coding-flow/flow-core";
import {FormActionContext} from "@coding-flow/flow-types";
import {FlowActionPresenter} from "./action";

export class ApprovalPresenter {

    private state: ApprovalState;
    private readonly mockKey:string;
    private readonly dispatch: Dispatch<ApprovalState>;
    private readonly api: FlowApprovalApi;
    private readonly formActionContext:FormActionContext;
    private readonly flowActionPresenter:FlowActionPresenter;

    constructor(state: ApprovalState, dispatch: Dispatch<ApprovalState>, api: FlowApprovalApi,mockKey:string) {
        this.state = state;
        this.dispatch = dispatch;
        this.api = api;
        this.formActionContext = new FormActionContext();
        this.mockKey = mockKey;
        this.flowActionPresenter = new FlowActionPresenter(state,api,this.formActionContext,mockKey);
    }

    public syncState(state: ApprovalState) {
        this.state = state;
        this.flowActionPresenter.syncState(state);
    }


    public getFormActionContext() {
        return this.formActionContext;
    }

    public getFlowActionPresenter() {
        return this.flowActionPresenter;
    }

    public initialState(state: ApprovalState) {
        this.dispatch(state);
    }

    public processNodes(){
        return this.flowActionPresenter.processNodes();
    }

}