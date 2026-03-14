import React from "react";
import {SubProcessViewPlugin, VIEW_KEY} from "@/plugins/sub-process-view-type";
import {GroovyScriptConvertorUtil, ViewBindPlugin} from "@flow-engine/flow-core";
import {SCRIPT_DEFAULT_SUB_PROCESS} from "@/script-components/default-script";
import {Button, Space} from "antd";
import {CodeOutlined, ReloadOutlined} from "@ant-design/icons";
import {SubProcessView} from "@/script-components/components/sub-process";


/**
 * @param props
 * @constructor
 */
export const SubProcessPluginView: React.FC<SubProcessViewPlugin> = (props) => {

    const SubProcessPluginViewComponent = ViewBindPlugin.getInstance().get(VIEW_KEY);
    if(SubProcessPluginViewComponent){
        return (
            <SubProcessPluginViewComponent {...props} />
        );
    }

    return (
        <div>

            <SubProcessView
                value={props.script}
                onChange={props.onChange}
            />

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
                        props.onChange(SCRIPT_DEFAULT_SUB_PROCESS);
                    }}
                >
                    重置脚本
                </Button>
            </Space>
        </div>
    );
}
