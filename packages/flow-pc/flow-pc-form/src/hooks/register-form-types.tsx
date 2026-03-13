import React from "react";
import {FormTypeContext} from "@flow-engine/flow-types";
import {FormType} from "@flow-engine/flow-types";

class RegisterRef{

}

export const registerFormTypes = ()=>{

    const ref = React.useRef<RegisterRef>(undefined);

    if(!ref.current){
        ref.current = new RegisterRef();

        const types:FormType[] = [
            {
                name: "字符串",
                dataType:'STRING',
                type:'string'
            },
            {
                name: "布尔值",
                dataType:'BOOLEAN',
                type:'boolean'
            },
            {
                name: "数字类型",
                dataType:'NUMBER',
                type:'number'
            }
        ];

        FormTypeContext.getInstance().register(types);
    }

}