import React from "react";
import {FlowActionProps} from "./type";
import {Form, Input, message, Modal} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {APPROVAL_ACTION_REJECT_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

const {TextArea} = Input;

/**
 * 拒绝
 * @param props
 * @constructor
 */
export const RejectAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {state, context} = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                message.success("操作成功");
                setModalVisible(false);
                context.close();
            }
        });
    }

    const adviceRules = state.flow?.adviceRequired ? [
        {
            required: state.flow?.adviceRequired || false,
            message: '请输入审批意见'
        }
    ] : [];


    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_REJECT_KEY);

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
                title={"审批拒绝"}
                open={modalVisible}
                maskClosable={false}
                mask={{
                    closable: false,
                }}
                onCancel={() => setModalVisible(false)}
                onOk={() => {
                    form.submit();
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
                        name={"advice"}
                        label={"拒绝意见"}
                        required={state.flow?.adviceRequired}
                        rules={adviceRules}
                    >
                        <TextArea placeholder={"请输入拒绝意见"}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}