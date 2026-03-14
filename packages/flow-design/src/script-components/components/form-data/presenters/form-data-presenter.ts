import {Dispatch} from "@flow-engine/flow-core";
import {FormDataFiled, FormDataState} from "../types";
import {FlowForm} from "@flow-engine/flow-types";
import {FlowFormPresenter} from "./flow-form-presenter";

export class FormDataPresenter {

    private state: FormDataState;
    private readonly form: FlowForm;
    private readonly dispatch: Dispatch<FormDataState>;

    constructor(form: FlowForm, state: FormDataState, dispatch: Dispatch<FormDataState>) {
        this.form = form;
        this.state = state;
        this.dispatch = dispatch;
    }

    public initState(): void {
        // todo init data
    }

    public syncState(state: FormDataState): void {
        this.state = state;
    }


    public updateFieldValue(field: FormDataFiled, value: string): void {

    }

    public getFormTitle(form: FlowForm) {
        return form.name;
    }

    public getColumns(form: FlowForm) {
        const flowFormPresenter = new FlowFormPresenter(form);
        return flowFormPresenter.getColumns();
    }


    public getDatasource(form: FlowForm) {
        const flowFormPresenter = new FlowFormPresenter(form);
        return flowFormPresenter.getDatasource();
    }

}