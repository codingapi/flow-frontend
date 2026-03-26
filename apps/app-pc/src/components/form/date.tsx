import React from "react";
import {DatePicker, Form} from "antd";
import dayjs from "dayjs";
import {type FormItemInputProps} from "./type";
import type {FormItemProps} from "@coding-form/form-engine";

const $Date: React.FC<FormItemInputProps> = (props) => {

    const handlerChange = (value: any) => {
        if (value) {
            props.onChange?.(dayjs(value).format('YYYY-MM-DD'));
        } else {
            props.onChange?.('');
        }
    }

    const value = props.value ? dayjs(props.value) : undefined;
    const defaultValue = props.defaultValue ? dayjs(props.defaultValue) : undefined;

    return (
        <DatePicker
            disabled={props.readOnly}
            value={value as any}
            onChange={handlerChange}
            placeholder={props.placeholder}
            defaultValue={defaultValue}
        />
    )
}

export const FormDate: React.FC<FormItemProps> = (props) => {

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
            <$Date
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}