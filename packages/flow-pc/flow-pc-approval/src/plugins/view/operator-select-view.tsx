import React from "react";
import {normalizeOperatorIds, buildOperatorInitialValues, isSingleOperatorMode} from "@coding-flow/flow-approval-presenter";
import {OperatorSelectViewPlugin, OperatorSelectViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {ResizableModal} from "@/components/flow-approval/components/resizable-modal";
import {Form, Input, Radio, Select} from "antd";
import {NodeOption} from "@coding-flow/flow-types";

/**
 * 根据可选范围与 maxOperatorCount 适配选人组件：
 * - 无可选范围：文本输入，配合数量校验规则
 * - 最大可选人数为 1：单选（Radio.Group）
 * - 其他：多选（Select multiple），maxOperatorCount 限制最大数量
 */
const renderOperatorSelector = (option: NodeOption) => {
    const operators = option.operators ?? [];
    const maxCount = option.maxOperatorCount ?? -1;
    const isSingle = isSingleOperatorMode(option.maxOperatorCount);

    if (operators.length === 0) {
        return <Input placeholder={"请输入操作人ID，多个用逗号分隔"}/>;
    }

    const options = operators.map(o => ({label: `${o.name}(${o.userId})`, value: o.userId}));

    if (isSingle) {
        return (
            <Radio.Group
                options={options}
            />
        );
    }

    return (
        <Select
            mode="multiple"
            maxCount={maxCount > 1 ? maxCount : undefined}
            placeholder="请选择操作人"
            optionFilterProp="label"
            options={options}
        />
    );
};

/**
 * 数量校验：仅对无可选范围（文本输入）的场景生效，
 * 有可选范围时 antd Select 的 maxCount 已限制选择数量
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

    const [visible, setVisible] = React.useState(true);
    const CustomComponent = ViewBindPlugin.getInstance().get(OperatorSelectViewPluginKey);
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
        <ResizableModal
            title={"请选择操作人"}
            open={visible}
            destroyOnHidden
            onCancel={() => {
                setVisible(false);
                props.onChange({});
            }}
            onOk={() => {
                form.submit();
            }}
        >
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                initialValues={buildOperatorInitialValues(props.options)}
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
                        >
                            {renderOperatorSelector(option)}
                        </Form.Item>
                    );
                })}
            </Form>
        </ResizableModal>
    )
}