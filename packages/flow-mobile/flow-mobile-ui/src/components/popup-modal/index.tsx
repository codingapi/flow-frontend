import React from "react";
import {Popup} from "antd-mobile";


interface PopupModalProps {
    open: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    onOk?: () => void;
    title?: string;
    loading?: boolean;
    /** 弹层高度，默认 40vh。用于顺序弹出多个弹层时以不同高度区分层级 */
    height?: string;
}

export const PopupModal: React.FC<PopupModalProps> = (props) => {

    return (
        <Popup
            visible={props.open}
            onMaskClick={() => {
                props.onClose?.();
            }}
            onClose={() => {
                props.onClose?.();
            }}

            bodyStyle={{
                height: props.height || '40vh',
            }}
        >
            <div style={{
                width: '100%',
                height: 30,
            }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: 10
                    }}
                >
                    <a onClick={()=>{
                        props.onClose?.();
                    }}>取消</a>
                    {props.title}
                    <a onClick={()=>{
                        if (props.loading) return;
                        props.onOk?.();
                    }}>{props.loading ? '提交中...' : '确定'}</a>
                </div>
            </div>
            {props.children}
        </Popup>
    )
}