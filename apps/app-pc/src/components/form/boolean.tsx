import React from "react";
import {Form, Switch} from "antd";
import {type FormItemInputProps} from "./type";
import type {FormItemProps} from "@coding-form/form-engine";


const $Switch: React.FC<FormItemInputProps> = (props) => {

    const value = props.value ? props.value === 'true' : undefined;
    const defaultValue = props.defaultValue ? props.defaultValue === 'true' : undefined;

    return (
        <Switch
            value={value}
            disabled={props.readOnly}
            defaultValue={defaultValue}
            onChange={(value) => {
                props.onChange?.(value ? 'true' : 'false');
            }}
        />
    )
}

export const FormBoolean: React.FC<FormItemProps> = (props) => {

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
            <$Switch
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}