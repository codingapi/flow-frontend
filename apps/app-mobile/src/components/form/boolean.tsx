import React from "react";
import {Form, Switch} from "antd-mobile";
import {type FormItemInputProps} from "./type";
import type { FormItemProps } from "@coding-form/form-engine";


const $Switch: React.FC<FormItemInputProps> = (props) => {

    const value = props.value ? props.value === 'true' : undefined;

    return (
        <Switch
            checked={value}
            disabled={props.readOnly}
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
            layout={props.layout}
            required={props.required}
            rules={rules}
            help={props.help}
            hidden={props.hidden}
            disabled={props.readOnly}
        >
            <$Switch
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}