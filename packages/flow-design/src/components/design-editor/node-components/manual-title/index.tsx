import React, {useCallback, useState} from "react";
import {useIsSidebar} from "@/components/design-editor/hooks";
import {Flex, Input, Space, theme} from "antd";
import {Field, FieldRenderProps, useClientContext} from "@flowgram.ai/fixed-layout-editor";
import {EditOutlined} from "@ant-design/icons";
import {NodeIcon} from "@/components/design-editor/components/node-icon";
import {NodeType} from "@coding-flow/flow-types";
import {FlowNodeRegistry} from "@/components/design-editor/typings";
import {useNodeRenderContext} from "@/components/design-editor/hooks/use-node-render-context";

interface HeaderTitleProps {
    title: string;
    onChange: (value: string) => void;
    readonly?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({title, onChange, readonly}) => {
    const {token} = theme.useToken();
    const [editTitle, setEditTitle] = useState(false);
    const ctx = useClientContext();
    const {playground} = ctx;
    const canAddBranch = playground.config.readonlyOrDisabled;

    const handleChange = useCallback((value: string) => {
        const trimmed = value.trim();
        if (trimmed) {
            onChange(trimmed);
        }
    }, [onChange]);

    if (readonly || canAddBranch) {
        return <span>{title}</span>;
    }

    if (editTitle) {
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

    return (
        <Space>
            <span>{title}</span>
            <EditOutlined
                style={{color: token.colorPrimary, cursor: "pointer"}}
                onClick={() => setEditTitle(true)}
            />
        </Space>
    );
};

interface NodeHeaderProps {
    style?: React.CSSProperties;
    iconEnable?: boolean;
}

export const ManualTitle: React.FC<NodeHeaderProps> = (props) => {
    const {node} = useNodeRenderContext();
    const isSidebar = useIsSidebar();
    const iconEnable = props.iconEnable ?? true;
    const nodeType = node.getNodeRegistry<FlowNodeRegistry>().type as NodeType;

    const headerStyle: React.CSSProperties = {
        width: "100%",
        padding: isSidebar ? "4px 5px" : "5px",
        borderBottom: "1px solid #f0f0f0",
        marginBottom: 8,
        position: "relative",
        ...props.style,
    };

    return (
        <Flex
            style={headerStyle}
            justify="space-between"
            align="center"
        >
            <Space>
                {iconEnable && <NodeIcon type={nodeType}/>}
                <Field name="title">
                    {({field: {value, onChange}}: FieldRenderProps<string>) => (
                        <HeaderTitle
                            title={value}
                            onChange={onChange}
                        />
                    )}
                </Field>
            </Space>

        </Flex>
    );
};