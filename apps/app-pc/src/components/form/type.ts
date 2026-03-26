export interface FormItemInputProps {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?:string;
    readOnly?:boolean;
}