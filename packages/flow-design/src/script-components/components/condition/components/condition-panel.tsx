import React from "react";
import {RelationPanel} from "@/script-components/components/condition/components/condition-relation";
import {Group} from "@/script-components/components/condition/components/condition-group";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {SCRIPT_DEFAULT_CONDITION} from "@/script-components/default-script";
import {Button, Space} from "antd";
import {CodeOutlined, ReloadOutlined} from "@ant-design/icons";
import {useConditionContext} from "@/script-components/components/condition/hooks/use-condition-context";
import {ConditionPanelProps} from "@/script-components/components/condition/typings";
import {
    useConditionScriptConvertor
} from "@/script-components/components/condition/hooks/use-condition-script-convertor";


export const ConditionPanel: React.FC<ConditionPanelProps> = (props) => {
    const {context} = useConditionContext();
    const presenter = context.getPresenter();
    useConditionScriptConvertor(props);

    return (
        <div>
            <div>
                关系
                <RelationPanel/>
            </div>
            <div>
                条件
                <Group/>
            </div>
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
                        presenter.clearState();
                        props.onChange(SCRIPT_DEFAULT_CONDITION);
                    }}
                >
                    重置脚本
                </Button>
            </Space>
        </div>
    )
}