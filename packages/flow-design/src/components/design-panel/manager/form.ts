import { FlowForm, FormField } from "@coding-flow/flow-types";
import {generateUUID} from "@/utils/uuid";

export class WorkflowFormManager {

    private readonly form: FlowForm;
    private readonly formList: FlowForm[];

    constructor(form: FlowForm) {
        this.form = form;
        this.formList = [];
        this.loadFormList();
    }

    private loadFormList(): void {
        this.formList.push(this.form);
        if (this.form.subForms && this.form.subForms.length > 0) {
            for (const subForm of this.form.subForms) {
                this.formList.push(subForm);
            }
        }
    }

    public getFormFields(code: string) {
        let result: FormField[] = [];
        for (const subForm of this.formList) {
            if (subForm.code == code) {
                result = subForm.fields || [];
            }
        }
        console.log(result);
        return result;
    }

    public removeSubForm(code: string) {
        const currentSubForms = this.form.subForms || [];
        const subForms = currentSubForms.filter(subForm => subForm.code !== code);
        return {
            ...this.form,
            subForms: subForms
        }
    }

    public addSubForm(values: any) {
        const subForms = [...this.form.subForms || []];
        subForms.push(values);
        return {
            ...this.form,
            subForms: subForms
        }
    }

    public updateFieldValue(code: string, values: any): FlowForm {
        const currentFields = this.getFormFields(code);
        const currentFieldId = values['id'];
        const list: FormField[] = [];
        let exist = false;
        for (const field of currentFields) {
            if (field.id === currentFieldId) {
                list.push(values);
                exist = true;
            } else {
                list.push(field);
            }
        }
        if (!exist) {
            list.push({
                ...values,
                id: generateUUID(),
            });
        }
        const mainCode = this.form.code;
        if (code === mainCode) {
            return {
                ...this.form,
                fields: list,
            }
        } else {
            return {
                ...this.form,
                subForms: this.form.subForms.map(item => {
                    if (item.code === code) {
                        return {
                            ...item,
                            fields: list
                        }
                    } else {
                        return item;
                    }
                }),
            }
        }
    }


    public sortField(formCode: string, fieldCode: string, order: number) {
        const currentFields = this.getFormFields(formCode) || [];
        const fields = [...currentFields];
        const index = fields.findIndex(
            item => item.code === fieldCode
        );

        if (index === -1) {
            return this.form;
        }

        const targetIndex = index + order;
        // 边界检查
        if (targetIndex < 0 || targetIndex >= fields.length) {
            return this.form;
        }

        // 移动元素
        const [field] = fields.splice(index, 1);
        fields.splice(targetIndex, 0, field);
        const mainCode = this.form.code;
        if (formCode === mainCode) {
            return {
                ...this.form,
                fields
            };
        }

        return {
            ...this.form,
            subForms: (this.form.subForms || []).map(item => {
                if (item.code === formCode) {
                    return {
                        ...item,
                        fields
                    };
                }
                return item;
            })
        };
    }

    public removeField(formCode: string, fieldCode: string) {
        const currentFields = this.getFormFields(formCode) || [];
        const fields = [...currentFields];
        const list = fields.filter(file => file.code !== fieldCode);
        const mainCode = this.form.code;
        if (formCode == mainCode) {
            return {
                ...this.form,
                fields: list,
            }
        } else {
            return {
                ...this.form,
                subForms: this.form.subForms.map(item => {
                    if (item.code === formCode) {
                        return {
                            ...item,
                            fields: list
                        }
                    } else {
                        return item;
                    }
                }),
            }
        }
    }


}