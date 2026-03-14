import {FormDataFiled} from "@/script-components/components/form-data/types";
import React from "react";
import {Input} from "antd";
import {useFormDataContext} from "@/script-components/components/form-data/hooks/use-form-data-context";

interface FormValueProps{
    item:FormDataFiled;
}

export const FormValue:React.FC<FormValueProps> = (props) => {

    const {context} = useFormDataContext();
    const presenter = context.getPresenter();

    return (
        <Input
            placeholder={"请输入内容"}
            onChange={event => {
                presenter.updateFieldValue(props.item,event.target.value);
            }}
        />
    )
}