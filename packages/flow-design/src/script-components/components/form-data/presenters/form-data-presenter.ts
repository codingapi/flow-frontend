import {Dispatch} from "@flow-engine/flow-core";
import {FormDataContentProps, FormDataFiled, FormDataState} from "../types";
import {FlowForm} from "@flow-engine/flow-types";
import {FlowFormPresenter} from "./flow-form-presenter";

export class FormDataPresenter {

    private state: FormDataState;
    private readonly props: FormDataContentProps;
    private readonly dispatch: Dispatch<FormDataState>;
    private readonly flowFormPresenter:FlowFormPresenter;

    constructor(props: FormDataContentProps, state: FormDataState, dispatch: Dispatch<FormDataState>) {
        this.props = props;
        this.state = state;
        this.dispatch = dispatch;
        this.flowFormPresenter = new FlowFormPresenter(props.form);
    }

    public hasSubForms(){
        return this.flowFormPresenter.hasSubForms();
    }

    public getTabs(){
        return this.flowFormPresenter.getTabs();
    }

    public initState(): void {
        // todo init formData
        const value = this.props.value || '';
        if(value){

        }
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


    public updateFormData(){
        // todo update form data
        const data = '';
        this.props.onChange?.(data);
    }

}