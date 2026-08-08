import React from "react";
import {ActionFormProps} from "@/script-components/typings";
import {OperatorLoadPluginView} from "@/plugins/view/operator-load-view";
import {MaxOperatorCountInput} from "@/script-components/components/action/components/max-operator-count";
import {Col, Form, Row } from "antd";



interface DelegateInputProps{
    value?:string;
    onChange?:(value:string) => void;
}

const DelegateInput:React.FC<DelegateInputProps> = (props)=>{

    const script = props.value || '';

    const handleChange = (value:string)=>{
        props.onChange && props.onChange(value);
    }

    return (
        <OperatorLoadPluginView
            script={script}
            onChange={handleChange}
        />
    )
}

export const DelegateActionForm:React.FC<ActionFormProps> = (props)=>{

    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"maxOperatorCount"}
                    label={"最大可选人数"}
                    help={"限制委派时可选人数的最大值，-1 表示不限制；固定为 1 时即为单选"}
                >
                    <MaxOperatorCountInput/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    name={"script"}
                    label={"委派人员范围"}
                    help={"委派人员范围为空时，即为全部人员"}
                >
                    <DelegateInput/>
                </Form.Item>
            </Col>
        </Row>
    )
}