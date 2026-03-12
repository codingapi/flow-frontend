import {Form, message, Modal } from "antd";
import React from "react";
import {Upload} from "./upload";
import {importWorkflow} from "@/api/workflow";


interface DesignImportProps{
    open: boolean;
    onClose: () => void;
}

export const DesignImport:React.FC<DesignImportProps> = (props) => {

    const [form] = Form.useForm();


    return (
        <Modal
            title={"流程导入"}
            open={props.open}
            onCancel={props.onClose}
            destroyOnHidden={true}
            onOk={()=>{
                form.submit();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values)=>{
                    importWorkflow(values).then((res)=>{
                        if(res.success){
                            message.success("流程已导入成功");
                            props.onClose();
                        }
                    })
                }}
            >
                <Form.Item
                    name="file"
                    label={"流程设计文件"}
                    help={"请选择导出的设计文件，文件格式为json格式"}
                >
                    <Upload/>
                </Form.Item>

            </Form>
        </Modal>
    )
}