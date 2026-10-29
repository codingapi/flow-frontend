import React from "react";
import {ActionFormProps} from "@/script-components/typings";
import {Col, Form, Row} from "antd";
import {ActionRejectView} from "@/plugins/view/action-reject-view";
import {GroovyScriptLoader, GroovyScriptLoaderContent} from "@/script-components/components/groovy-script-loader";
import {ActionRejectScriptUtils} from "@/script-components/services/action-reject";

/**
 * 按节点id创建脚本加载器的内容组件。
 * <p>
 * 使用工厂返回稳定的组件类型，避免父组件每次渲染都生成新的组件类型导致下拉框重新挂载。
 */
const createRejectScriptContent = (nodeId: string): React.FC<GroovyScriptLoaderContent> => {
    const RejectScriptContent: React.FC<GroovyScriptLoaderContent> = (contentProps) => (
        <ActionRejectView
            nodeId={nodeId}
            value={contentProps.value}
            onChange={contentProps.onChange}
        />
    );
    return RejectScriptContent;
};

export const RejectActionForm: React.FC<ActionFormProps> = (props) => {

    const script = Form.useWatch("script", props.form) as string | undefined;
    const content = React.useMemo(() => createRejectScriptContent(props.nodeId), [props.nodeId]);

    return (
        <Row>
            <Col span={24}>
                <Form.Item
                    name={"script"}
                    tooltip={"退回的节点,当选择终止时则直接结束当前流程"}
                    label={"拒绝策略"}
                    help={"配置拒绝时跳转的节点"}
                >
                    {ActionRejectScriptUtils.isInlineScript(script) ? (
                        // 兼容历史数据：脚本字段中保存的是脚本正文，直接按正文回显；
                        // 保存流程时后端会将其归一化为脚本key
                        <ActionRejectView
                            nodeId={props.nodeId}
                        />
                    ) : (
                        // 脚本字段保存脚本key，脚本正文由脚本接口按key加载与保存
                        <GroovyScriptLoader
                            content={content}
                        />
                    )}
                </Form.Item>
            </Col>
        </Row>
    )
}