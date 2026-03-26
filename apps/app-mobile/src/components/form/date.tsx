import React from "react";
import {DatePicker, Form} from "antd-mobile";
import dayjs from "dayjs";
import {type FormItemInputProps} from "./type";
import type { FormItemProps } from "@coding-form/form-engine";

const $Date: React.FC<FormItemInputProps> = (props) => {

    const [visible,setVisible] = React.useState(false);

    const handlerChange = (value: any) => {
        if (value) {
            props.onChange?.(dayjs(value).format('YYYY-MM-DD'));
        } else {
            props.onChange?.('');
        }
    }

    const value = props.value ? dayjs(props.value) : undefined;

    return (
        <>
            {value && (<a onClick={()=>{setVisible(true)}}>{value.format('YYYY-MM-DD')}</a>)}
            <DatePicker
                visible={visible}
                onClose={()=>{setVisible(false)}}
                onConfirm={(value) => {
                    handlerChange(value);
                    setVisible(false);
                }}
                value={value?value.toDate():undefined}
            />
        </>
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
            layout={props.layout}
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