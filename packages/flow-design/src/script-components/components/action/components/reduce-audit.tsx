import React from "react";
import {ActionFormProps} from "@/script-components/typings";
import {Col, Form, Row} from "antd";
import {OperatorLoadPluginView} from "@/plugins/view/operator-load-view";

interface ReduceAuditInputProps{
    value?:string;
    onChange?:(value:string) => void;
}

const ReduceAuditInput:React.FC<ReduceAuditInputProps> = (props)=>{

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

/**
 * 减签动作配置
 *
 * 仅配置可减签的人员范围，不需要「最大可选人数」：一次减签可以撤下多位审批人。
 */
export const ReduceAuditActionForm:React.FC<ActionFormProps> = (props)=>{

    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"script"}
                    label={"减签人员范围"}
                    help={"减签人员范围为空时，即为全部人员；仅对循序/并签多人审批节点生效"}
                >
                    <ReduceAuditInput/>
                </Form.Item>
            </Col>
        </Row>
    )
}
