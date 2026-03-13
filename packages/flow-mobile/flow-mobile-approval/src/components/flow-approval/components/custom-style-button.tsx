import React from "react";
import { Button, Space } from "antd-mobile";
import {DisplayStyle, FlowActionDisplay} from "@flow-engine/flow-types";
import {Icon} from "@flow-engine/flow-icons";

interface CustomStyleButtonProps {
    onClick: () => void;
    title: string;
    display?: FlowActionDisplay;
}

export const CustomStyleButton: React.FC<CustomStyleButtonProps> = (props) => {

    const display = props.display;
    const title = display?.title || props.title;

    const style = React.useMemo(() => {
        if (display) {
            const data = JSON.parse(display.style) as DisplayStyle | undefined;
            if (data) {
                let style = {}
                if (data.backgroundColor) {
                    style = Object.assign(data, {backgroundColor: `#${data.backgroundColor}`});
                }
                if (data.borderColor) {
                    style = Object.assign(data, {borderColor: `#${data.borderColor}`});
                }
                if (data.borderRadius) {
                    style = Object.assign(data, {borderRadius: Number.parseInt(data.borderRadius)});
                }
                if (data.borderSize) {
                    style = Object.assign(data, {borderWidth: Number.parseInt(data.borderSize)});
                }
                return style;
            }
        }
        return {}
    }, [display]);


    return (
        <Button
            onClick={props.onClick}
            style={{
                ...style,
                width: '100%',
                padding: '10px',
                margin: '5px',
            }}
        >
           <Space>
               {props.display?.icon && (<Icon type={props.display.icon}/>)}
               <span>{title}</span>
           </Space>
        </Button>
    )
}