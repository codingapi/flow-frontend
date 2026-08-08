import React from "react";
import {normalizeOperatorIds, buildOperatorInitialValues, isSingleOperatorMode} from "@coding-flow/flow-approval-presenter";
import {OperatorSelectViewPlugin, OperatorSelectViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Form, Input, Selector} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {NodeOption} from "@coding-flow/flow-types";

/**
 * 有可选范围时默认全选；存在数量限制时截断到 maxOperatorCount。
 * Selector 的 value 为 string[]，故将共享函数返回的 userId 转为字符串
 */
const buildMobileInitialValues = (options: NodeOption[]): Record<string, string[]> => {
    const values = buildOperatorInitialValues(options);
    return Object.entries(values).reduce<Record<string, string[]>>((acc, [key, val]) => {
        acc[key] = Array.isArray(val) ? val.map(String) : [String(val)];
        return acc;
    }, {});
};

/**
 * 根据可选范围与 maxOperatorCount 适配选人组件：
 * - 无可选范围：文本输入，配合数量校验规则
 * - 最大可选人数为 1：单选（Selector multiple=false）
 * - 其他：多选（Selector），maxOperatorCount 限制最大数量
 */
const renderOperatorSelector = (option: NodeOption) => {
    const operators = option.operators ?? [];
    const maxCount = option.maxOperatorCount ?? -1;
    const isSingle = isSingleOperatorMode(option.maxOperatorCount);

    if (operators.length === 0) {
        return <Input placeholder={"请输入操作人ID，多个用逗号分隔"}/>;
    }

    const options = operators.map(o => ({label: `${o.name}(${o.userId})`, value: String(o.userId)}));

    return (
        <Selector
            multiple={!isSingle}
            options={options}
        />
    );
};

/**
 * 数量校验：仅对无可选范围（文本输入）的场景生效，
 * 有可选范围时通过 getValueFromEvent 截断到 maxOperatorCount
 */
const buildCountRule = (option: NodeOption) => {
    const maxCount = option.maxOperatorCount ?? -1;
    if (maxCount < 0 || (option.operators && option.operators.length > 0)) {
        return undefined;
    }
    return {
        validator: (_: any, value: any) => {
            const ids = normalizeOperatorIds(value);
            if (ids.length > maxCount) {
                return Promise.reject(new Error(`最多可选 ${maxCount} 人`));
            }
            return Promise.resolve();
        }
    };
};

export const OperatorSelectView: React.FC<OperatorSelectViewPlugin> = (props) => {

    const CustomComponent = ViewBindPlugin.getInstance().get(OperatorSelectViewPluginKey);
    const [visible, setVisible] = React.useState(true);
    const [form] = Form.useForm();

    if (CustomComponent) {
        return (
            <CustomComponent
                {...props}
            />
        );
    }

    const handleFinish = (values: any) => {
        const result: Record<string, number[]> = {};
        for (const option of props.options) {
            const ids = normalizeOperatorIds(values[option.id]);
            if (ids.length > 0) {
                result[option.id] = ids;
            }
        }
        props.onChange(result);
        setVisible(false);
    }

    return (
        <PopupModal
            open={visible}
            onClose={() => {
                setVisible(false);
                props.onChange({});
            }}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={buildMobileInitialValues(props.options)}
            >
                {props.options.map(option => {
                    const operators = option.operators ?? [];
                    const maxCount = option.maxOperatorCount ?? -1;
                    const rangeHint = operators.length > 0
                        ? `可选：${operators.map(o => `${o.name}(${o.userId})`).join('、')}`
                        : undefined;
                    const countHint = maxCount >= 0
                        ? (maxCount === 1 ? '（单选）' : `（最多可选 ${maxCount} 人）`)
                        : undefined;
                    const extra = [rangeHint, countHint].filter(Boolean).join('，');
                    const countRule = buildCountRule(option);
                    const isRangeMode = operators.length > 0;
                    return (
                        <Form.Item
                            key={option.id}
                            name={option.id}
                            label={`${option.name} - 操作人`}
                            extra={extra || undefined}
                            rules={[
                                {
                                    required: true,
                                    message: `请为 ${option.name} 指定操作人`
                                },
                                ...(countRule ? [countRule] : [])
                            ]}
                            getValueFromEvent={isRangeMode && maxCount > 1
                                // 有可选范围且限制数量时，超选截断保证与后端校验一致
                                ? (value: string[]) => value.slice(0, maxCount)
                                : undefined}
                        >
                            {renderOperatorSelector(option)}
                        </Form.Item>
                    );
                })}
            </Form>
        </PopupModal>
    )
}