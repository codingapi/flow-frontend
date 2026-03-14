import { Dispatch } from "@flow-engine/flow-core";
import {FormDataState} from "../types";
import {FlowForm} from "@flow-engine/flow-types";

export class FormDataPresenter {

    private state:FormDataState;
    private readonly dispatch:Dispatch<FormDataState>;

    constructor(state:FormDataState,dispatch:Dispatch<FormDataState>) {
        this.state = state;
        this.dispatch = dispatch;
    }

    public initState(form:FlowForm):void {
        // todo init data
    }

    public syncState(state:FormDataState):void {
        this.state = state;
    }

}