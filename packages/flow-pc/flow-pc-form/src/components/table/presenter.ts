import {FlowForm, FormData} from "@flow-engine/flow-types";

export class TableFormPresenter {

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


    public getColumns() {
        const columns = [];

        const fields = this.meta.fields;

        columns.push({
            title: '编号',
            dataIndex: 'recordId',
            key: 'recordId',
            hidden: false
        });

        columns.push({
            title: '流程标题',
            dataIndex: 'title',
            key: 'title',
        });

        for (const field of fields) {
            columns.push({
                title: field.name,
                dataIndex: field.code,
                key: field.name,
            });
        }
        return columns;

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
            datasource.push({
                ...this.getFormData(form),
                ...data,
            });
        }
        return datasource;
    }


}