import {FormDataItem} from "@/script-components/components/sub-process/components/form-data/types";
import React from "react";


interface FormValueProps{
    item:FormDataItem;
}

export const FormValue:React.FC<FormValueProps> = (props) => {

    return (
        <>
            请输入信息
        </>
    )
}