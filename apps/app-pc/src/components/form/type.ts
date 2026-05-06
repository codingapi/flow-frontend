import type {FieldAttribute} from "@coding-flow/flow-types";

export interface FormItemInputProps {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string,option?:any) => void;
    placeholder?:string;
    readOnly?:boolean;
    attributes?: FieldAttribute[];
}