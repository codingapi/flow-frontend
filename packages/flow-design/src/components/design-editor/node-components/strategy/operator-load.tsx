import React from "react";
import {Button, Form, Select, Space} from "antd";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {EditOutlined} from "@ant-design/icons";
import {GroovyScriptPreview} from "@/script-components/components/groovy-script-preview";
import {OperatorLoadConfigModal} from "@/script-components/modal/operator-load-config-modal";

const SELECT_TYPE_OPTIONS = [
    {label: '脚本指定', value: 'SCRIPT'},
    {label: '发起人设定', value: 'INITIATOR_SELECT'},
    {label: '审批人设定', value: 'APPROVER_SELECT'},
];

const SELECT_TYPE_LABEL_MAP: Record<string, string> = {
    'INITIATOR_SELECT': '发起人设定',
    'APPROVER_SELECT': '审批人设定',
};

/**
 * 操作人配置策略
 * @constructor
 */
export const OperatorLoadStrategy:React.FC = () => {

    const [form] = Form.useForm();
    const [visible,setVisible] = React.useState(false);

    return (
        <Form
            form={form}
            style={{
                width: '100%',
            }}
            layout="vertical"
        >
            <Form.Item
                label={"操作人设定方式"}
                name={["OperatorLoadStrategy","selectType"]}
                tooltip={"选择操作人的指定方式"}
            >
                <Field
                    name="OperatorLoadStrategy.selectType"
                    render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                        <Select
                            value={value || 'SCRIPT'}
                            options={SELECT_TYPE_OPTIONS}
                            onChange={onChange}
                        />
                    )}
                />
            </Form.Item>

            <Field
                name="OperatorLoadStrategy.selectType"
                render={({ field: { value: selectType } }: FieldRenderProps<any>) => {
                    if (selectType && selectType !== 'SCRIPT') {
                        return (
                            <Form.Item label={"当前操作人"}>
                                <span>{SELECT_TYPE_LABEL_MAP[selectType] || selectType}</span>
                            </Form.Item>
                        );
                    }
                    return (
                        <Form.Item
                            label={"当前操作人"}
                            name={["OperatorLoadStrategy","script"]}
                            tooltip={"设定流程的审批人"}
                        >
                            <Field
                                name="OperatorLoadStrategy.script"
                                render={({ field: { value, onChange } }: FieldRenderProps<any>) => (
                                    <Space.Compact style={{width: '100%'}}>
                                        <GroovyScriptPreview
                                            script={value}
                                        />

                                        <Button
                                            icon={<EditOutlined/>}
                                            onClick={() => {
                                                setVisible(true);
                                            }}
                                            style={{borderRadius: '0 6px 6px 0'}}
                                        >
                                            编辑
                                        </Button>

                                        <OperatorLoadConfigModal
                                            script={value}
                                            open={visible}
                                            onCancel={()=>{setVisible(false);}}
                                            onConfirm={(value)=>{
                                                onChange(value);
                                            }}
                                        />

                                    </Space.Compact>
                                )}
                            />
                        </Form.Item>
                    );
                }}
            />
        </Form>
    )
}
