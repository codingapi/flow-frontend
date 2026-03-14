import { FlowForm,FormData } from "@flow-engine/flow-types";


export class ListFormPresenter {


    private readonly meta: FlowForm;
    private readonly formList: FormData[];

    constructor(meta: FlowForm, formList: FormData[]) {
        this.meta = meta;
        this.formList = formList;
    }

    public getFormDataByRecordId(id: number) {
        for (const item of this.formList) {
            const data = item.data;
            if (data && data.recordId === id) {
                return item;
            }
        }
        return undefined;
    }


    private getFormData(form: FormData) {
        const formInstance = form.form;
        const fields = this.meta.fields;
        const data: Record<string, any> = {};
        for (const field of fields) {
            data[field.code] = formInstance.getFieldValue(field.code);
        }
        return data;
    }

    public getDatasource() {
        const datasource = [];
        for (const form of this.formList) {
            const data = form.data;
            const submitOperator = {
                submitOperatorName: data.submitOperator?.name,
                submitOperatorId: data.submitOperator?.id,
            }
            const createdOperator = {
                createdOperatorName: data.createdOperator.name,
                createdOperatorId: data.createdOperator.id,
            }
            datasource.push({
                ...this.getFormData(form),
                ...data,
                ...submitOperator,
                ...createdOperator
            });
        }
        return datasource;
    }
}