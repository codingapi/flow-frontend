import React from "react";
import {FlowActionProps} from "./type";
import {Form, message, Modal} from "antd";
import {ApprovalViewPluginAction, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {TransferView} from "@/plugins/view/transfer-view";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {APPROVAL_ACTION_TRANSFER_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

/**
 * 转办
 * @param props
 * @constructor
 */
export const TransferAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();


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

    const [modalVisible, setModalVisible] = React.useState(false);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                message.success("操作成功");
                setModalVisible(false);
                context.close();
            }
        });
    }

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_TRANSFER_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    return (
        <>
            <CustomStyleButton
                display={props.action.display}
                onClick={() => {
                    if (props.onClickCheck?.(action.id)) {
                        form.resetFields();
                        setModalVisible(true);
                    }
                }}
                title={action.title}
            />

            <Modal
                title={"转办审批"}
                open={modalVisible}
                maskClosable={false}
                mask={{
                    closable: false,
                }}
                onCancel={() => setModalVisible(false)}
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
                        name={"forwardOperatorIds"}
                        label={"转办人员"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message: '转办人员不能为空'
                            }
                        ]}
                    >
                        <TransferView
                            action={actionRef}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}