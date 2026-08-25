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
        this.flowActionPresenter = new FlowActionPresenter(
            state,
            api,
            this.formActionContext,
            mockKey,
            (loading) => this.dispatch({ actionLoading: loading }),
        );
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

    /**
     * 子流程数据重置（独立能力，非审批动作），仅当详情数据 resetSubProcess 标识为 true 时可调用。
     *
     * @param resetInstanceProcessIds 选中重建的子流程实例流程id列表
     * @param advice 重置说明（可选）
     */
    public resetSubProcess(resetInstanceProcessIds: string[], advice?: string) {
        return this.flowActionPresenter.resetSubProcess(resetInstanceProcessIds, advice);
    }

}