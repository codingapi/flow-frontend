import React, {useCallback, useMemo, useState} from "react";
import {useIsSidebar} from "@/components/design-editor/hooks";
import {Button, Flex, Input, Space, theme, Typography} from "antd";
import {nodeFormPanelFactory} from "@/components/design-editor/components/sidebar";
import {usePanelManager} from "@flowgram.ai/panel-manager-plugin";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import {NodeIcon} from "@/components/design-editor/components/node-icon";
import {NodeType} from "@coding-flow/flow-types";
import {FlowNodeRegistry} from "@/components/design-editor/typings";
import {useNodeRenderContext} from "@/components/design-editor/hooks/use-node-render-context";
import styles from "./index.module.scss";

interface HeaderTitleProps {
    title: string;
    onChange: (value: string) => void;
    readonly?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({title, onChange, readonly}) => {
    const {token} = theme.useToken();
    const [editTitle, setEditTitle] = useState(false);
    const isSidebar = useIsSidebar();
    const {node} = useNodeRenderContext();

    const registry = node.getNodeRegistry<FlowNodeRegistry>();
    const editTitleDisabled = useMemo(() => {
        const {meta} = registry;
        return meta?.editTitleDisable ?? false;
    }, [registry, node]);

    const handleChange = useCallback((value: string) => {
        const trimmed = value.trim();
        if (trimmed) {
            onChange(trimmed);
        }
    }, [onChange]);

    // 面板编辑态：行内输入框
    if (isSidebar && editTitle && !readonly && !editTitleDisabled) {
        return (
            <Input
                autoFocus
                size="small"
                style={{width: 200}}
                defaultValue={title}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                onBlur={() => setEditTitle(false)}
                onPressEnter={(e) => {
                    handleChange((e.target as HTMLInputElement).value);
                    setEditTitle(false);
                }}
                placeholder={"请输入标题名称"}
            />
        );
    }

    // 画布紧凑态：保持原有纯文本展示，不做截断
    if (!isSidebar) {
        return <span>{title}</span>;
    }

    // 面板只读/禁止编辑态：截断文本，无编辑图标
    if (readonly || editTitleDisabled) {
        return <span className={styles.titleText} title={title}>{title}</span>;
    }

    // 面板可编辑态：标题过长时省略号截断（title 悬浮显示完整标题），并保留编辑图标
    return (
        <span className={styles.headerTitle}>
            <span className={styles.titleText} title={title}>{title}</span>
            <EditOutlined
                style={{color: token.colorPrimary, cursor: "pointer"}}
                onClick={() => setEditTitle(true)}
            />
        </span>
    );
};

interface NodeHeaderProps {
    style?: React.CSSProperties;
    iconEnable?: boolean;
}

export const NodeHeader: React.FC<NodeHeaderProps> = (props) => {
    const {node} = useNodeRenderContext();
    const isSidebar = useIsSidebar();
    const panelManager = usePanelManager();
    const {token} = theme.useToken();
    const iconEnable = props.iconEnable ?? true;

    const nodeType = node.getNodeRegistry<FlowNodeRegistry>().type as NodeType;

    const handleClose = useCallback(() => {
        panelManager.close(nodeFormPanelFactory.key);
    }, [panelManager]);

    // NodePanel 容器有 3px padding，用负 margin + calc 让 header 色块向外扩展铺满并贴合卡片顶部圆角，消除四周白边
    const headerStyle: React.CSSProperties = {
        width: "calc(100% + 6px)",
        boxSizing: "border-box",
        margin: "-3px -3px 8px -3px",
        padding: "3px 8px",
        background: token.colorPrimaryBg,
        borderBottom: `1px solid ${token.colorPrimaryBorder}`,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        position: "relative",
        ...props.style,
    };

    // 画布紧凑态：保持原有布局不变
    if (!isSidebar) {
        return (
            <Flex style={headerStyle} justify="space-between" align="center">
                <Space>
                    {iconEnable && <NodeIcon type={nodeType}/>}
                    <Field name="title">
                        {({field: {value, onChange}}: FieldRenderProps<string>) => (
                            <HeaderTitle title={value} onChange={onChange}/>
                        )}
                    </Field>
                    <Field name="order">
                        {({field: {value, onChange}}: FieldRenderProps<string>) => {
                            if (nodeType === 'INCLUSIVE_BRANCH' || nodeType === 'CONDITION_BRANCH' || nodeType === 'PARALLEL_BRANCH') {
                                return <>优先级:{value}</>;
                            }
                            return <></>;
                        }}
                    </Field>
                </Space>
            </Flex>
        );
    }

    // 面板态：标题与节点 ID 同行，标题过长省略截断，ID 与关闭按钮固定右侧
    return (
        <Flex style={headerStyle} justify="space-between" align="center">
            <div className={styles.titleGroup}>
                {iconEnable && <NodeIcon type={nodeType}/>}
                <Field name="title">
                    {({field: {value, onChange}}: FieldRenderProps<string>) => (
                        <HeaderTitle title={value} onChange={onChange}/>
                    )}
                </Field>
            </div>

            <div className={styles.rightGroup}>
                {/* 节点 ID 由后端创建，与标题同行只读展示并支持复制，供脚本/条件等配置引用 */}
                <Typography.Text
                    type="secondary"
                    className={styles.nodeId}
                    copyable={{text: node.id, tooltips: ["复制节点 ID", "已复制"]}}
                >
                    ID：{node.id}
                </Typography.Text>
                <Button
                    type="text"
                    icon={<CloseOutlined style={{color: token.colorPrimary}}/>}
                    onClick={handleClose}
                />
            </div>
        </Flex>
    );
};