import {Condition} from "@/script-components/components/condition/typings";
import {Input, Select, Space} from "antd";
import React from "react";
import {useConditionContext} from "@/script-components/components/condition/hooks/use-condition-context";
import {GroovyVariableMapping} from "@/script-components/typings";

interface ConditionItemViewProps {
    data?: Condition;
    id: string;
    location: 'left' | 'right';
    disabled?: boolean;
}

interface ConditionInputProps {
    value: string;
    onChange: (value: Condition) => void;
    disabled?: boolean;
}

const VariableSelect: React.FC<ConditionInputProps> = (props) => {

    const {state} = useConditionContext();

    const variables = React.useMemo(() => {
        const groups = new Map<string, GroovyVariableMapping[]>();

        for (const mapping of state.variables) {
            const existing = groups.get(mapping.tag) || [];
            existing.push(mapping);
            groups.set(mapping.tag, existing);
        }

        const options: any[] = [];
        for (const group of Array.from(groups.keys())) {
            const children = groups.get(group) || [];

            options.push({
                label: group,
                options: children,
            })
        }

        return options;
    }, [state.variables]);

    const handleChange = (value: string, option: any) => {
        props.onChange({
            label: option.label,
            value: option.value,
            dataType: option.type,
            type: 'variable',
        });
    }

    return (
        <Select
            disabled={props.disabled}
            showSearch={{
                filterOption: (value: string, option) => {
                    if (option.value) {
                        return option.value.includes(value) || option.label.includes(value);
                    }
                    return false;
                }
            }}
            value={props.value}
            placeholder={"请选择参数"}
            style={{width: "200px"}}
            options={variables}
            onChange={handleChange}
        />
    )
}

const TypeInput: React.FC<ConditionInputProps> = (props) => {

    const handleChange = (value: string) => {
        props.onChange({
            label: value,
            value: value,
            dataType: 'STRING',
            type: 'input',
        });
    }

    return (
        <Input
            disabled={props.disabled}
            style={{width: "200px"}}
            value={props.value}
            placeholder={"请输入参数"}
            onChange={(event)=>{
                handleChange(event.target.value);
            }}
        />
    )
}

export const ConditionItemView: React.FC<ConditionItemViewProps> = (props) => {
    const [type, setType] = React.useState(props.data?.type || 'variable');

    const {context} = useConditionContext();

    const presenter =  context.getPresenter().getConditionGroupPresenter();

    const handleUpdate = (value: any) => {
        const latest = {
            ...props.data,
            ...value
        }
        presenter.updateCondition(props.id,props.location, latest);
    }

    React.useEffect(()=>{
        if(props.data) {
            setType(props.data.type);
        }
    },[props.data])

    return (
        <Space.Compact>
            <Select
                style={{width: "100px"}}
                value={type}
                disabled={props.disabled}
                options={[
                    {
                        label: '选择变量',
                        value: 'variable'
                    },
                    {
                        label: '输入参数',
                        value: 'input'
                    }
                ]}
                onChange={(value) => {
                    setType(value);
                }}
            />
            {type === "variable" && (
                <VariableSelect
                    disabled={props.disabled}
                    value={props.data?.value || ''}
                    onChange={(value) => {
                        handleUpdate(value)
                    }}
                />
            )}

            {type === "input" && (
                <TypeInput
                    disabled={props.disabled}
                    value={props.data?.value || ''}
                    onChange={(value) => {
                        handleUpdate(value)
                    }}
                />
            )}

        </Space.Compact>
    )
}