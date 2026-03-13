import React from "react";
import {Form, Input} from "antd-mobile";
import {FormItemInputProps, FormItemProps} from "@/type";


const $Input: React.FC<FormItemInputProps> = (props) => {

    const value = props.value || undefined;

    return (
        <Input
            value={value}
            disabled={props.readOnly}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={(value) => {
                props.onChange?.(value);
            }}
        />
    )
}


export const FormItemString: React.FC<FormItemProps> = (props) => {

    const rules = props.required ? [
        {
            required: props.required,
            message: `${props.name}不能为空`
        }
    ] : [];

    return (
        <Form.Item
            name={props.code}
            label={props.name}
            required={props.required}
            rules={rules}
            help={props.help}
            hidden={props.hidden}
            disabled={props.readOnly}
        >
            <$Input
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}