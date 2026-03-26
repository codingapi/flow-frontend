import React from "react";
import {ActionModalProps} from "@/script-components/typings";
import {Modal} from "antd";
import {ActionForm} from "@/script-components/components/action";


export const ActionConfigModal: React.FC<ActionModalProps> = (props) => {
    return (
        <Modal
            open={props.open}
            onCancel={props.onCancel}
            title={"编辑按钮"}
            width={"70%"}
            destroyOnHidden={true}
            onOk={()=>{
                props.form.submit();
            }}
        >
            <ActionForm
                nodeId={props.nodeId}
                form={props.form}
                manager={props.manager}
                onFinish={(values) => {
                    props.onFinish(values);
                    props.onCancel();
                }}
            />
        </Modal>
    )
}