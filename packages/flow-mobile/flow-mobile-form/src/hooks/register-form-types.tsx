import React from "react";
import {FormTypeContext} from "@coding-flow/flow-types";
import {FormType} from "@coding-flow/flow-types";

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
                name: "整数",
                dataType:'INTEGER',
                type:'integer'
            },
            {
                name: "长整数",
                dataType:'LONG',
                type:'long'
            },
            {
                name: "小数",
                dataType:'DOUBLE',
                type:'double'
            },
            {
                name: "日期格式",
                dataType:'STRING',
                type:'date'
            }
        ];

        FormTypeContext.getInstance().register(types);
    }

}