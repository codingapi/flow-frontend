import {FormField,FlowForm} from "@flow-engine/flow-types";


export interface FormDataItem{
    code:string;
    title:string;
    required:boolean;
    value?:string;
    field:FormField;
    form:FlowForm;
}