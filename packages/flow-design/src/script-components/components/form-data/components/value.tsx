import {FormDataFiled} from "@/script-components/components/form-data/types";
import React from "react";
import {Input} from "antd";
import {useFormDataContext} from "@/script-components/components/form-data/hooks/use-form-data-context";

interface FormValueProps{
    field:FormDataFiled;
}

export const FormValue:React.FC<FormValueProps> = (props) => {

    const field = props.field;
    const {context} = useFormDataContext();
    const presenter = context.getPresenter();
    const value = field.value || undefined;

    const [input,setInput] = React.useState<string>();

    React.useEffect(()=>{
        setInput(value);
    },[value]);

    return (
        <Input
            placeholder={"请输入内容"}
            value={input}
            onBlur={(event)=>{
                const value = event.target.value;
                presenter.updateFieldValue(field, value);
            }}
            onChange={event => {
                setInput(event.target.value);
            }}
        />
    )
}