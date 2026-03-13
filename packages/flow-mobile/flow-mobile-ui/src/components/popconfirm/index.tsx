import {ActionSheet} from "antd-mobile";
import {Action} from "antd-mobile/es/components/action-sheet";
import React from "react";

interface PopconfirmProps {
    title: string;
    onConfirm?: () => void;
    children?: React.ReactNode;
}

export const Popconfirm: React.FC<PopconfirmProps> = (props) => {

    const [visible, setVisible] = React.useState(false);

    const actions: Action[] = [
        {text: '确认', key: 'ok'},
    ]

    return (
        <>
            <ActionSheet
                extra={props.title}
                cancelText='取消'
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
            />
            <div
                onClick={() => {
                    setVisible(true);
                }}
            >
                {props.children}
            </div>
        </>
    )
}