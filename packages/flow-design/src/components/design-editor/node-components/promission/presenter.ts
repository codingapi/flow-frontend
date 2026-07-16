import {FlowForm} from "@coding-flow/flow-types";
import {FieldPermission} from "@coding-flow/flow-types";

export class PromissionPresenter {

    private data: FieldPermission[];
    private readonly onChange: (value: FieldPermission[]) => void;
    private readonly form: FlowForm;
    private readonly formList:FlowForm[];

    public constructor(form: FlowForm, data: FieldPermission[], onChange: (data: FieldPermission[]) => void) {
        this.form = form;
        this.onChange = onChange;
        this.data = data;
        this.formList =[form,...(form.subForms||[])];
    }

    private getFormFields(code:string){
        for (const form of this.formList){
            if (code === form.code){
                return form.fields;
            }
        }
        return [];
    }


    public getDatasource(code: string) {
        return this.convertFieldsToColumns(code)
    }

    private getFieldName(formCode:string,fieldCode:string){
        for (const form of this.formList){
            if(form.code == formCode){
                const fields = form.fields || [];
                for (const field of fields){
                    if(field.code == fieldCode){
                        return field.name;
                    }
                }
            }
        }
        return null;
    }

    private convertFieldsToColumns(code:string){
        const currentColumns = this.data.filter(item => item.formCode === code) || [];

        return  this.getFormFields(code).map(field => {
            return {
                id: field.id,
                fieldName: field.name,
                fieldCode: field.code,
                formCode: code,
                type: 'WRITE',
            }
        }).map(field => {
            const currentColumnType = currentColumns.find(column => column.fieldCode === field.fieldCode);
            if(currentColumnType){
                return {
                    ...field,
                    type:currentColumnType.type
                }
            }else {
                return field;
            }
        });
    }

    public initFormPromission() {
        const data: FieldPermission[] = this.formList.flatMap(form =>
            (form.fields || []).map(field => {
                const permission = this.data.find(item =>
                    item.formCode === form.code && item.fieldCode === field.code
                );

                return permission || {
                    formCode: form.code,
                    fieldCode: field.code,
                    type: 'WRITE',
                };
            })
        );

        if (!this.isSameData(data)) {
            this.onChange(data);
        }
        this.data = data;
    }


    private isSameData(data: FieldPermission[]): boolean {
        return this.data.length === data.length && this.data.every((item, index) => {
            const target = data[index];
            return item.formCode === target.formCode
                && item.fieldCode === target.fieldCode
                && item.type === target.type;
        });
    }

    private changeFieldValue(code: string, fieldCode: string, value: FieldPermission['type']) {
        let exist = false;
        const newData = this.data.map(item => {
            if (item.formCode === code && item.fieldCode === fieldCode) {
                exist = true;
                return {...item, type: value};
            }
            return item;
        });

        if (!exist && this.getFormFields(code).some(field => field.code === fieldCode)) {
            newData.push({formCode: code, fieldCode, type: value});
        }

        this.onChange(newData);
        this.data = newData;
    }

    public changeHidden(formCode: string, fieldCode: string, value: boolean) {
        if (value) {
            this.changeFieldValue(formCode, fieldCode, 'HIDDEN');
        }
    }

    public changeReadable(formCode: string, fieldCode: string, value: boolean) {
        if (value) {
            this.changeFieldValue(formCode, fieldCode, 'READ');
        }
    }

    public changeEditable(formCode: string, fieldCode: string, value: boolean) {
        if (value) {
            this.changeFieldValue(formCode, fieldCode, 'WRITE');
        }
    }

}
