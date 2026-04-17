import React from "react";
import {FormTypeContext} from "@coding-flow/flow-types";
import {type FormType} from "@coding-flow/flow-types";
import { registerFormItems } from "@coding-form/form-engine";
import { Form } from "antd";
import {FormString} from "@/components/form/string.tsx";
import {FormBoolean} from "@/components/form/boolean.tsx";
import {FormInteger} from "@/components/form/integer.tsx";
import {FormLong} from "@/components/form/long.tsx";
import {FormDouble} from "@/components/form/double.tsx";
import {FormDate} from "@/components/form/date.tsx";

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
                type:'string',
                // 该字段是用于表单引擎管理界面时支持的属性控制能力
                attributes:[
                    {
                        key:'maxLength',
                        label:'最大长度',
                        type:'number'
                    }
                ]
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

        registerFormItems(Form,[
            {
                type: 'string',
                componentType:FormString
            },
            {
                type: 'boolean',
                componentType:FormBoolean
            },
            {
                type: 'integer',
                componentType:FormInteger
            },
            {
                type: 'long',
                componentType:FormLong
            },
            {
                type: 'double',
                componentType:FormDouble
            },
            {
                type: 'date',
                componentType:FormDate
            }
        ])
    }

}