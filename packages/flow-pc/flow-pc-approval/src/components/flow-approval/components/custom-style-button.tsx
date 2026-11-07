import {Button} from "antd";
import React from "react";
import {DisplayStyle, FlowActionDisplay} from "@coding-flow/flow-types";
import {Icon} from "@coding-flow/flow-icons";

interface CustomStyleButtonProps {
    onClick: () => void;
    title: string;
    display?: FlowActionDisplay;
    loading?: boolean;
    disabled?: boolean;
}

/**
 * 解析按钮样式，颜色值不带 # 时补全 #，避免与历史数据中的 # 前缀重复
 */
const toCssColor = (color?: string): string | undefined => {
    if (!color) {
        return undefined;
    }
    return color.startsWith('#') ? color : `#${color}`;
};

/**
 * 解析后端返回的样式 JSON 字符串，非法数据按无样式处理
 */
const parseDisplayStyle = (style?: string): DisplayStyle => {
    if (!style) {
        return {};
    }
    try {
        const data = JSON.parse(style);
        return data && typeof data === 'object' ? data as DisplayStyle : {};
    } catch (e) {
        return {};
    }
};

export const CustomStyleButton: React.FC<CustomStyleButtonProps> = (props) => {

    const display = props.display;
    const title = props.title || display?.title;

    const style = React.useMemo(() => {
        const data = parseDisplayStyle(display?.style);
        const style: React.CSSProperties = {};
        const backgroundColor = toCssColor(data.backgroundColor);
        if (backgroundColor) {
            style.backgroundColor = backgroundColor;
        }
        const borderColor = toCssColor(data.borderColor);
        if (borderColor) {
            style.borderColor = borderColor;
        }
        if (data.borderRadius) {
            style.borderRadius = Number.parseInt(data.borderRadius);
        }
        if (data.borderSize) {
            style.borderWidth = Number.parseInt(data.borderSize);
        }
        return style;
    }, [display]);

    return (
        <Button
            onClick={props.onClick}
            style={style}
            loading={props.loading}
            disabled={props.disabled}
            icon={display?.icon?<Icon type={display.icon} />:undefined}
        >
            {title}
        </Button>
    )
}
