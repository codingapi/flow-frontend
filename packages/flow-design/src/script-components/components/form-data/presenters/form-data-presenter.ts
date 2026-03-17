import {Dispatch} from "@coding-flow/flow-core";
import {DataBody, FormData, FormDataContentProps, FormDataFiled, FormDataState} from "../types";
import {FlowForm} from "@coding-flow/flow-types";
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
            this.dispatch(prevState => {
                const data = this.getFormInitData();
                return {
                    ...prevState,
                    formData: data
                }
            })
        }
    }

    private getFormInitData(state?:FormDataState): FormData {
        const dataBody = state?.formData?.dataBody;
        const mainData = this.getFormItemData(this.form, dataBody);
        return {
            dataBody: mainData,
        }
    }


    private getFormItemData(form: FlowForm, value?: DataBody): DataBody {
        const formCode = form.code;
        let dataBody: any = {
            formCode,
        }
        let data: any = {};
        for (const field of form.fields) {
            const key = field.code;
            data[key] = value?.data[key] || '';
        }
        dataBody['data'] = data;
        return dataBody;
    }


    public syncState(state: FormDataState): void {
        this.state = state;
    }


    public updateFieldValue(field: FormDataFiled, value: string): void {
        this.dispatch(prevState => {
            if (prevState.formData) {
                const dataBody = prevState.formData?.dataBody;
                return {
                    ...prevState,
                    formData: {
                        ...prevState.formData,
                        dataBody: {
                            ...prevState.formData?.dataBody,
                            data:{
                                ...dataBody.data,
                                [field.code]: value
                            }
                        }
                    }
                }
            }
            return {
                ...prevState,
            }

        })
    }

    public getFormTitle(form: FlowForm) {
        return form.name;
    }

    public getColumns(form: FlowForm) {
        const flowFormPresenter = new FlowFormPresenter(form);
        return flowFormPresenter.getColumns();
    }


    public getDatasource(form: FlowForm,dataBody?: DataBody) {
        if (dataBody) {
            const columns: FormDataFiled[] = [];

            for (const field of form.fields) {
                const key = field.code;
                columns.push({
                    code: key,
                    title: field.name,
                    required: field.required,
                    field: field,
                    form: this.form,
                    value: dataBody.data[key]
                })
            }

            return columns;
        }else {
            return []
        }
    }


    public updateFormData(state: FormDataState): void {
        if(state.formData) {
            const data = JSON.stringify(state.formData);
            this.props.onChange?.(data);
        }
    }

}