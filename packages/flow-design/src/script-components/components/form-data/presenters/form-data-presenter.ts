import {Dispatch} from "@flow-engine/flow-core";
import {DataBody, FormData, FormDataContentProps, FormDataFiled, FormDataState} from "../types";
import {FlowForm} from "@flow-engine/flow-types";
import {FlowFormPresenter} from "./flow-form-presenter";

export class FormDataPresenter {

    private state: FormDataState;
    private readonly props: FormDataContentProps;
    private readonly form: FlowForm;
    private readonly dispatch: Dispatch<FormDataState>;
    private readonly flowFormPresenter: FlowFormPresenter;

    constructor(props: FormDataContentProps, state: FormDataState, dispatch: Dispatch<FormDataState>) {
        this.props = props;
        this.form = props.form;
        this.state = state;
        this.dispatch = dispatch;
        this.flowFormPresenter = new FlowFormPresenter(props.form);
    }

    public hasSubForms() {
        return this.flowFormPresenter.hasSubForms();
    }

    public getTabs() {
        return this.flowFormPresenter.getTabs();
    }

    public initState(): void {
        const value = this.props.value || '';
        if (value) {
            const data = JSON.parse(value);
            this.dispatch(prevState => {
                return {
                    ...prevState,
                    formData: data
                }
            })
        } else {
            const data = this.getFormInitData()
            this.dispatch(prevState => {
                return {
                    ...prevState,
                    formData: data
                }
            })
        }
    }

    private getFormInitData(): FormData {
        const dataBodyState = this.state.formData?.dataBody;
        const mainData = this.getFormItemData(this.form, dataBodyState);

        let subDataMap: any = {};
        if (this.hasSubForms()) {
            for (const subForm of this.form.subForms) {
                subDataMap[subForm.code] = this.getFormItemData(subForm);
            }
        }
        return {
            dataBody: mainData,
            subDataMap: subDataMap,
        }
    }


    private getFormItemData(form: FlowForm, value?: DataBody): DataBody {
        const formCode = form.code;
        let dataBody: any = {
            formCode,
        }
        let data: any = {};
        for (const field of form.fields) {
            const key = formCode + '.' + field.code;
            data[key] = value?.data[key] || '';
        }
        dataBody['data'] = data;
        return dataBody;
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

    public getStateDatasource(form: FlowForm) {
        if (this.form.code === form.code) {
            return this.state.formData?.dataBody;
        } else {
            const subDataMap = this.state.formData?.subDataMap;
            if (subDataMap) {
                return subDataMap[form.code]
            }
        }
    }


    public updateFormData() {
        // todo update form data
        const data = '';
        this.props.onChange?.(data);
    }

}