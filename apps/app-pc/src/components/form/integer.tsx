import React from "react";
import {Form, InputNumber} from "antd";
import {type FormItemInputProps} from "./type";
import type {FormItemProps} from "@coding-form/form-engine";


const $Input:React.FC<FormItemInputProps> = (props)=>{
    const value = props.value || undefined;

    return (
        <InputNumber
            style={{
                width: "100%",
            }}
            precision={0}
            value={value}
            disabled={props.readOnly}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={(value) => {
                if(value) {
                    props.onChange?.(value);
                }
            }}
        />
    )
}

export const FormInteger:React.FC<FormItemProps> = (props)=>{

    const rules = props.required?[
        {
            required: props.required,
            message: `${props.name}不能为空`
        }
    ]:[];

    return (
        <Form.Item
            name={props.name}
            label={props.label}
            required={props.required}
            rules={rules}
            tooltip={props.tooltip}
            help={props.help}
            hidden={props.hidden}
        >
            <$Input
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}