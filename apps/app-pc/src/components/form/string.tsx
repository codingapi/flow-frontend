import React from "react";
import {Form, Input} from "antd";
import {type FormItemInputProps} from "./type";
import type {FormItemProps} from "@coding-form/form-engine";


const $Input: React.FC<FormItemInputProps> = (props) => {

    const value = props.value || undefined;

    return (
        <Input
            value={value}
            disabled={props.readOnly}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={(event) => {
                props.onChange?.(event.target.value);
            }}
        />
    )
}


export const FormString: React.FC<FormItemProps> = (props) => {

    const rules = props.required ? [
        {
            required: props.required,
            message: `${props.name}不能为空`
        }
    ] : [];

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