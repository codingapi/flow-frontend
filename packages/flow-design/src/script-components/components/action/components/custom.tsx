import React from "react";
import { ActionFormProps, ActionSelectOption } from "@/script-components/typings";
import { Col, Form, Input, Radio, Row } from "antd";
import { ActionCustomView } from "@/plugins/view/action-custom-view";
import { GroovyScriptLoader, GroovyScriptLoaderContent } from "../../groovy-script-loader";



const ScriptEditorContent: React.FC<GroovyScriptLoaderContent> = (props) => {

    return (
        <>
            <ActionCustomView
                scriptKey={props.scriptKey}
                value={props.value}
                onChange={props.onChange}
            />
        </>
    )
}


export const CustomActionForm: React.FC<ActionFormProps> = (props) => {

    const [customType, setCustomType] = React.useState("0");

    React.useEffect(() => {
        const customType = props.form.getFieldValue('customType');
        if (customType) {
            setCustomType(customType);
            return;
        }
        const triggerFrontEvent = props.form.getFieldValue('triggerFrontEvent');
        if (triggerFrontEvent) {
            setCustomType("-1");
            props.form.setFieldValue('customType',"-1");
            return;
        }

        const script = props.form.getFieldValue('script');
        if (script) {
            setCustomType("1");
            props.form.setFieldValue('customType',"1");
            return;
        }

        setCustomType("0");

    }, [props, customType]);


    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"customType"}
                    label={"脚本类型"}
                >
                    <Radio.Group
                        value={customType}
                        onChange={(e) => {
                            setCustomType(e.target.value);
                        }}
                    >
                        <Radio value={"-1"}>前端模式</Radio>
                        <Radio value={"1"}>后端模式</Radio>
                    </Radio.Group>
                </Form.Item>

                {customType === "-1" && (
                    <Form.Item
                        name={"triggerFrontEvent"}
                        label={"前端触发事件"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message: '前端触发事件不能为空'
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入前端触发事件"
                        />
                    </Form.Item>
                )}

                {customType === "1" && (
                    <Form.Item
                        name={"script"}
                        label={"后端执行脚本"}
                        rules={[
                            {
                                required: true,
                                message: '自定义脚本不能为空'
                            }
                        ]}
                    >
                        <GroovyScriptLoader
                            content={ScriptEditorContent}
                        />

                    </Form.Item>
                )}

            </Col>
        </Row>
    )
}
