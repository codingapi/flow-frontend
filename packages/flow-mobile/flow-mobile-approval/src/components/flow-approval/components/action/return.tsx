import React from "react";
import {FlowActionProps} from "./type";
import {Form, Toast} from "antd-mobile";
import {ApprovalViewPluginAction, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {ReturnView} from "@/plugins/view/return-view";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {EventBus, ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_ACTION_RETURN_KEY} from "@/components/flow-approval";

/**
 * 退回
 * @param props
 * @constructor
 */
export const ReturnAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const [modalVisible, setModalVisible] = React.useState(false);

    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

    const handlerOK = () => {
        if (actionRef.current) {
            actionRef.current.onValidate().then(res => {
                if (res) {
                    form.submit();
                }
            })
            return;
        }
        form.submit();
    }

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                Toast.show("操作成功");
                setModalVisible(false);
                context.close();
            }
        });
    }

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            form.resetFields();
            setModalVisible(true);
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);


    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_RETURN_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    return (
        <>
            <PopupModal
                title={"退回审批"}
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                onOk={() => {
                    handlerOK();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        handleSubmit(values);
                    }}
                >
                    <Form.Item
                        name={"backNodeId"}
                        label={"退回节点"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message: '退回节点不能为空'
                            }
                        ]}
                    >
                        <ReturnView
                            action={actionRef}
                        />
                    </Form.Item>
                </Form>
            </PopupModal>
        </>
    )
}