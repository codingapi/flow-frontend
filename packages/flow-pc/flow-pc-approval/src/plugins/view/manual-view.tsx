import React from "react";
import {ManualViewPlugin, ManualViewPluginKey} from "@coding-flow/flow-approval-presenter"
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {ResizableModal} from "@/components/flow-approval/components/resizable-modal";
import {Select, Form} from "antd";
import {ApprovalViewPluginAction} from "@coding-flow/flow-approval-presenter";


export const ManualView: React.FC<ManualViewPlugin> = (props) => {
    const [visible, setVisible] = React.useState(true);
    const ManualViewComponent = ViewBindPlugin.getInstance().get(ManualViewPluginKey);

    const [form] = Form.useForm();

    const handlerFinish = (value: any) => {
        props.onChange(value?.manualNodeId || '');
        setVisible(false);
    }

    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

    const handlerOK = ()=>{
        if(actionRef.current){
            actionRef.current.onValidate().then(res=>{
                if(res){
                    form.submit();
                }
            })
            return;
        }
        form.submit();
    }

    if (ManualViewComponent) {
        return (
            <ManualViewComponent
                {...props}
                action={actionRef}
            />
        );
    }
    return (
        <ResizableModal
            title={"请选择下级节点"}
            open={visible}
            destroyOnHidden
            onCancel={() => setVisible(false)}
            onOk={() => {
                handlerOK();
            }}
        >
            <Form
                form={form}
                onFinish={handlerFinish}
                layout="vertical"
            >
                <Form.Item
                    name={"manualNodeId"}
                    label={"下级节点"}
                >
                    <Select
                        placeholder={"请选择下级节点走向"}
                        options={props.options.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        })}
                    />
                </Form.Item>
            </Form>

        </ResizableModal>
    )
}