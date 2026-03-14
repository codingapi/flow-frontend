import {FlowForm} from "@flow-engine/flow-types";
import {FormDataList} from "../components/list";
import {FormDataItem} from "../types";
import {FormValue} from "@/script-components/components/form-data/components/value";

export class FlowFormPresenter {

    private readonly form: FlowForm;

    constructor(form: FlowForm) {
        this.form = form;
    }

    public getFormTitle() {
        return this.form.name;
    }


    public getTabs() {
        const tabs = [];
        for (const subForm of this.form.subForms) {
            tabs.push({
                label: subForm.name,
                key: subForm.code,
                children: (
                    <FormDataList
                        form={subForm}
                    />
                ),
            });
        }
        return tabs;
    }

    public getDatasource() {
        const columns: FormDataItem[] = [];

        for (const field of this.form.fields) {
            columns.push({
                code: this.form.code + '.' + field.code,
                title: field.name,
                required: field.required,
                field: field,
                form: this.form
            })
        }

        return columns;
    }

    public getColumns() {
        const columns = [];

        columns.push({
            key: 'code',
            title: '字段',
            dataIndex: 'code',
        })

        columns.push({
            key: 'title',
            title: '名称',
            dataIndex: 'title',
        })

        columns.push({
            key: 'required',
            title: '必填',
            dataIndex: 'required',
            render: (value: any) => {
                return value ? '必填' : '非必填';
            }
        })

        columns.push({
            key: 'value',
            title: '字段值',
            dataIndex: 'value',
            render: (value: any, record: any) => {
                return (
                    <FormValue
                        item={record}
                    />
                )
            }
        })

        return columns;
    }

    public hasSubForms() {
        return this.form.subForms && this.form.subForms.length > 0;
    }

}