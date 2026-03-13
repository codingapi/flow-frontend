import React from "react";
import {Popup} from "antd-mobile";


interface PopupModalProps {
    open: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    onOk?: () => void;
    title?: string;
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
                height: '40vh',
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
                        props.onOk?.();
                    }}>确定</a>
                </div>
            </div>
            {props.children}
        </Popup>
    )
}