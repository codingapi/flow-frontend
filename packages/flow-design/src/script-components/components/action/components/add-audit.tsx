import React from "react";
import {ActionFormProps} from "@/script-components/typings";
import {Col, Form, Row} from "antd";
import {OperatorLoadPluginView} from "@/plugins/view/operator-load-view";
import {MaxOperatorCountInput} from "@/script-components/components/action/components/max-operator-count";


interface AddAuditInputProps{
    value?:string;
    onChange?:(value:string) => void;
}

const AddAuditInput:React.FC<AddAuditInputProps> = (props)=>{

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

export const AddAuditActionForm:React.FC<ActionFormProps> = (props)=>{

    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"maxOperatorCount"}
                    label={"最大可选人数"}
                    help={"限制加签时可选人数的最大值，-1 表示不限制；固定为 1 时即为单选"}
                >
                    <MaxOperatorCountInput/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    name={"script"}
                    label={"加签人员范围"}
                    help={"加签人员范围为空时，即为全部人员"}
                >
                    <AddAuditInput/>
                </Form.Item>
            </Col>
        </Row>
    )
}