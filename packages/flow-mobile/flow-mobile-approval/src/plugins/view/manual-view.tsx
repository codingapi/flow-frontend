import React from "react";
import {ApprovalViewPluginAction, ManualViewPlugin, ManualViewPluginKey} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {Selector,Form} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";

export const ManualView: React.FC<ManualViewPlugin> = (props) => {
    const ManualViewComponent = ViewBindPlugin.getInstance().get(ManualViewPluginKey);
    const [visible, setVisible] = React.useState(true);
    const [form] = Form.useForm();

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

    const handleOk = (value: any) => {
        const manualNodeId = value?.manualNodeId;
        props.onChange(manualNodeId?manualNodeId[0]:'');
        setVisible(false);
    }

    return (
        <PopupModal
            title={"请选择下一节点"}
            open={visible}
            onClose={() => {
                setVisible(false)
            }}
            onOk={() => {
                handlerOK();
            }}
        >
            <Form
                form={form}
                onFinish={handleOk}
            >
                <Form.Item
                    name={"manualNodeId"}
                    label={"下级节点"}
                >
                    <Selector
                        multiple={false}
                        options={props.options.map((option) => {
                            return {
                                label: option.name,
                                value: option.id,
                            }
                        })}
                    />
                </Form.Item>
            </Form>
        </PopupModal>
    )
}