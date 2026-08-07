import { FieldPermission, FlowForm, FormField } from "@coding-flow/flow-types";

export class MetaService {

    private readonly flowForm: FlowForm|undefined;
    private readonly fieldPermissions: FieldPermission[];

    constructor(flowForm: FlowForm|undefined, fieldPermissions: FieldPermission[]) {
        this.flowForm = flowForm;
        this.fieldPermissions = fieldPermissions;
    }


    public getFormMeta() {
        if (!this.flowForm) {
            return undefined;
        }
        return this.convertForm(this.flowForm);
    }


    private convertForm(form: FlowForm) {
        const formCode = form.code;
        const subForms = form.subForms || [];

        const list: FlowForm[] = [];

        if (subForms.length > 0) {
            for (const subForm of subForms) {
                list.push(this.convertForm(subForm));
            }
        }

        return {
            ...form,
            fields: form.fields.map(field => this.mapFormField(formCode, field)),
            subForms: list,
        } as FlowForm;
    }



    private mapFormField(formCode: string, field: FormField) {
        const permission = this.fieldPermissions.find(p => p.formCode === formCode && p.fieldCode === field.code);
        if (permission) {
            if (permission.type === 'HIDDEN') {
                return {
                    ...field,
                    hidden: true,
                    required: false,
                }
            }
            if (permission.type === 'READ') {
                return {
                    ...field,
                    // 表单引擎 FormItemProps 的标准只读属性（大写 R）
                    readOnly: true,
                    required: false,
                }
            }
            return field;
        }
        return field;
    }

}