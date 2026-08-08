import React from "react";
import { InputNumber } from "antd";

/**
 * 最大可选人数的默认值，-1 表示不限制
 */
export const DEFAULT_MAX_OPERATOR_COUNT = -1;

interface MaxOperatorCountInputProps {
    value?: number;
    onChange?: (value: number) => void;
}

/**
 * 最大可选人数输入框
 * 为空时按 -1（不限制）处理
 */
export const MaxOperatorCountInput: React.FC<MaxOperatorCountInputProps> = (props) => (
    <InputNumber
        style={{ width: '100%' }}
        min={-1}
        placeholder="-1 表示不限制"
        value={props.value ?? DEFAULT_MAX_OPERATOR_COUNT}
        onChange={(val) => {
            // 空值按 -1 处理，避免 null 落库
            props.onChange?.(val ?? DEFAULT_MAX_OPERATOR_COUNT);
        }}
    />
);