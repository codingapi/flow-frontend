import {CloseCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Space} from "antd";
import React from "react";
import {IdUtils} from "@/utils";

interface FieldAttribute {
    label?: string;
    value?: string;
    key: string;
}

interface FieldAttributeItemProps {
    value: FieldAttribute;
    onChange: (value: FieldAttribute) => void;
    onDelete: (key:string) => void;
}


const FieldAttributeItem = (props: FieldAttributeItemProps) => {

    const attribute = props.value;

    const handleChangeLabel = (label: string) => {
        props.onChange({
            ...attribute,
            label: label,
        });
    }

    const handleChangeValue = (value: string) => {
        props.onChange({
            ...attribute,
            value: value,
        });
    }


    return (
        <Space style={{
            margin:5
        }}>
            <span>名称:</span>
            <Input
                placeholder={"请输入附加属性名称"}
                value={attribute.label}
                onChange={(event) => {
                    handleChangeLabel(event.target.value);
                }}
            />
            <span>值:</span>
            <Input
                placeholder={"请输入附加属性值"}
                value={attribute.value}
                onChange={(event) => {
                    handleChangeValue(event.target.value);
                }}
            />
            <Button
                type={"link"}
                danger
                icon={<CloseCircleOutlined/>}
                onClick={()=>{
                    props.onDelete(attribute.key);
                }}
            >
                移除
            </Button>
        </Space>
    )
}


interface FieldAttributeFormAction {
    addAttribute: (key: string) => void;
}

interface FieldAttributeFormProps {
    value?: any;
    onChange?: (value: any) => void;
    actionRef?: React.Ref<FieldAttributeFormAction|undefined>;
}

export const FieldAttributeValue: React.FC<FieldAttributeFormProps> = (props) => {

    const [attributes, setAttributes] = React.useState<FieldAttribute[]>([]);

    React.useEffect(()=>{
        setAttributes(props.value || []);
    },[]);

    React.useImperativeHandle(props.actionRef, () => {
        return {
            addAttribute: (key: string) => {
                setAttributes(prevState => {
                    return [...prevState, {
                        key: key
                    }]
                })
            }
        }
    }, [attributes]);

    const handleDelete = (key:string) => {
        setAttributes(prevState => {
            return prevState.filter(item => item.key !== key);
        })
    }

    const handleChange = (attribute: FieldAttribute) => {
        setAttributes(prevState => {
            return prevState.map(item => {
                if (item.key === attribute.key) {
                    return attribute
                } else {
                    return item
                }
            });
        })
    }

    React.useEffect(() => {
        props.onChange?.(attributes.filter(item=>{
            return item.label || item.value
        }));
    }, [attributes]);

    return (
        <Col span={24}>
            {attributes.map((attribute, index) => {
                return (
                    <FieldAttributeItem
                        value={attribute}
                        key={index}
                        onChange={handleChange}
                        onDelete={handleDelete}
                    />
                )
            })}
        </Col>
    )
}


export const FieldAttributeForm = () => {

    const actionRef = React.useRef<FieldAttributeFormAction>();

    return (
        <Form.Item
            name={"attributes"}
            help={"附加属性，主要用于一些复杂的表单控制界面"}
            label={(
                <Space>
                    <span>附加属性</span>
                    <Button
                        type={"link"}
                        icon={<PlusCircleOutlined/>}
                        onClick={()=>{
                            actionRef.current?.addAttribute(IdUtils.generateId());
                        }}
                    >
                        添加属性
                    </Button>
                </Space>
            )}
        >
            <FieldAttributeValue actionRef={actionRef}/>
        </Form.Item>
    )
}