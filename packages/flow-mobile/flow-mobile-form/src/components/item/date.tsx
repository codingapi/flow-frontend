import React from "react";
import {DatePicker, Form} from "antd-mobile";
import dayjs from "dayjs";
import {FormItemInputProps, FormItemProps} from "@/type";

const $Date: React.FC<FormItemInputProps> = (props) => {

    const handlerChange = (value: any) => {
        if (value) {
            props.onChange?.(dayjs(value).format('YYYY-MM-DD'));
        } else {
            props.onChange?.('');
        }
    }

    const value = props.value ? dayjs(props.value) : undefined;

    return (
        <DatePicker
            value={value as any}
            onSelect={handlerChange}
        />
    )
}

export const FormItemDate: React.FC<FormItemProps> = (props) => {

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
            <$Date
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
            />
        </Form.Item>
    )
}