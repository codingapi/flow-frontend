import React from "react";
import {NodeTitleScriptUtils} from "@/script-components/services/node-title";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {GroovyScriptPreview} from "@/script-components/components/groovy-script-preview";
import {VariablePicker} from "@/script-components/components/variable-picker";
import {Button, Input, Space} from "antd";
import {CodeOutlined, ReloadOutlined} from "@ant-design/icons";
import {NodeTitleViewPlugin, VIEW_KEY} from "@/plugins/node-title-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {SCRIPT_DEFAULT_NODE_TITLE} from "@/script-components/default-script";

const {TextArea} = Input;


export const NodeTitlePluginView: React.FC<NodeTitleViewPlugin> = (props) => {
    const NodeTitlePluginViewComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
    if(NodeTitlePluginViewComponent){
        return (
            <NodeTitlePluginViewComponent {...props} />
        );
    }

    const title = GroovyScriptConvertorUtil.getScriptTitle(props.script);

    return (
        <div>
            <div>
                预览
                <GroovyScriptPreview
                    script={props.script}
                    multiline={true}
                />
            </div>


            <div>
                内容
                <TextArea
                    value={title}
                    onChange={(e) => {
                        props.onChange(NodeTitleScriptUtils.updateExpression(props.script,e.target.value,props.variables));
                    }}
                    placeholder="请输入标题配置脚本，支持使用变量"
                    autoSize={{minRows: 3, maxRows: 12}}
                />
            </div>

            <Space
                style={{
                    marginTop: 8
                }}
            >
                <VariablePicker
                    mappings={props.variables}
                    onSelect={(variable) => {
                        props.onChange(NodeTitleScriptUtils.addVariable(props.script,variable,props.variables));
                    }}
                />
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
                        props.onChange(SCRIPT_DEFAULT_NODE_TITLE);
                    }}
                >
                    重置脚本
                </Button>
            </Space>
        </div>
    );
}
