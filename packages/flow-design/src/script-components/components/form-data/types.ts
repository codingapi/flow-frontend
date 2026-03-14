import {FlowForm, FormField} from "@flow-engine/flow-types";


export interface FormDataItem {
    code: string;
    title: string;
    required: boolean;
    value?: string;
    field: FormField;
    form: FlowForm;
}


export interface DataBody {
    // 表单编码
    formCode: string;
    // 表单数据
    data: Record<string, any>;
}


export interface FormData{
    // 主表数据
    dataBody: DataBody;
    // 子表数据
    subDataList: Record<string, DataBody[]>;
}


export interface FormDataState {
    formData?: FormData;
}