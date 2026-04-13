import React from "react";
import {OperatorLoadViewPlugin, VIEW_KEY} from "@/plugins/operator-load-view-type";
import {Button, Form, Select, Space} from "antd";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {SCRIPT_DEFAULT_OPERATOR_LOAD, SCRIPT_INITIATOR_SELECT, SCRIPT_APPROVER_SELECT} from "@/script-components/default-script";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {CodeOutlined, ReloadOutlined} from "@ant-design/icons";
import {useScriptMetaData} from "@/script-components/hooks/use-script-meta-data";

const SCRIPT_MAP: Record<string, string> = {
    'creator': SCRIPT_DEFAULT_OPERATOR_LOAD,
    'initiator_select': SCRIPT_INITIATOR_SELECT,
    'approver_select': SCRIPT_APPROVER_SELECT,
};

export const OperatorLoadPluginView: React.FC<OperatorLoadViewPlugin> = (props) => {

    const OperatorLoadPluginViewComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
    const data = useScriptMetaData(props.script);

    if (OperatorLoadPluginViewComponent) {
        return (
            <OperatorLoadPluginViewComponent {...props} />
        );
    }

    return (
        <Form
            initialValues={{
                ...data
            }}
            layout="vertical"
        >
            <Form.Item
                name={"type"}
                label={"指定人员"}
                tooltip={"选择指定人员"}
            >
                <Select
                    options={[
                        {
                            label: '流程创建者',
                            value: 'creator',
                        },
                        {
                            label: '发起人设定',
                            value: 'initiator_select',
                        },
                        {
                            label: '审批人设定',
                            value: 'approver_select',
                        },
                    ]}
                    placeholder={"请选择人员类型"}
                    onChange={(value) => {
                        const script = SCRIPT_MAP[value] || SCRIPT_DEFAULT_OPERATOR_LOAD;
                        props.onChange(script);
                    }}
                />
            </Form.Item>
            <Space
                style={{
                    marginTop: 8
                }}
            >
                <Button
                    icon={<CodeOutlined/>}
                    onClick={() => {
                        props.onChange(GroovyScriptConvertorUtil.toCustomScript(props.script));
                    }}
                >
                    高级配置
                </Button>
                <Button
                    icon={<ReloadOutlined/>}
                    danger={true}
                    onClick={() => {
                        props.onChange(SCRIPT_DEFAULT_OPERATOR_LOAD);
                    }}
                >
                    重置脚本
                </Button>
            </Space>
        </Form>
    )
}
